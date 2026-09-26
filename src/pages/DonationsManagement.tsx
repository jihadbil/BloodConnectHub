import { useState, useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
    User,
    FlaskConical,
    Upload,
    FileCheck,
    Package
} from "lucide-react";
import { useDonations, useCreateDonation, useUpdateDonationTestResult, useRecentDonations, usePerformLabTest } from "@/hooks/useDonations";
import { useDonors } from "@/hooks/useDonors";
import { useUploadDocument } from "@/hooks/useMedicalDocuments";
import { useUpdateInventoryQuantity } from "@/hooks/useInventory";
import { useUpdateResponseStatus } from "@/hooks/useDonorResponses";
import { useUpdateBloodRequestStatus, usePendingBloodRequests } from "@/hooks/useBloodRequests";
import { donorResponsesApi } from "@/api/donorResponses";
import { bloodRequestsApi } from "@/api/bloodRequests";
import { ResponseStatus } from "@/types/donor-response";
import { useToast } from "@/hooks/use-toast";
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
        notes: "",
        // حقل تمّ اعتماد المعمل وتحديث المخزون فوراً
        labApproved: false,
        labNotes: "",
        requestId: "",
    });
    const [labFile, setLabFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // جلب البيانات
    const { data, isLoading, error, refetch } = useDonations(page, 10);
    const { data: donorsData, isLoading: donorsLoading } = useDonors(1, 100);
    const { data: recentData } = useRecentDonations(30);
    const { data: pendingRequestsData, isLoading: requestsLoading } = usePendingBloodRequests();
    const pendingRequests = pendingRequestsData?.data || [];
    const createDonation = useCreateDonation();
    const updateTestResult = useUpdateDonationTestResult();
    const performLabTest = usePerformLabTest();
    const uploadDocument = useUploadDocument();
    const updateInventory = useUpdateInventoryQuantity();

    const { toast } = useToast();

    // Lab Test Dialog State
    const [isLabTestDialogOpen, setIsLabTestDialogOpen] = useState(false);
    const [selectedDonationForLabTest, setSelectedDonationForLabTest] = useState<number | null>(null);
    const [selectedDonationInfo, setSelectedDonationInfo] = useState<{
        id: number;
        donorId: number;
        bloodTypeId: number;
        quantity: number;
    } | null>(null);
    const [labTestForm, setLabTestForm] = useState({
        testResult: "Accepted", // Accepted or Rejected
        testNotes: "",
        addToInventoryIfAccepted: true
    });
    const [labTestFile, setLabTestFile] = useState<File | null>(null);
    const labTestFileInputRef = useRef<HTMLInputElement>(null);

    const updateResponseStatus = useUpdateResponseStatus();
    const updateBloodRequestStatus = useUpdateBloodRequestStatus();

    // تحويل البيانات
    const normalizeTestResult = (result: string | number | undefined | null): string => {
        const numericMap: Record<number, string> = { 1: 'Pending', 2: 'Accepted', 3: 'Rejected' };
        if (result === null || result === undefined) return 'Pending';
        if (typeof result === 'number') return numericMap[result] || 'Pending';
        if (result === 'Approved') return 'Accepted';
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
            notes: donation.notes || '',
            testedAt: donation.testedAt ? formatDate(donation.testedAt) : null,
            testNotes: donation.testNotes || '',
            isAddedToInventory: !!donation.isAddedToInventory
        };
    });



    // تصفية البيانات
    const filteredDonations = donations.filter(donation => {
        const matchesSearch = donation.donorName.includes(searchTerm);
        const matchesStatus = filterStatus === "all" || donation.testResult === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // معالجة إضافة تبرع
    const handleAddDonation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.donorId || !formData.bloodType) return;

        const bloodTypeId = BLOOD_TYPE_REVERSE_MAP[formData.bloodType];
        const quantity = parseInt(formData.quantity);

        const selectedReq = formData.requestId
            ? pendingRequests.find(r => r.requestId.toString() === formData.requestId)
            : null;

        const patientName = selectedReq?.patient?.fullName || selectedReq?.patientName;
        const requestNotePart = selectedReq
            ? `تبرع للمريض: ${patientName || 'غير محدد'} (طلب #${formData.requestId})`
            : '';

        const finalNotes = [requestNotePart, formData.notes].filter(Boolean).join(' - ');

        const newDonation: CreateDonationRequest = {
            donorID: parseInt(formData.donorId),
            bloodTypeID: bloodTypeId,
            donationDate: new Date().toISOString().split('T')[0],
            quantity,
            notes: finalNotes || undefined
        };

        const result = await createDonation.mutateAsync(newDonation);

        // إذا تمت الموافقة المخبرية مسبقاً أو تم ربطها بطلب دم
        if (result.isSuccess) {
            const donationAny = result.data as any;
            const newDonationId = donationAny?.donationID ?? donationAny?.donationId ?? (result.data as any)?.id;

            if (newDonationId && formData.labApproved) {
                // 1️⃣ تسجيل نتيجة الفحص (سليم)
                await performLabTest.mutateAsync({
                    id: newDonationId,
                    data: {
                        testResult: 'Accepted' as TestResult,
                        testNotes: formData.labNotes || null,
                        addToInventoryIfAccepted: true,
                    }
                });

                // 2️⃣ تحديث المخزون مباشرةً عبر نقطة النهاية
                await updateInventory.mutateAsync({
                    bloodTypeId,
                    data: { quantityChange: quantity }
                });

                // 3️⃣ رفع وثيقة المعمل إن وجدت
                if (labFile) {
                    await uploadDocument.mutateAsync({
                        donorId: parseInt(formData.donorId),
                        documentType: 'LabReport',
                        file: labFile,
                    });
                }
            }

            // ربط التبرع بطلب الدم والمريض في دورة الحياة
            if (formData.requestId) {
                try {
                    // Check if a response already exists for this donor and request
                    const responsesResult = await donorResponsesApi.getByDonorId(parseInt(formData.donorId));
                    let response = responsesResult.isSuccess && responsesResult.data
                        ? responsesResult.data.find(r => r.requestId === parseInt(formData.requestId))
                        : null;

                    if (!response) {
                        // Create a response if it doesn't exist
                        const createResult = await donorResponsesApi.create({
                            donorId: parseInt(formData.donorId),
                            requestId: parseInt(formData.requestId),
                            notes: "تسجيل يدوي للتبرع"
                        });
                        if (createResult.isSuccess && createResult.data) {
                            response = createResult.data;
                        }
                    }

                    if (response) {
                        if (formData.labApproved) {
                            // If lab approved immediately, update status to Donated
                            await updateResponseStatus.mutateAsync({
                                id: response.responseId,
                                data: {
                                    status: ResponseStatus.Donated,
                                    notes: formData.labNotes || "تم قبول التبرع مخبرياً وتحديث الحالة تلقائياً",
                                    donationId: newDonationId
                                }
                            });

                            // Check and update blood request status to Fulfilled if needed
                            if (selectedReq) {
                                const alreadyFulfilled = selectedReq.quantityFulfilled ?? 0;
                                const totalFulfilled = alreadyFulfilled + quantity;
                                const needed = selectedReq.quantityNeeded ?? 0;

                                if (totalFulfilled >= needed) {
                                    await updateBloodRequestStatus.mutateAsync({
                                        id: selectedReq.requestId,
                                        status: 'Fulfilled',
                                        notes: 'تم تلبية جميع الوحدات المطلوبة',
                                    });
                                }
                            }
                        } else {
                            // If not lab approved yet, update response status to Confirmed so it shows as Confirmed in dashboard
                            await updateResponseStatus.mutateAsync({
                                id: response.responseId,
                                data: {
                                    status: ResponseStatus.Confirmed,
                                    notes: "تم تسجيل التبرع يدوياً وهو قيد الفحص المخبري"
                                }
                            });
                        }
                    }
                } catch (err) {
                    console.error("Error updating response status:", err);
                }
            }
        }

        setIsAddDialogOpen(false);
        resetForm();
    };

    // معالجة فحص مخبري جديد
    const handlePerformLabTest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDonationForLabTest || !selectedDonationInfo) return;

        // التحقق من الملف عند الموافقة
        if (labTestForm.testResult === 'Accepted' && !labTestFile) {
            toast({
                title: 'ملف مطلوب',
                description: 'يجب إرفاق تقرير المختبر قبل قبول العينة',
                variant: 'destructive'
            });
            return;
        }

        // 1️⃣ تسجيل نتيجة الفحص
        const labResult = await performLabTest.mutateAsync({
            id: selectedDonationForLabTest,
            data: {
                testResult: labTestForm.testResult as TestResult,
                testNotes: labTestForm.testNotes || null,
                addToInventoryIfAccepted: labTestForm.addToInventoryIfAccepted
            }
        });

        if (labResult.isSuccess) {
            // 2️⃣ رفع ملف التقرير إذا وُجد
            if (labTestFile) {
                await uploadDocument.mutateAsync({
                    donorId: selectedDonationInfo.donorId,
                    documentType: 'LabReport',
                    file: labTestFile,
                });
            }

            // 3️⃣ تحديث DonorRequestResponses وجلب الاستجابات لتحديثها
            const responsesResult = await donorResponsesApi.getByDonorId(selectedDonationInfo.donorId);
            if (responsesResult.isSuccess && responsesResult.data) {
                const confirmedResponse = responsesResult.data.find(
                    r => r.status === ResponseStatus.Confirmed
                );
                if (confirmedResponse) {
                    const newStatus = labTestForm.testResult === 'Accepted'
                        ? ResponseStatus.Donated   // 3
                        : ResponseStatus.Rejected; // 4

                    await updateResponseStatus.mutateAsync({
                        id: confirmedResponse.responseId,
                        data: {
                            status: newStatus,
                            notes: labTestForm.testNotes || undefined,
                            donationId: labTestForm.testResult === 'Accepted'
                                ? selectedDonationForLabTest
                                : undefined,
                        }
                    });

                    // 4️⃣ إقفال الطلب عند اكتمال الوحدات (عند الموافقة فقط)
                    if (labTestForm.testResult === 'Accepted' && confirmedResponse.requestId) {
                        const requestResult = await bloodRequestsApi.getById(confirmedResponse.requestId);
                        if (requestResult.isSuccess && requestResult.data) {
                            const req = requestResult.data;
                            const alreadyFulfilled = req.quantityFulfilled ?? 0;
                            const totalFulfilled = alreadyFulfilled + selectedDonationInfo.quantity;
                            const needed = req.quantityNeeded ?? 0;

                            if (totalFulfilled >= needed) {
                                await updateBloodRequestStatus.mutateAsync({
                                    id: confirmedResponse.requestId,
                                    status: 'Fulfilled',
                                    notes: 'تم تلبية جميع الوحدات المطلوبة',
                                });
                            }
                        }
                    }
                }
            }
        }
        
        setIsLabTestDialogOpen(false);
        setLabTestFile(null);
        if (labTestFileInputRef.current) labTestFileInputRef.current.value = '';
        setLabTestForm({ testResult: "Accepted", testNotes: "", addToInventoryIfAccepted: true });
        setSelectedDonationForLabTest(null);
        setSelectedDonationInfo(null);
    };

    // إعادة تعيين النموذج
    const resetForm = () => {
        setFormData({
            donorId: "",
            bloodType: "",
            quantity: "1",
            notes: "",
            labApproved: false,
            labNotes: "",
            requestId: "",
        });
        setLabFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
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
    const recentCount = recentData?.data?.length || 0;
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
                                    <div className="space-y-2">
                                        <Label>طلب الدم / المريض (اختياري)</Label>
                                        <Select
                                            value={formData.requestId}
                                            onValueChange={(v) => {
                                                setFormData(prev => ({ ...prev, requestId: v }));
                                                const selectedReq = pendingRequests.find(r => r.requestId.toString() === v);
                                                if (selectedReq) {
                                                    // Auto-select blood type of request
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

                                    {/* ── قسم اعتماد المعمل ── */}
                                    <div className="border-t pt-3 space-y-3">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded accent-primary cursor-pointer"
                                                checked={formData.labApproved}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    labApproved: e.target.checked
                                                }))}
                                            />
                                            <span className="flex items-center gap-1.5 text-sm font-medium group-hover:text-primary transition-colors">
                                                <FlaskConical className="h-4 w-4 text-green-600" />
                                                العينة معتمدة مخبرياً — أضف مباشرةً للمخزون
                                            </span>
                                        </label>

                                        {formData.labApproved && (
                                            <div className="rounded-lg border border-green-200 bg-green-50 p-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <p className="text-xs text-green-700 font-medium flex items-center gap-1">
                                                    <Package className="h-3.5 w-3.5" />
                                                    سيتم تسجيل الفحص ك‹سليم› وإضافة الوحدات للمخزون تلقائياً.
                                                </p>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">ملاحظات نتيجة المعمل (اختياري)</Label>
                                                    <Input
                                                        value={formData.labNotes}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, labNotes: e.target.value }))}
                                                        placeholder="أي ملاحظات من التقرير المخبري..."
                                                        className="text-sm h-8"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs flex items-center gap-1">
                                                        <Upload className="h-3.5 w-3.5" />
                                                        رفع وثيقة المعمل (اختياري)
                                                    </Label>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        className="block w-full text-xs text-muted-foreground
                                                            file:mr-3 file:py-1.5 file:px-3
                                                            file:rounded file:border-0
                                                            file:text-xs file:font-medium
                                                            file:bg-primary file:text-primary-foreground
                                                            hover:file:bg-primary/90 cursor-pointer"
                                                        onChange={(e) => setLabFile(e.target.files?.[0] || null)}
                                                    />
                                                    {labFile && (
                                                        <p className="text-xs text-green-700 flex items-center gap-1">
                                                            <FileCheck className="h-3.5 w-3.5" />
                                                            {labFile.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            type="submit"
                                            className="flex-1"
                                            disabled={createDonation.isPending || performLabTest.isPending || updateInventory.isPending || uploadDocument.isPending}
                                        >
                                            {(createDonation.isPending || performLabTest.isPending || updateInventory.isPending || uploadDocument.isPending) ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                                    {createDonation.isPending
                                                        ? "جاري التسجيل..."
                                                        : performLabTest.isPending
                                                        ? "جاري تسجيل الفحص..."
                                                        : updateInventory.isPending
                                                        ? "جاري تحديث المخزون..."
                                                        : "جاري رفع الوثيقة..."}
                                                </>
                                            ) : (
                                                <>
                                                    <Heart className="h-4 w-4 ml-2" />
                                                    {formData.labApproved ? "تسجيل وإضافة للمخزون" : "تسجيل التبرع"}
                                                </>
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
                                    <p className="text-sm text-muted-foreground mb-1">تبرعات مؤخراً (30 يوم)</p>
                                    <p className="text-3xl font-bold text-success">{recentCount}</p>
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
                                        <SelectItem value="Accepted">مقبول</SelectItem>
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
                                            <TableHead>ملاحظات الفحص</TableHead>
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
                                                        {donation.isAddedToInventory && (
                                                            <Badge variant="outline" className="text-xs mr-2 border-green-500 text-green-600">
                                                                بالمخزون
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {donation.testNotes ? (
                                                            <span className="text-sm text-muted-foreground truncate max-w-[120px] block" title={donation.testNotes}>
                                                                {donation.testNotes}
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            {donation.testResult === 'Pending' && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-primary hover:text-primary/80"
                                                                    onClick={() => {
                                                                        setSelectedDonationForLabTest(donation.id);
                                                                        setSelectedDonationInfo({
                                                                            id: donation.id,
                                                                            donorId: donation.donorId,
                                                                            bloodTypeId: donation.bloodTypeId,
                                                                            quantity: donation.quantity,
                                                                        });
                                                                        setIsLabTestDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <FlaskConical className="h-4 w-4 ml-1" />
                                                                    إجراء فحص
                                                                </Button>
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

                <Dialog 
                    open={isLabTestDialogOpen} 
                    onOpenChange={(open) => {
                        setIsLabTestDialogOpen(open);
                        if (!open) {
                            setLabTestFile(null);
                            if (labTestFileInputRef.current) labTestFileInputRef.current.value = '';
                            setSelectedDonationForLabTest(null);
                            setSelectedDonationInfo(null);
                            setLabTestForm({ testResult: "Accepted", testNotes: "", addToInventoryIfAccepted: true });
                        }
                    }}
                >
                    <DialogContent className="max-w-md" dir="rtl">
                        <DialogHeader>
                            <DialogTitle>إجراء فحص مخبري للتبرع</DialogTitle>
                            <DialogDescription>
                                سيتم تسجيل نتيجة الفحص وتحديث حالة وحدة الدم والمخزون بناءً عليها.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePerformLabTest} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>النتيجة *</Label>
                                <Select
                                    value={labTestForm.testResult}
                                    onValueChange={(v) => setLabTestForm(prev => ({ ...prev, testResult: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر النتيجة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Accepted">سليم (مقبول)</SelectItem>
                                        <SelectItem value="Rejected">غير سليم (مرفوض)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {labTestForm.testResult === 'Accepted'
                                        ? '⚠️ يتطلب رفع تقرير المختبر'
                                        : 'لا يتطلب ملفاً مرفقاً'}
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>ملاحظات الفحص</Label>
                                <Input
                                    value={labTestForm.testNotes}
                                    onChange={(e) => setLabTestForm(prev => ({ ...prev, testNotes: e.target.value }))}
                                    placeholder="أي ملاحظات إضافية عن الفحص..."
                                />
                            </div>

                            {/* قسم رفع تقرير المختبر — إلزامي عند مقبول */}
                            {labTestForm.testResult === 'Accepted' && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                                    <p className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        يجب إرفاق تقرير المختبر قبل قبول العينة
                                    </p>
                                    <Label className="text-xs flex items-center gap-1">
                                        <Upload className="h-3.5 w-3.5" />
                                        تقرير المختبر <span className="text-destructive">*</span>
                                    </Label>
                                    <input
                                        ref={labTestFileInputRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="block w-full text-xs text-muted-foreground
                                            file:mr-3 file:py-1.5 file:px-3
                                            file:rounded file:border-0
                                            file:text-xs file:font-medium
                                            file:bg-primary file:text-primary-foreground
                                            hover:file:bg-primary/90 cursor-pointer"
                                        onChange={(e) => setLabTestFile(e.target.files?.[0] || null)}
                                    />
                                    {labTestFile && (
                                        <p className="text-xs text-green-700 flex items-center gap-1">
                                            <FileCheck className="h-3.5 w-3.5" />
                                            {labTestFile.name}
                                        </p>
                                    )}
                                </div>
                            )}

                            {labTestForm.testResult === "Accepted" && (
                                <div className="flex items-center space-x-2 space-x-reverse pt-2">
                                    <input 
                                        type="checkbox"
                                        id="addToInventory"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={labTestForm.addToInventoryIfAccepted}
                                        onChange={(e) => setLabTestForm(prev => ({ ...prev, addToInventoryIfAccepted: e.target.checked }))}
                                    />
                                    <Label htmlFor="addToInventory" className="cursor-pointer">
                                        إضافة للوحدات المتاحة بالمخزون
                                    </Label>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button 
                                    type="submit" 
                                    className="flex-1" 
                                    disabled={
                                        performLabTest.isPending ||
                                        uploadDocument.isPending ||
                                        updateResponseStatus.isPending ||
                                        updateBloodRequestStatus.isPending ||
                                        (labTestForm.testResult === 'Accepted' && !labTestFile)
                                    }
                                >
                                    {performLabTest.isPending
                                        ? 'جاري تسجيل الفحص...'
                                        : uploadDocument.isPending
                                        ? 'جاري رفع التقرير...'
                                        : updateResponseStatus.isPending
                                        ? 'جاري تحديث الاستجابة...'
                                        : updateBloodRequestStatus.isPending
                                        ? 'جاري تحديث الطلب...'
                                        : 'حفظ نتيجة الفحص'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => { 
                                    setIsLabTestDialogOpen(false); 
                                    setLabTestFile(null);
                                    if (labTestFileInputRef.current) labTestFileInputRef.current.value = '';
                                    setSelectedDonationForLabTest(null); 
                                    setSelectedDonationInfo(null);
                                    setLabTestForm({ testResult: "Accepted", testNotes: "", addToInventoryIfAccepted: true });
                                }}>
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

export default DonationsManagement;
