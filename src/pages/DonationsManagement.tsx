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
    Heart,
    Calendar,
    Search,
    Trash2,
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
    User
} from "lucide-react";
import { useDonations, useCreateDonation, useUpdateDonationTestResult, useApprovedDonations } from "@/hooks/useDonations";
import { useDonors } from "@/hooks/useDonors";
import { BLOOD_TYPE_MAP, BLOOD_TYPE_REVERSE_MAP } from "@/types/api";
import { formatDate, mapTestResult } from "@/lib/utils";
import type { TestResult, CreateDonationRequest, UpdateTestResultRequest } from "@/types/api";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Loading skeleton for table
const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
        ))}
    </div>
);

const DonationsManagement = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        donorId: "",
        bloodType: "",
        quantity: "1",
        notes: ""
    });

    // جلب البيانات
    const { data, isLoading, error, refetch } = useDonations(page, 10);
    const { data: donorsData, isLoading: donorsLoading } = useDonors(1, 100);
    const { data: approvedData } = useApprovedDonations();
    const createDonation = useCreateDonation();
    const updateTestResult = useUpdateDonationTestResult();

    // تحويل البيانات
    const normalizeTestResult = (result: string | number | undefined | null): string => {
        const numericMap: Record<number, string> = { 0: 'Pending', 1: 'Approved', 2: 'Rejected' };
        if (result === null || result === undefined) return 'Pending';
        if (typeof result === 'number') return numericMap[result] || 'Pending';
        return result;
    };

    // ⚠️ CRITICAL: Define donors BEFORE using it in donations.map()
    const donors = donorsData?.data?.items || [];

    const donations = (data?.data?.items || []).map(donation => {
        // Handle different possible field names from API
        const donationAny = donation as any;
        const bloodTypeId = donation.bloodTypeId ?? donationAny.BloodTypeID ?? donationAny.bloodTypeID;
        const bloodTypeName = donation.bloodType?.typeName ?? donationAny.bloodType?.TypeName ?? donationAny.BloodType?.typeName ?? donationAny.bloodTypeName;

        // Get donorID (API returns donorID in uppercase)
        const donorID = donationAny.donorID ?? donation.donorId ?? donationAny.DonorID;

        // Try to get donor name from API response first
        let donorName = donationAny.donorName ?? donation.donorName;

        // If donorName is empty or not available, find from donors list using donorID
        if (!donorName && donorID) {
            const matchedDonor = donors.find((d: any) => {
                const dID = d.donorID || d.donorId || d.DonorID;
                return dID === donorID;
            }) as any;

            if (matchedDonor) {
                donorName = matchedDonor.fullName || matchedDonor.FullName;
            }
        }

        return {
            id: donationAny.donationID ?? donation.donationId,
            donorId: donorID,
            donorName: donorName || 'غير محدد',
            bloodType: bloodTypeName || BLOOD_TYPE_MAP[bloodTypeId] || 'غير محدد',
            bloodTypeId: bloodTypeId,
            quantity: donation.quantity || 0,
            donationDate: donation.donationDate ? formatDate(donation.donationDate) : 'غير محدد',
            testResult: normalizeTestResult(donation.testResult),
            notes: donation.notes || ''
        };
    });


    // Debug: log data to understand structure
    console.log('Donations API Response:', data?.data?.items?.[0]);
    console.log('First donation donorID:', data?.data?.items?.[0]?.donorID);
    console.log('First donation donorName:', data?.data?.items?.[0]?.donorName);
    console.log('Donors available:', donors.length);
    if (donors.length > 0) {
        console.log('First Donor:', donors[0]);
        console.log('Donor Keys:', Object.keys(donors[0]));
    }
    console.log('Processed donations:', donations[0]);

    // تصفية البيانات
    const filteredDonations = donations.filter(donation => {
        const matchesSearch = donation.donorName.includes(searchTerm);
        const matchesStatus = filterStatus === "all" || donation.testResult === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // معالجة إضافة تبرع
    const handleAddDonation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.donorId || !formData.bloodType) {
            return;
        }

        const newDonation: CreateDonationRequest = {
            donorID: parseInt(formData.donorId),
            bloodTypeID: BLOOD_TYPE_REVERSE_MAP[formData.bloodType],
            donationDate: new Date().toISOString().split('T')[0], // اليوم
            quantity: parseInt(formData.quantity),
            testResult: 0, // 0=Pending
            notes: formData.notes
        };

        await createDonation.mutateAsync(newDonation);
        setIsAddDialogOpen(false);
        resetForm();
    };

    // معالجة تحديث نتيجة الفحص
    const handleUpdateTestResult = async (donationId: number, result: TestResult) => {
        await updateTestResult.mutateAsync({
            id: donationId,
            data: { testResult: result }
        });
    };

    // إعادة تعيين النموذج
    const resetForm = () => {
        setFormData({
            donorId: "",
            bloodType: "",
            quantity: "1",
            notes: ""
        });
    };

    // عند اختيار متبرع، تعبئة فصيلة الدم تلقائياً
    const handleDonorSelect = (donorId: string) => {
        setFormData(prev => ({ ...prev, donorId }));
        const selectedDonor: any = donors.find((d: any) =>
            (d.donorID || d.donorId)?.toString() === donorId
        );
        if (selectedDonor) {
            const bloodTypeId = selectedDonor.bloodTypeID || selectedDonor.bloodTypeId;
            setFormData(prev => ({
                ...prev,
                donorId,
                bloodType: BLOOD_TYPE_MAP[bloodTypeId] || ""
            }));
        }
    };

    const totalPages = data?.data?.totalPages || 1;
    const totalCount = data?.data?.totalCount || 0;
    const approvedCount = approvedData?.data?.length || 0;
    const pendingCount = donations.filter(d => d.testResult === 'Pending').length;

    return (
        <div className="min-h-screen bg-secondary/30" dir="rtl">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Heart className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                إدارة التبرعات
                            </h1>
                            <p className="text-muted-foreground">
                                تسجيل وفحص ومتابعة التبرعات
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 ml-2" />
                                    تسجيل تبرع
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md" dir="rtl">
                                <DialogHeader>
                                    <DialogTitle>تسجيل تبرع جديد</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddDonation} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label>المتبرع *</Label>
                                        <Select
                                            value={formData.donorId}
                                            onValueChange={handleDonorSelect}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر المتبرع" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" className="max-h-[200px]">
                                                {donorsLoading ? (
                                                    <div className="p-2 text-center text-sm text-muted-foreground">
                                                        جاري التحميل...
                                                    </div>
                                                ) : donors.length === 0 ? (
                                                    <div className="p-2 text-center text-sm text-muted-foreground">
                                                        لا يوجد متبرعين مسجلين. يرجى إضافة متبرعين أولاً.
                                                    </div>
                                                ) : (
                                                    donors.map((donor: any) => (
                                                        <SelectItem
                                                            key={donor.donorID || donor.donorId}
                                                            value={(donor.donorID || donor.donorId)?.toString() || ""}
                                                        >
                                                            {donor.fullName} - {BLOOD_TYPE_MAP[donor.bloodTypeID || donor.bloodTypeId]}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>فصيلة الدم *</Label>
                                            <Select
                                                value={formData.bloodType}
                                                onValueChange={(v) => setFormData(prev => ({ ...prev, bloodType: v }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر الفصيلة" />
                                                </SelectTrigger>
                                                <SelectContent position="popper">
                                                    {bloodTypes.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>عدد الوحدات *</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="5"
                                                value={formData.quantity}
                                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                                                placeholder="1-5 وحدات"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                الوحدة الواحدة = 450 مل تقريباً
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ملاحظات</Label>
                                        <Input
                                            value={formData.notes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                            placeholder="أي ملاحظات إضافية..."
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button type="submit" className="flex-1" disabled={createDonation.isPending}>
                                            {createDonation.isPending ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                                    جاري التسجيل...
                                                </>
                                            ) : (
                                                "تسجيل التبرع"
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
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">إجمالي التبرعات</p>
                                    <p className="text-3xl font-bold text-primary">{totalCount}</p>
                                </div>
                                <Heart className="h-10 w-10 text-primary/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">تبرعات معتمدة</p>
                                    <p className="text-3xl font-bold text-success">{approvedCount}</p>
                                </div>
                                <CheckCircle2 className="h-10 w-10 text-success/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">قيد الفحص</p>
                                    <p className="text-3xl font-bold text-warning">{pendingCount}</p>
                                </div>
                                <Clock className="h-10 w-10 text-warning/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">في هذه الصفحة</p>
                                    <p className="text-3xl font-bold text-foreground">{filteredDonations.length}</p>
                                </div>
                                <Droplet className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>سجل التبرعات</CardTitle>
                                <CardDescription>عرض وإدارة جميع التبرعات المسجلة</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="بحث بالاسم..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pr-10 w-full sm:w-64"
                                    />
                                </div>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue placeholder="حالة الفحص" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">جميع الحالات</SelectItem>
                                        <SelectItem value="Pending">قيد الفحص</SelectItem>
                                        <SelectItem value="Approved">معتمد</SelectItem>
                                        <SelectItem value="Rejected">مرفوض</SelectItem>
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
                        ) : filteredDonations.length === 0 ? (
                            <div className="text-center py-12">
                                <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-lg font-medium">لا توجد تبرعات</h3>
                                <p className="text-muted-foreground">سجّل تبرعاً جديداً للبدء</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>المتبرع</TableHead>
                                            <TableHead>الفصيلة</TableHead>
                                            <TableHead>الكمية</TableHead>
                                            <TableHead>التاريخ</TableHead>
                                            <TableHead>نتيجة الفحص</TableHead>
                                            <TableHead>الإجراءات</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredDonations.map((donation) => {
                                            const result = mapTestResult(donation.testResult);
                                            return (
                                                <TableRow key={donation.id}>
                                                    <TableCell>
                                                        <span className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">{donation.donorName}</span>
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Droplet className="h-4 w-4 text-primary fill-primary" />
                                                            <span className="font-bold">{donation.bloodType}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{donation.quantity} {donation.quantity === 1 ? 'وحدة' : 'وحدات'}</TableCell>
                                                    <TableCell>
                                                        <span className="flex items-center gap-1 text-muted-foreground">
                                                            <Calendar className="h-4 w-4" />
                                                            {donation.donationDate}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={result.variant}>{result.label}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            {donation.testResult === 'Pending' && (
                                                                <>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-success"
                                                                        onClick={() => handleUpdateTestResult(donation.id, 'Approved')}
                                                                        disabled={updateTestResult.isPending}
                                                                    >
                                                                        <CheckCircle2 className="h-4 w-4 ml-1" />
                                                                        اعتماد
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-destructive"
                                                                        onClick={() => handleUpdateTestResult(donation.id, 'Rejected')}
                                                                        disabled={updateTestResult.isPending}
                                                                    >
                                                                        <XCircle className="h-4 w-4 ml-1" />
                                                                        رفض
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {donation.testResult !== 'Pending' && (
                                                                <span className="text-muted-foreground text-sm">
                                                                    تم الفحص
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
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
            </main>
            <Footer />
        </div>
    );
};

export default DonationsManagement;
