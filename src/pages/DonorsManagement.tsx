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
    Trash2,
    Edit,
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    MapPin,
    User,
    FileText
} from "lucide-react";
import { useDonors, useCreateDonor, useUpdateDonor, useDeleteDonor, useCheckDonorEligibility, useApproveDonor } from "@/hooks/useDonors";
import { usePendingBloodRequests } from "@/hooks/useBloodRequests";
import { donorResponsesApi } from "@/api/donorResponses";
import { BLOOD_TYPE_MAP, BLOOD_TYPE_REVERSE_MAP } from "@/types/api";
import { formatDate, mapGender } from "@/lib/utils";
import type { Gender, CreateDonorRequest, UpdateDonorRequest } from "@/types/api";
import { MedicalDocumentsDialog } from "@/components/donors/MedicalDocumentsDialog";
import { useToast } from "@/hooks/use-toast";
import { donorsApi } from "@/api/donors";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// ─── تعريف حالات الموافقة الخمس ────────────────────────────────────────────
const APPROVAL_STATUSES = [
    { value: 1, label: "في انتظار رفع المستندات",   color: "border-gray-400   text-gray-500   bg-gray-50"    },
    { value: 2, label: "في انتظار الموافقة",         color: "border-yellow-500 text-yellow-600 bg-yellow-50"  },
    { value: 3, label: "مقبول",                      color: "border-green-500  text-green-700  bg-green-50"   },
    { value: 4, label: "مرفوض",                      color: "border-red-500    text-red-700    bg-red-50"     },
    { value: 5, label: "مطلوب وثائق إضافية",         color: "border-orange-400 text-orange-600 bg-orange-50"  },
] as const;

const getApprovalStatus = (val: number) =>
    APPROVAL_STATUSES.find(s => s.value === val) ??
    { value: val, label: "غير معروف", color: "border-gray-300 text-gray-400 bg-white" };

// Loading skeleton for table
const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
        ))}
    </div>
);

const DonorsManagement = () => {
    const { toast } = useToast();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBloodType, setFilterBloodType] = useState("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    // Dialog للحالات التي تحتاج ملاحظة (رفض أو طلب وثائق إضافية)
    const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
    const [isDocsDialogOpen, setIsDocsDialogOpen] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState<number | null>(null);
    const [pendingStatusChange, setPendingStatusChange] = useState<{ donorId: number; newStatus: number } | null>(null);
    const [selectedDonorForDocs, setSelectedDonorForDocs] = useState<{id: number, name: string} | null>(null);
    const [statusNote, setStatusNote] = useState("");
    const [filterApprovalStatus, setFilterApprovalStatus] = useState<string>("all");

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        nationalId: "",
        gender: "" as Gender | "",
        dateOfBirth: "",
        phone: "",
        bloodType: "",
        city: "",
        requestId: "",
    });

    // جلب البيانات
    const { data, isLoading, error, refetch } = useDonors(page, 10);
    const { data: pendingRequestsData, isLoading: requestsLoading } = usePendingBloodRequests();
    const pendingRequests = pendingRequestsData?.data || [];
    const createDonor = useCreateDonor();
    const updateDonor = useUpdateDonor();
    const deleteDonor = useDeleteDonor();
    const checkEligibility = useCheckDonorEligibility();
    const approveDonor = useApproveDonor();

    // تحويل البيانات
    const donors = data?.data?.items?.map(donor => {
        // Handle different possible field names from API (PascalCase vs camelCase)
        const donorAny = donor as any;
        // API يُرجع donorID بالـ PascalCase — نقرأ كلا الصيغتين
        const donorId = donorAny.donorID ?? donorAny.donorId ?? donor.donorId;
        const nationalId = donorAny.nationalID ?? donorAny.nationalId ?? donor.nationalId;
        const bloodTypeId = donor.bloodTypeId ?? donorAny.BloodTypeID ?? donorAny.bloodTypeID ?? donorAny.bloodTypeId;
        const bloodTypeName = donor.bloodType?.typeName ?? donorAny.bloodType?.TypeName ?? donorAny.BloodType?.typeName ?? donorAny.BloodType?.TypeName;
        const approvalStatus = donorAny.ApprovalStatus ?? donorAny.approvalStatus ?? 1;

        return {
            id: donorId,
            name: donor.fullName,
            nationalId: nationalId,
            bloodType: bloodTypeName || BLOOD_TYPE_MAP[bloodTypeId] || 'غير محدد',
            bloodTypeId: bloodTypeId,
            phone: donor.phone,
            city: donor.city,
            gender: donor.gender,
            dateOfBirth: donor.dateOfBirth,
            lastDonation: donor.lastDonationDate ? formatDate(donor.lastDonationDate) : 'لم يتبرع بعد',
            isActive: donor.isActive,
            approvalStatus: approvalStatus,
            rejectionReason: donor.rejectionReason,
            approvalDate: donor.approvalDate,
            userEmail: donor.userEmail,
        };
    }) || [];

    // تصفية البيانات
    const filteredDonors = donors.filter(donor => {
        const matchesSearch = (donor.name ?? '').includes(searchTerm) ||
            (donor.phone ?? '').includes(searchTerm) ||
            (donor.nationalId ?? '').includes(searchTerm);
        const matchesBloodType = filterBloodType === "all" || donor.bloodType === filterBloodType;
        const matchesApproval = filterApprovalStatus === "all" || donor.approvalStatus?.toString() === filterApprovalStatus;
        return matchesSearch && matchesBloodType && matchesApproval;
    });

    // معالجة إضافة متبرع
    const handleAddDonor = async (e: React.FormEvent) => {
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
            // التحقق من أن الرقم الوطني غير مسجل مسبقاً لدى متبرع آخر
            const nationalIdCheck = await donorsApi.getByNationalId(formData.nationalId);
            if (nationalIdCheck.isSuccess && nationalIdCheck.data) {
                toast({
                    title: "رقم وطني مكرر",
                    description: "الرقم الوطني مسجل مسبقاً لدى متبرع آخر",
                    variant: "destructive",
                });
                return;
            }
        } catch (checkError) {
            console.error("خطأ أثناء التحقق من الرقم الوطني:", checkError);
        }

        const newDonor: CreateDonorRequest = {
            fullName: formData.fullName,
            nationalID: formData.nationalId,
            gender: formData.gender === 'Male' ? 1 : 2, // 1=Male, 2=Female
            dateOfBirth: formData.dateOfBirth,
            phone: formData.phone,
            bloodTypeID: BLOOD_TYPE_REVERSE_MAP[formData.bloodType],
            city: formData.city,
            isActive: true
        };

        try {
            const result = await createDonor.mutateAsync(newDonor);
            if (result.isSuccess && result.data && formData.requestId) {
                const donorId = result.data.donorID || result.data.donorId;
                if (donorId) {
                    await donorResponsesApi.create({
                        donorId,
                        requestId: parseInt(formData.requestId),
                        notes: "تسجيل يدوي للمتبرع لصالح المريض"
                    });
                }
            }
            setIsAddDialogOpen(false);
            resetForm();
            toast({
                title: "تمت الإضافة بنجاح",
                description: "تم إضافة المتبرع بنجاح",
            });
        } catch {
            // Error is handled in useCreateDonor's onError handler
        }
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

        try {
            await updateDonor.mutateAsync({ id: selectedDonor, data: updatedDonor });
            setIsEditDialogOpen(false);
            resetForm();
        } catch {
            // Error is handled in useUpdateDonor's onError handler
        }
    };

    // معالجة حذف متبرع
    const handleDeleteDonor = async (donorId: number) => {
        if (confirm("هل أنت متأكد من حذف هذا المتبرع؟")) {
            try {
                await deleteDonor.mutateAsync(donorId);
            } catch {
                // Error is handled in useDeleteDonor's onError handler
            }
        }
    };

    // معالجة تغيير حالة الموافقة عبر الكومبو بوكس
    const handleStatusChange = (donorId: number, newStatus: number) => {
        // الحالات 4 (مرفوض) و 5 (مطلوب وثائق إضافية) تحتاج ملاحظة
        if (newStatus === 4 || newStatus === 5) {
            setPendingStatusChange({ donorId, newStatus });
            setStatusNote("");
            setIsNoteDialogOpen(true);
        } else {
            approveDonor.mutate({ id: donorId, data: { newStatus } });
        }
    };

    const submitStatusWithNote = async () => {
        if (!pendingStatusChange) return;
        try {
            await approveDonor.mutateAsync({
                id: pendingStatusChange.donorId,
                data: {
                    newStatus: pendingStatusChange.newStatus,
                    rejectionReason: statusNote || undefined,
                }
            });
            setIsNoteDialogOpen(false);
            setPendingStatusChange(null);
            setStatusNote("");
        } catch {
            // Error is handled in useApproveDonor's onError handler
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
            requestId: "",
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
                                    <div className="space-y-2">
                                        <Label>طلب الدم / المريض (اختياري)</Label>
                                        <Select
                                            value={formData.requestId}
                                            onValueChange={(v) => {
                                                setFormData(prev => ({ ...prev, requestId: v }));
                                                const selectedReq = pendingRequests.find(r => r.requestId.toString() === v);
                                                if (selectedReq) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        bloodType: BLOOD_TYPE_MAP[selectedReq.bloodTypeId] || prev.bloodType
                                                    }));
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر طلب الدم / المريض" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" className="max-h-[200px]">
                                                {requestsLoading ? (
                                                    <div className="p-2 text-center text-sm text-muted-foreground">
                                                        جاري التحميل...
                                                    </div>
                                                ) : pendingRequests.length === 0 ? (
                                                    <div className="p-2 text-center text-sm text-muted-foreground">
                                                        لا توجد طلبات معلقة نشطة
                                                    </div>
                                                ) : (
                                                    pendingRequests.map((req) => (
                                                        <SelectItem
                                                            key={req.requestId}
                                                            value={req.requestId.toString()}
                                                        >
                                                            {req.patient?.fullName || req.patientName || 'مريض'} - فصيلة {BLOOD_TYPE_MAP[req.bloodTypeId]} (طلب #{req.requestId})
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
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
                                <Select value={filterApprovalStatus} onValueChange={setFilterApprovalStatus}>
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="حالة الموافقة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">جميع الحالات</SelectItem>
                                        {APPROVAL_STATUSES.map(s => (
                                            <SelectItem key={s.value} value={s.value.toString()}>{s.label}</SelectItem>
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
                                                    {/* ── Combobox تغيير حالة الموافقة ── */}
                                                    <div className="flex flex-col gap-1.5">
                                                        <Badge
                                                            variant="outline"
                                                            className={`w-fit text-xs ${getApprovalStatus(donor.approvalStatus).color}`}
                                                        >
                                                            {getApprovalStatus(donor.approvalStatus).label}
                                                        </Badge>
                                                        <Select
                                                            value={donor.approvalStatus?.toString()}
                                                            onValueChange={(v) => handleStatusChange(donor.id, parseInt(v))}
                                                            disabled={approveDonor.isPending}
                                                        >
                                                            <SelectTrigger className="h-7 text-xs w-44">
                                                                <SelectValue placeholder="تغيير الحالة" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {APPROVAL_STATUSES.map(s => (
                                                                    <SelectItem key={s.value} value={s.value.toString()} className="text-xs">
                                                                        {s.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="الوثائق الطبية"
                                                            onClick={() => {
                                                                setSelectedDonorForDocs({ id: donor.id, name: donor.name });
                                                                setIsDocsDialogOpen(true);
                                                            }}
                                                        >
                                                            <FileText className="h-4 w-4 text-blue-600" />
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

                {/* Note Dialog — يظهر عند اختيار "مرفوض" أو "مطلوب وثائق إضافية" */}
                <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                    <DialogContent className="max-w-md" dir="rtl">
                        <DialogHeader>
                            <DialogTitle>
                                {pendingStatusChange?.newStatus === 4 ? "رفض المتبرع" : "طلب وثائق إضافية"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>
                                    {pendingStatusChange?.newStatus === 4
                                        ? "سبب الرفض *"
                                        : "ملاحظة للمتبرع (اختياري)"}
                                </Label>
                                <Input
                                    value={statusNote}
                                    onChange={(e) => setStatusNote(e.target.value)}
                                    placeholder={
                                        pendingStatusChange?.newStatus === 4
                                            ? "أدخل سبب رفض المتبرع..."
                                            : "حدد الوثائق المطلوبة..."
                                    }
                                    required={pendingStatusChange?.newStatus === 4}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant={pendingStatusChange?.newStatus === 4 ? "destructive" : "default"}
                                    className="flex-1"
                                    onClick={submitStatusWithNote}
                                    disabled={
                                        (pendingStatusChange?.newStatus === 4 && !statusNote) ||
                                        approveDonor.isPending
                                    }
                                >
                                    {approveDonor.isPending ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : null}
                                    تأكيد
                                </Button>
                                <Button variant="outline" onClick={() => { setIsNoteDialogOpen(false); setPendingStatusChange(null); }}>
                                    إلغاء
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Medical Documents Dialog */}
                <MedicalDocumentsDialog 
                    isOpen={isDocsDialogOpen} 
                    onClose={() => {
                        setIsDocsDialogOpen(false);
                        setSelectedDonorForDocs(null);
                    }} 
                    donorId={selectedDonorForDocs?.id || null} 
                    donorName={selectedDonorForDocs?.name || ''} 
                />
            </main>
            <Footer />
        </div>
    );
};

export default DonorsManagement;
