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
    Droplet,
    Plus,
    Users,
    Phone,
    Calendar,
    Search,
    Eye,
    Trash2,
    Edit,
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    XCircle,
    MapPin,
    User
} from "lucide-react";
import { useDonors, useCreateDonor, useUpdateDonor, useDeleteDonor, useCheckDonorEligibility } from "@/hooks/useDonors";
import { BLOOD_TYPE_MAP, BLOOD_TYPE_REVERSE_MAP } from "@/types/api";
import { formatDate, mapGender } from "@/lib/utils";
import type { Gender, CreateDonorRequest, UpdateDonorRequest } from "@/types/api";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Loading skeleton for table
const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
        ))}
    </div>
);

const DonorsManagement = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBloodType, setFilterBloodType] = useState("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState<number | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        nationalId: "",
        gender: "" as Gender | "",
        dateOfBirth: "",
        phone: "",
        bloodType: "",
        city: "",
    });

    // جلب البيانات
    const { data, isLoading, error, refetch } = useDonors(page, 10);
    const createDonor = useCreateDonor();
    const updateDonor = useUpdateDonor();
    const deleteDonor = useDeleteDonor();
    const checkEligibility = useCheckDonorEligibility();

    // تحويل البيانات
    const donors = data?.data?.items?.map(donor => {
        // Handle different possible field names from API
        const donorAny = donor as any;
        const bloodTypeId = donor.bloodTypeId ?? donorAny.BloodTypeID ?? donorAny.bloodTypeID;
        const bloodTypeName = donor.bloodType?.typeName ?? donorAny.bloodType?.TypeName ?? donorAny.BloodType?.typeName ?? donorAny.BloodType?.TypeName;

        return {
            id: donor.donorId,
            name: donor.fullName,
            nationalId: donor.nationalId,
            bloodType: bloodTypeName || BLOOD_TYPE_MAP[bloodTypeId] || 'غير محدد',
            bloodTypeId: bloodTypeId,
            phone: donor.phone,
            city: donor.city,
            gender: donor.gender,
            dateOfBirth: donor.dateOfBirth,
            lastDonation: donor.lastDonationDate ? formatDate(donor.lastDonationDate) : 'لم يتبرع بعد',
            isActive: donor.isActive,
        };
    }) || [];

    // تصفية البيانات
    const filteredDonors = donors.filter(donor => {
        const matchesSearch = donor.name.includes(searchTerm) ||
            donor.phone.includes(searchTerm) ||
            donor.nationalId.includes(searchTerm);
        const matchesBloodType = filterBloodType === "all" || donor.bloodType === filterBloodType;
        return matchesSearch && matchesBloodType;
    });

    // معالجة إضافة متبرع
    const handleAddDonor = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.nationalId || !formData.bloodType || !formData.gender) {
            return;
        }

        const newDonor: CreateDonorRequest = {
            fullName: formData.fullName,
            nationalID: formData.nationalId,
            gender: formData.gender === 'Male' ? 0 : 1, // 0=Male, 1=Female
            dateOfBirth: formData.dateOfBirth,
            phone: formData.phone,
            bloodTypeID: BLOOD_TYPE_REVERSE_MAP[formData.bloodType],
            city: formData.city,
            isActive: true
        };

        await createDonor.mutateAsync(newDonor);
        setIsAddDialogOpen(false);
        resetForm();
    };

    // معالجة تعديل متبرع
    const handleEditDonor = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDonor) return;

        const updatedDonor: UpdateDonorRequest = {
            fullName: formData.fullName,
            phone: formData.phone,
            bloodTypeId: BLOOD_TYPE_REVERSE_MAP[formData.bloodType],
            city: formData.city,
            isActive: true
        };

        await updateDonor.mutateAsync({ id: selectedDonor, data: updatedDonor });
        setIsEditDialogOpen(false);
        resetForm();
    };

    // معالجة حذف متبرع
    const handleDeleteDonor = async (donorId: number) => {
        if (confirm("هل أنت متأكد من حذف هذا المتبرع؟")) {
            await deleteDonor.mutateAsync(donorId);
        }
    };

    // فحص أهلية التبرع
    const handleCheckEligibility = async (donorId: number) => {
        const result = await checkEligibility.mutateAsync(donorId);
        if (result.success && result.data) {
            alert(result.data.isEligible
                ? "✅ المتبرع مؤهل للتبرع"
                : `❌ ${result.data.reason || 'المتبرع غير مؤهل للتبرع'}`
            );
        }
    };

    // فتح نموذج التعديل
    const openEditDialog = (donor: typeof donors[0]) => {
        setSelectedDonor(donor.id);
        setFormData({
            fullName: donor.name,
            nationalId: donor.nationalId,
            gender: donor.gender,
            dateOfBirth: donor.dateOfBirth,
            phone: donor.phone,
            bloodType: donor.bloodType,
            city: donor.city,
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
            city: "",
        });
        setSelectedDonor(null);
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
                            <Users className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                إدارة المتبرعين
                            </h1>
                            <p className="text-muted-foreground">
                                إضافة وتعديل وإدارة بيانات المتبرعين
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 ml-2" />
                                    إضافة متبرع
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg" dir="rtl">
                                <DialogHeader>
                                    <DialogTitle>إضافة متبرع جديد</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddDonor} className="space-y-4 mt-4">
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
                                                onChange={(e) => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
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
                                        <Button type="submit" className="flex-1" disabled={createDonor.isPending}>
                                            {createDonor.isPending ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                                    جاري الإضافة...
                                                </>
                                            ) : (
                                                "إضافة المتبرع"
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
                                    <p className="text-sm text-muted-foreground mb-1">إجمالي المتبرعين</p>
                                    <p className="text-3xl font-bold text-primary">{totalCount}</p>
                                </div>
                                <Users className="h-10 w-10 text-primary/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">المتبرعين النشطين</p>
                                    <p className="text-3xl font-bold text-success">{donors.filter(d => d.isActive).length}</p>
                                </div>
                                <CheckCircle2 className="h-10 w-10 text-success/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">في هذه الصفحة</p>
                                    <p className="text-3xl font-bold text-foreground">{filteredDonors.length}</p>
                                </div>
                                <User className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>قائمة المتبرعين</CardTitle>
                                <CardDescription>عرض وإدارة جميع المتبرعين المسجلين</CardDescription>
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
                        ) : filteredDonors.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-lg font-medium">لا توجد نتائج</h3>
                                <p className="text-muted-foreground">جرب تغيير معايير البحث أو أضف متبرعاً جديداً</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>المتبرع</TableHead>
                                            <TableHead>الفصيلة</TableHead>
                                            <TableHead>الهاتف</TableHead>
                                            <TableHead>المدينة</TableHead>
                                            <TableHead>آخر تبرع</TableHead>
                                            <TableHead>الحالة</TableHead>
                                            <TableHead>الإجراءات</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredDonors.map((donor) => (
                                            <TableRow key={donor.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{donor.name}</p>
                                                        <p className="text-sm text-muted-foreground">{donor.nationalId}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Droplet className="h-4 w-4 text-primary fill-primary" />
                                                        <span className="font-bold">{donor.bloodType}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-4 w-4" />
                                                        {donor.phone || '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {donor.city || '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1 text-muted-foreground">
                                                        <Calendar className="h-4 w-4" />
                                                        {donor.lastDonation}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={donor.isActive ? "default" : "secondary"}>
                                                        {donor.isActive ? "نشط" : "غير نشط"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="فحص الأهلية"
                                                            onClick={() => handleCheckEligibility(donor.id)}
                                                            disabled={checkEligibility.isPending}
                                                        >
                                                            <CheckCircle2 className="h-4 w-4 text-success" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="تعديل"
                                                            onClick={() => openEditDialog(donor)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="حذف"
                                                            className="text-destructive"
                                                            onClick={() => handleDeleteDonor(donor.id)}
                                                            disabled={deleteDonor.isPending}
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
                            <DialogTitle>تعديل بيانات المتبرع</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditDonor} className="space-y-4 mt-4">
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
                                <Button type="submit" className="flex-1" disabled={updateDonor.isPending}>
                                    {updateDonor.isPending ? (
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

export default DonorsManagement;
