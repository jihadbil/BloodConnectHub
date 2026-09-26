import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Plus,
    Users2,
    Phone,
    Calendar,
    Search,
    Trash2,
    Edit,
    Loader2,
    RefreshCw,
    AlertCircle,
    Droplet,
    MapPin,
    FileText,
    User
} from "lucide-react";
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient, usePatientRequests } from "@/hooks/usePatients";
import { BLOOD_TYPE_MAP, BLOOD_TYPE_REVERSE_MAP } from "@/types/api";
import { formatDate, mapGender } from "@/lib/utils";
import type { Gender, CreatePatientRequest, UpdatePatientRequest } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { patientsApi } from "@/api/patients";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Loading skeleton for table
const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
        ))}
    </div>
);

const PatientsManagement = () => {
    const { toast } = useToast();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBloodType, setFilterBloodType] = useState("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        nationalId: "",
        gender: "" as Gender | "",
        dateOfBirth: "",
        phone: "",
        bloodType: "",
        city: ""
    });

    // جلب البيانات
    const { data, isLoading, error, refetch } = usePatients(page, 10);
    const createPatient = useCreatePatient();
    const updatePatient = useUpdatePatient();
    const deletePatient = useDeletePatient();

    // تحويل البيانات
    const patients = data?.data?.items?.map(patient => {
        // Handle different possible field names from API
        const patientAny = patient as any;
        // API يُرجع patientID (PascalCase) وليس patientId (camelCase)
        const patientId = patientAny.patientID ?? patientAny.PatientID ?? patient.patientId ?? patientAny.id ?? 0;
        const bloodTypeId = patient.bloodTypeId ?? patientAny.BloodTypeID ?? patientAny.bloodTypeID;
        const bloodTypeName = patient.bloodType?.typeName ?? patientAny.bloodType?.TypeName ?? patientAny.BloodType?.typeName ?? patientAny.BloodType?.TypeName;

        return {
            id: patientId,
            name: patient.fullName,
            nationalId: patient.nationalId ?? patientAny.nationalID ?? patientAny.NationalID,
            bloodType: bloodTypeName || BLOOD_TYPE_MAP[bloodTypeId] || 'غير محدد',
            bloodTypeId: bloodTypeId,
            phone: patient.phone,
            city: patient.city,
            gender: patient.gender,
            dateOfBirth: patient.dateOfBirth,
            requestsCount: 0 // يحتاج ربط إضافي
        };
    }) || [];

    // تصفية البيانات
    const filteredPatients = patients.filter(patient => {
        const matchesSearch = (patient.name ?? '').includes(searchTerm) ||
            (patient.phone ?? '').includes(searchTerm) ||
            (patient.nationalId ?? '').includes(searchTerm);
        const matchesBloodType = filterBloodType === "all" || patient.bloodType === filterBloodType;
        return matchesSearch && matchesBloodType;
    });

    // معالجة إضافة مريض
    const handleAddPatient = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.nationalId || !formData.bloodType || !formData.gender) {
            return;
        }

        if (formData.nationalId.length !== 12) {
            toast({
                title: "خطأ في التحقق",
                description: "الرقم الوطني يجب أن يتكون من 12 خانة بالضبط",
                variant: "destructive",
            });
            return;
        }

        const firstDigit = formData.nationalId[0];
        if (firstDigit !== "1" && firstDigit !== "2") {
            toast({
                title: "خطأ في التحقق",
                description: "الرقم الوطني يجب أن يبدأ بالرقم 1 (للذكور) أو 2 (للإناث)",
                variant: "destructive",
            });
            return;
        }

        if (formData.gender === "Male" && firstDigit !== "1") {
            toast({
                title: "خطأ في التحقق",
                description: "تضارب في البيانات: الرقم الوطني يبدأ بـ 2 (أنثى) ولكن الجنس المختار هو ذكر",
                variant: "destructive",
            });
            return;
        }

        if (formData.gender === "Female" && firstDigit !== "2") {
            toast({
                title: "خطأ في التحقق",
                description: "تضارب في البيانات: الرقم الوطني يبدأ بـ 1 (ذكر) ولكن الجنس المختار هو أنثى",
                variant: "destructive",
            });
            return;
        }

        if (formData.dateOfBirth) {
            const nationalIdYear = formData.nationalId.substring(1, 5);
            const dobYear = formData.dateOfBirth.split("-")[0];
            if (nationalIdYear !== dobYear) {
                toast({
                    title: "خطأ في التحقق",
                    description: `تضارب في البيانات: سنة الميلاد في الرقم الوطني (${nationalIdYear}) لا تطابق سنة الميلاد في تاريخ الميلاد المحدد (${dobYear})`,
                    variant: "destructive",
                });
                return;
            }
        }

        try {
            // التحقق من أن الرقم الوطني غير مسجل مسبقاً لدى مريض آخر
            const nationalIdCheck = await patientsApi.getByNationalId(formData.nationalId);
            if (nationalIdCheck.isSuccess && nationalIdCheck.data) {
                toast({
                    title: "رقم وطني مكرر",
                    description: "الرقم الوطني مسجل مسبقاً لدى مريض آخر",
                    variant: "destructive",
                });
                return;
            }
        } catch (checkError) {
            console.error("خطأ أثناء التحقق من الرقم الوطني:", checkError);
        }

        const newPatient: CreatePatientRequest = {
            fullName: formData.fullName,
            nationalID: formData.nationalId,
            gender: formData.gender === 'Male' ? 1 : 2, // 1=Male, 2=Female
            dateOfBirth: formData.dateOfBirth,
            phone: formData.phone,
            bloodTypeID: BLOOD_TYPE_REVERSE_MAP[formData.bloodType],
            city: formData.city
        };

        try {
            await createPatient.mutateAsync(newPatient);
            setIsAddDialogOpen(false);
            resetForm();
            toast({
                title: "تمت الإضافة بنجاح",
                description: "تم إضافة المريض بنجاح",
            });
        } catch {
            // Error is handled in useCreatePatient's onError handler
        }
    };

    // معالجة تعديل مريض
    const handleEditPatient = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPatient) return;

        const updatedPatient: UpdatePatientRequest = {
            fullName: formData.fullName,
            phone: formData.phone,
            bloodTypeId: BLOOD_TYPE_REVERSE_MAP[formData.bloodType],
            city: formData.city
        };

        await updatePatient.mutateAsync({ id: selectedPatient, data: updatedPatient });
        setIsEditDialogOpen(false);
        resetForm();
    };

    // معالجة حذف مريض
    const handleDeletePatient = async (patientId: number) => {
        if (confirm("هل أنت متأكد من حذف هذا المريض؟")) {
            await deletePatient.mutateAsync(patientId);
        }
    };

    // فتح نموذج التعديل
    const openEditDialog = (patient: typeof patients[0]) => {
        setSelectedPatient(patient.id);
        setFormData({
            fullName: patient.name,
            nationalId: patient.nationalId,
            gender: patient.gender,
            dateOfBirth: patient.dateOfBirth,
            phone: patient.phone,
            bloodType: patient.bloodType,
            city: patient.city
        });
        setIsEditDialogOpen(true);
    };

    // إعادة تعيين النموذج
    const resetForm = () => {
        setFormData({
            fullName: "",
            nationalId: "",
            gender: "",
            dateOfBirth: "",
            phone: "",
            bloodType: "",
            city: ""
        });
        setSelectedPatient(null);
    };

    const totalPages = data?.data?.totalPages || 1;
    const totalCount = data?.data?.totalCount || 0;

    return (
        <div className="min-h-screen bg-secondary/30" dir="rtl">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Users2 className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                إدارة المرضى
                            </h1>
                            <p className="text-muted-foreground">
                                إضافة وتعديل وإدارة بيانات المرضى
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 ml-2" />
                                    إضافة مريض
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg" dir="rtl">
                                <DialogHeader>
                                    <DialogTitle>إضافة مريض جديد</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddPatient} className="space-y-4 mt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>الاسم الكامل *</Label>
                                            <Input
                                                value={formData.fullName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                                placeholder="أدخل الاسم الكامل"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>الرقم الوطني *</Label>
                                            <Input
                                                value={formData.nationalId}
                                                onChange={(e) => {
                                                    const sanitized = e.target.value.replace(/\D/g, "");
                                                    if (sanitized.length <= 12) {
                                                        setFormData(prev => ({ ...prev, nationalId: sanitized }));
                                                    }
                                                }}
                                                placeholder="أدخل الرقم الوطني"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>الجنس *</Label>
                                            <Select
                                                value={formData.gender}
                                                onValueChange={(v) => setFormData(prev => ({ ...prev, gender: v as Gender }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر الجنس" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">ذكر</SelectItem>
                                                    <SelectItem value="Female">أنثى</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>تاريخ الميلاد</Label>
                                            <Input
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>رقم الهاتف</Label>
                                            <Input
                                                value={formData.phone}
                                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                placeholder="09xxxxxxxx"
                                                dir="ltr"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>فصيلة الدم *</Label>
                                            <Select
                                                value={formData.bloodType}
                                                onValueChange={(v) => setFormData(prev => ({ ...prev, bloodType: v }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر الفصيلة" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {bloodTypes.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>المدينة</Label>
                                        <Input
                                            value={formData.city}
                                            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                            placeholder="أدخل المدينة"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button type="submit" className="flex-1" disabled={createPatient.isPending}>
                                            {createPatient.isPending ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                                    جاري الإضافة...
                                                </>
                                            ) : (
                                                "إضافة المريض"
                                            )}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                                            إلغاء
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">إجمالي المرضى</p>
                                    <p className="text-3xl font-bold text-primary">{totalCount}</p>
                                </div>
                                <Users2 className="h-10 w-10 text-primary/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">في هذه الصفحة</p>
                                    <p className="text-3xl font-bold text-foreground">{filteredPatients.length}</p>
                                </div>
                                <User className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">إجمالي الصفحات</p>
                                    <p className="text-3xl font-bold text-foreground">{totalPages}</p>
                                </div>
                                <FileText className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>قائمة المرضى</CardTitle>
                                <CardDescription>عرض وإدارة جميع المرضى المسجلين</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="بحث بالاسم أو الهاتف أو الرقم الوطني..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pr-10 w-full sm:w-72"
                                    />
                                </div>
                                <Select value={filterBloodType} onValueChange={setFilterBloodType}>
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue placeholder="فصيلة الدم" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">جميع الفصائل</SelectItem>
                                        {bloodTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon" onClick={() => refetch()}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    فشل في تحميل البيانات. <Button variant="link" onClick={() => refetch()}>إعادة المحاولة</Button>
                                </AlertDescription>
                            </Alert>
                        )}

                        {isLoading ? (
                            <TableSkeleton />
                        ) : filteredPatients.length === 0 ? (
                            <div className="text-center py-12">
                                <Users2 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-lg font-medium">لا توجد نتائج</h3>
                                <p className="text-muted-foreground">جرب تغيير معايير البحث أو أضف مريضاً جديداً</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>المريض</TableHead>
                                            <TableHead>الفصيلة</TableHead>
                                            <TableHead>الهاتف</TableHead>
                                            <TableHead>المدينة</TableHead>
                                            <TableHead>الإجراءات</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPatients.map((patient) => (
                                            <TableRow key={patient.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{patient.name}</p>
                                                        <p className="text-sm text-muted-foreground">{patient.nationalId}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Droplet className="h-4 w-4 text-primary fill-primary" />
                                                        <span className="font-bold">{patient.bloodType}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-4 w-4" />
                                                        {patient.phone || '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {patient.city || '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="تعديل"
                                                            onClick={() => openEditDialog(patient)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="حذف"
                                                            className="text-destructive"
                                                            onClick={() => handleDeletePatient(patient.id)}
                                                            disabled={deletePatient.isPending}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    السابق
                                </Button>
                                <span className="text-sm text-muted-foreground px-4">
                                    صفحة {page} من {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    التالي
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-lg" dir="rtl">
                        <DialogHeader>
                            <DialogTitle>تعديل بيانات المريض</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditPatient} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>الاسم الكامل</Label>
                                <Input
                                    value={formData.fullName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>رقم الهاتف</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        dir="ltr"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>فصيلة الدم</Label>
                                    <Select
                                        value={formData.bloodType}
                                        onValueChange={(v) => setFormData(prev => ({ ...prev, bloodType: v }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {bloodTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>المدينة</Label>
                                <Input
                                    value={formData.city}
                                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit" className="flex-1" disabled={updatePatient.isPending}>
                                    {updatePatient.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        "حفظ التغييرات"
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
                                    إلغاء
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div>
    );
};

export default PatientsManagement;
