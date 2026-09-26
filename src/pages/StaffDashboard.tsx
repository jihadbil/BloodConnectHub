import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import NotificationBell from "@/components/notifications/NotificationBell";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Droplet,
  Bell,
  Plus,
  Building2,
  MapPin,
  Clock,
  Users,
  Settings,
  CheckCircle2,
  AlertCircle,
  Phone,
  Calendar,
  Search,
  Eye,
  Trash2,
  Edit,
  Loader2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useBloodRequests, usePendingBloodRequests, useCreateBloodRequest, useCancelBloodRequest } from "@/hooks/useBloodRequests";
import { useDonors } from "@/hooks/useDonors";
import { usePatients } from "@/hooks/usePatients";
import { useQueries } from "@tanstack/react-query";
import { useUpdateResponseStatus } from "@/hooks/useDonorResponses";
import { donorResponsesApi } from "@/api/donorResponses";
import { ResponseStatus, ResponseStatusLabels } from "@/types/donor-response";
import { BLOOD_TYPE_MAP, BLOOD_TYPE_REVERSE_MAP } from "@/types/api";
import type { UrgencyLevel } from "@/types/api";
import { mapUrgencyLevel, formatDate, formatTimeAgo } from "@/lib/utils";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const departments = [
  { value: "الطوارئ", label: "الطوارئ" },
  { value: "الجراحة", label: "الجراحة" },
  { value: "الباطنة", label: "الباطنة" },
  { value: "النساء والولادة", label: "النساء والولادة" },
  { value: "العظام", label: "العظام" },
  { value: "الأطفال", label: "الأطفال" },
  { value: "العناية المركزة", label: "العناية المركزة" },
];

const urgencyConfig = {
  critical: { label: "طارئ", variant: "destructive" as const, className: "border-red-500 text-red-700 bg-red-50" },
  urgent: { label: "عاجل", variant: "outline" as const, className: "border-orange-500 text-orange-600 bg-orange-50" },
  normal: { label: "عادي", variant: "secondary" as const, className: "" },
};

const statusConfig = {
  available: { label: "متاح", variant: "default" as const },
  unavailable: { label: "غير متاح", variant: "secondary" as const },
  pending: { label: "قيد المراجعة", variant: "outline" as const },
};

// Loading skeleton for stats
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {Array.from({ length: 4 }).map((_, i) => (
      <Card key={i} variant="stat">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Loading skeleton for table
const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);

const StaffDashboard = () => {
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [searchDonor, setSearchDonor] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("all");
  const [donorPage, setDonorPage] = useState(1);
  const [requestPage, setRequestPage] = useState(1);

  // Form state for new request
  const [newRequest, setNewRequest] = useState({
    patientId: "",
    bloodType: "",
    unitsNeeded: "1",
    department: "",
    urgencyLevel: "" as UrgencyLevel | "",
    notes: ""
  });

  // جلب البيانات من API
  const { data: pendingRequestsData, isLoading: pendingLoading } = usePendingBloodRequests();
  const { data: requestsData, isLoading: requestsLoading, refetch: refetchRequests } = useBloodRequests(requestPage, 10);
  const { data: donorsData, isLoading: donorsLoading, refetch: refetchDonors } = useDonors(donorPage, 10);
  const { data: patientsData, isLoading: patientsLoading } = usePatients(1, 100);

  const createRequest = useCreateBloodRequest();
  const cancelRequest = useCancelBloodRequest();

  const [selectedResponseForReject, setSelectedResponseForReject] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const updateResponseStatus = useUpdateResponseStatus();

  // IDs of active requests
  const activeRequestIds = pendingRequestsData?.data?.map(req => req.requestId) || [];

  // Fetch responses for all active requests in parallel
  const responsesQueries = useQueries({
    queries: activeRequestIds.map(requestId => ({
      queryKey: ['donorResponses', 'list', 'request', requestId],
      queryFn: async () => {
        const result = await donorResponsesApi.getByRequestId(requestId);
        return result.success ? result.data || [] : [];
      },
      enabled: activeRequestIds.length > 0,
    }))
  });

  // Combine and flatten all responses that are 'Interested'
  const allInterestedResponses = responsesQueries
    .flatMap(q => q.data || [])
    .filter(res => res.status === ResponseStatus.Interested);

  const handleConfirmResponse = async (id: number) => {
    if (confirm("هل أنت متأكد من تأكيد استجابة هذا المتبرع؟")) {
      try {
        const result = await updateResponseStatus.mutateAsync({
          id,
          data: { status: ResponseStatus.Confirmed, notes: "تم التأكيد من قبل الموظف" }
        });
        if (result.success) {
          alert("تم تأكيد الاستجابة بنجاح");
        } else {
          alert(result.message || "فشل في تأكيد الاستجابة");
        }
      } catch (err: any) {
        alert(err?.message || "حدث خطأ أثناء تأكيد الاستجابة");
      }
    }
  };

  const handleRejectResponse = async () => {
    if (!selectedResponseForReject) return;
    if (!rejectionReason.trim()) {
      alert("يرجى إدخال سبب الرفض");
      return;
    }

    try {
      const result = await updateResponseStatus.mutateAsync({
        id: selectedResponseForReject,
        data: { 
          status: ResponseStatus.Rejected, 
          notes: `تم الرفض: ${rejectionReason.trim()}` 
        }
      });
      if (result.success) {
        alert("تم رفض الاستجابة بنجاح");
        setSelectedResponseForReject(null);
        setRejectionReason("");
      } else {
        alert(result.message || "فشل في رفض الاستجابة");
      }
    } catch (err: any) {
      alert(err?.message || "حدث خطأ أثناء رفض الاستجابة");
    }
  };

  // تحويل البيانات
  const activeRequests = pendingRequestsData?.data?.map(req => {
    const rawReq = req as any;
    const units = req.quantityNeeded ?? rawReq.quantity ?? rawReq.unitsNeeded ?? 0;
    // استخدام BLOOD_TYPE_MAP مباشرة لأن API يُرجع bloodTypeId
    const bloodType = BLOOD_TYPE_MAP[req.bloodTypeId] || req.bloodType?.typeName || rawReq.bloodTypeName || '-';
    return {
      id: req.requestId,
      bloodType,
      unitsNeeded: units,
      urgency: mapUrgencyLevel(req.urgencyLevel),
      createdAt: formatDate(req.requestDate || rawReq.createdAt || new Date().toISOString()),
      patient: req.patient?.fullName || rawReq.patientName || 'غير محدد',
      department: req.notes?.split(' - ')[0] || rawReq.department || 'غير محدد',
      status: req.status
    };
  }) || [];

  const donors = donorsData?.data?.items?.map(donor => ({
    id: donor.donorId,
    name: donor.fullName,
    // استخدام BLOOD_TYPE_MAP مباشرة لأن API يُرجع bloodTypeId
    bloodType: BLOOD_TYPE_MAP[donor.bloodTypeId] || `فصيلة ${donor.bloodTypeId}`,
    phone: donor.phone,
    lastDonation: donor.lastDonationDate ? formatDate(donor.lastDonationDate) : 'لم يتبرع بعد',
    totalDonations: 0, // غير متوفر في API الحالي
    status: donor.isActive ? 'available' : 'unavailable'
  })) || [];

  const patients = patientsData?.data?.items || [];


  const stats = {
    activeRequests: pendingRequestsData?.data?.length || 0,
    completedRequests: (requestsData?.data?.totalCount || 0) - (pendingRequestsData?.data?.length || 0),
    totalDonors: donorsData?.data?.totalCount || 0,
    todayDonations: 0, // يحتاج endpoint خاص
  };

  // تصفية المتبرعين
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.includes(searchDonor) || donor.phone.includes(searchDonor);
    const matchesBloodType = filterBloodType === "all" || donor.bloodType === filterBloodType;
    return matchesSearch && matchesBloodType;
  });

  // معالجة إنشاء طلب جديد
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRequest.patientId || !newRequest.bloodType || !newRequest.urgencyLevel) {
      return;
    }

    // تحويل urgencyLevel إلى رقم: Normal=1, Urgent=2, Emergency=3
    const urgencyMap: Record<string, number> = {
      'Normal': 1,
      'Urgent': 2,
      'Emergency': 3
    };

    const requestData = {
      patientID: parseInt(newRequest.patientId),
      bloodTypeID: BLOOD_TYPE_REVERSE_MAP[newRequest.bloodType],
      quantityNeeded: parseInt(newRequest.unitsNeeded),
      urgencyLevel: urgencyMap[newRequest.urgencyLevel],
      requiredDate: new Date().toISOString(),
      notes: newRequest.department && newRequest.notes 
        ? `${newRequest.department} - ${newRequest.notes}`
        : newRequest.department || newRequest.notes || null
    };

    await createRequest.mutateAsync(requestData as any);

    setIsNewRequestOpen(false);
    setNewRequest({
      patientId: "",
      bloodType: "",
      unitsNeeded: "1",
      department: "",
      urgencyLevel: "",
      notes: ""
    });
  };

  // معالجة إلغاء الطلب
  const handleCancelRequest = async (requestId: number) => {
    if (confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) {
      await cancelRequest.mutateAsync({
        id: requestId,
        reason: "تم الإلغاء من قبل الموظف"
      });
    }
  };

  const isLoading = pendingLoading || requestsLoading || donorsLoading;

  return (
    <div className="min-h-screen bg-secondary/30" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                لوحة تحكم الموظفين
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="secondary">مستشفى غريان التعليمي</Badge>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  غريان، ليبيا
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  طلب دم جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle>إنشاء طلب دم جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateRequest} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>المريض</Label>
                    <Select
                      value={newRequest.patientId}
                      onValueChange={(v) => setNewRequest(prev => ({ ...prev, patientId: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المريض" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="max-h-[200px]">
                        {patientsLoading ? (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            جاري التحميل...
                          </div>
                        ) : patients.length === 0 ? (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            لا يوجد مرضى مسجلين. يرجى إضافة مرضى أولاً.
                          </div>
                        ) : (
                          patients.map((patient: any) => (
                            <SelectItem
                              key={patient.patientID || patient.patientId}
                              value={(patient.patientID || patient.patientId)?.toString() || ""}
                            >
                              {patient.fullName} - {patient.nationalID || patient.nationalId}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>فصيلة الدم المطلوبة</Label>
                      <Select
                        value={newRequest.bloodType}
                        onValueChange={(v) => setNewRequest(prev => ({ ...prev, bloodType: v }))}
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
                      <Label>عدد الوحدات</Label>
                      <Input
                        type="number"
                        min="1"
                        value={newRequest.unitsNeeded}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, unitsNeeded: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>القسم</Label>
                      <Select
                        value={newRequest.department}
                        onValueChange={(v) => setNewRequest(prev => ({ ...prev, department: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر القسم" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {departments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>مستوى الاستعجال</Label>
                      <Select
                        value={newRequest.urgencyLevel}
                        onValueChange={(v) => setNewRequest(prev => ({ ...prev, urgencyLevel: v as UrgencyLevel }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المستوى" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="Emergency">طارئ - فوري</SelectItem>
                          <SelectItem value="Urgent">عاجل</SelectItem>
                          <SelectItem value="Normal">عادي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>ملاحظات إضافية</Label>
                    <Textarea
                      placeholder="أي معلومات إضافية عن الحالة..."
                      value={newRequest.notes}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={createRequest.isPending}
                    >
                      {createRequest.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                          جاري الإنشاء...
                        </>
                      ) : (
                        "نشر الطلب"
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsNewRequestOpen(false)}>
                      إلغاء
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <NotificationBell />
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Link to="/staff/reports">
              <Button variant="outline" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                التقارير
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card variant="stat">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">طلبات نشطة</p>
                    <p className="text-3xl font-bold text-primary">{stats.activeRequests}</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-primary/30" />
                </div>
              </CardContent>
            </Card>

            <Card variant="stat">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">طلبات مكتملة</p>
                    <p className="text-3xl font-bold text-success">{stats.completedRequests}</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-success/30" />
                </div>
              </CardContent>
            </Card>

            <Card variant="stat">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">إجمالي المتبرعين</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalDonors}</p>
                  </div>
                  <Users className="h-10 w-10 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>

            <Card variant="stat">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">تبرعات اليوم</p>
                    <p className="text-3xl font-bold text-primary">{stats.todayDonations}</p>
                  </div>
                  <Droplet className="h-10 w-10 text-primary/30" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="requests">طلبات الدم</TabsTrigger>
            <TabsTrigger value="responses">استجابات المتبرعين</TabsTrigger>
            <TabsTrigger value="donors">المتبرعين</TabsTrigger>
          </TabsList>

          {/* Blood Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>طلبات الدم النشطة</CardTitle>
                  <CardDescription>إدارة ومتابعة طلبات الدم الحالية في المستشفى</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetchRequests()}>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  تحديث
                </Button>
              </CardHeader>
              <CardContent>
                {pendingLoading ? (
                  <TableSkeleton />
                ) : activeRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                    <p className="text-lg font-medium">لا توجد طلبات نشطة</p>
                    <p className="text-muted-foreground">جميع الطلبات تم تلبيتها</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الفصيلة</TableHead>
                          <TableHead>المريض</TableHead>
                          <TableHead>القسم</TableHead>
                          <TableHead>الوحدات</TableHead>
                          <TableHead>الاستعجال</TableHead>
                          <TableHead>التاريخ</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeRequests.map((request) => {
                          const urgency = urgencyConfig[request.urgency as keyof typeof urgencyConfig];
                          return (
                            <TableRow key={request.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Droplet className="h-5 w-5 text-primary fill-primary" />
                                  <span className="font-bold">{request.bloodType}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{request.patient}</TableCell>
                              <TableCell>{request.department}</TableCell>
                              <TableCell>{request.unitsNeeded}</TableCell>
                              <TableCell>
                                <Badge variant={urgency.variant} className={urgency.className}>{urgency.label}</Badge>
                              </TableCell>
                              <TableCell>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {request.createdAt}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" title="عرض التفاصيل">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title="تعديل">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="إلغاء الطلب"
                                    className="text-destructive"
                                    onClick={() => handleCancelRequest(request.id)}
                                    disabled={cancelRequest.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
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
                {requestsData?.data?.totalPages && requestsData.data.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRequestPage(p => Math.max(1, p - 1))}
                      disabled={requestPage === 1}
                    >
                      السابق
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                      صفحة {requestPage} من {requestsData.data.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRequestPage(p => p + 1)}
                      disabled={requestPage === requestsData.data.totalPages}
                    >
                      التالي
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donor Responses Tab */}
          <TabsContent value="responses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>استجابات المتبرعين الجديدة</CardTitle>
                  <CardDescription>
                    المتبرعون الذين أبدو اهتمامهم بالتبرع للطلبات النشطة ويحتاجون إلى تأكيد
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {allInterestedResponses.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                    <p className="text-lg font-medium">لا توجد استجابات جديدة قيد الانتظار</p>
                    <p className="text-muted-foreground">تمت معالجة جميع استجابات المتبرعين</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>اسم المتبرع</TableHead>
                          <TableHead>فصيلة الدم</TableHead>
                          <TableHead>الطلب</TableHead>
                          <TableHead>تاريخ الاستجابة</TableHead>
                          <TableHead>ملاحظات المتبرع</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allInterestedResponses.map((response) => (
                          <TableRow key={response.responseId}>
                            <TableCell className="font-semibold text-foreground">
                              {response.donorName}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <Droplet className="h-4 w-4 text-primary fill-primary" />
                                <span className="font-bold">{response.bloodTypeName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {response.patientName ? `المريض: ${response.patientName}` : `طلب #${response.requestId}`}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDate(response.responseDate || response.createdAt)}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-sm" title={response.notes}>
                              {response.notes || <span className="text-muted-foreground italic">لا توجد ملاحظات</span>}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleConfirmResponse(response.responseId)}
                                  disabled={updateResponseStatus.isPending}
                                >
                                  تأكيد الاستجابة
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive border-destructive hover:bg-destructive/10"
                                  onClick={() => setSelectedResponseForReject(response.responseId)}
                                  disabled={updateResponseStatus.isPending}
                                >
                                  رفض
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rejection Reason Dialog */}
            <Dialog open={selectedResponseForReject !== null} onOpenChange={(open) => { if (!open) { setSelectedResponseForReject(null); setRejectionReason(""); } }}>
              <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-destructive flex items-center gap-2 font-bold">
                    <AlertCircle className="h-5 w-5" />
                    رفض استجابة المتبرع
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-3">
                  <div className="space-y-2">
                    <Label htmlFor="rejection-reason">سبب الرفض</Label>
                    <Textarea
                      id="rejection-reason"
                      placeholder="اكتب سبب الرفض هنا ليتم إبلاغ المتبرع به..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => { setSelectedResponseForReject(null); setRejectionReason(""); }}
                    >
                      إلغاء
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleRejectResponse}
                      disabled={updateResponseStatus.isPending}
                    >
                      {updateResponseStatus.isPending ? "جاري الحفظ..." : "تأكيد الرفض"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Donors Tab */}
          <TabsContent value="donors">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>قائمة المتبرعين</CardTitle>
                    <CardDescription>إدارة بيانات المتبرعين المسجلين ({donorsData?.data?.totalCount || 0} متبرع)</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="بحث بالاسم أو الهاتف..."
                        value={searchDonor}
                        onChange={(e) => setSearchDonor(e.target.value)}
                        className="pr-10 w-full sm:w-64"
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
                    <Button variant="outline" size="icon" onClick={() => refetchDonors()}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {donorsLoading ? (
                  <TableSkeleton />
                ) : filteredDonors.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-lg font-medium">لا توجد نتائج</p>
                    <p className="text-muted-foreground">جرب تغيير معايير البحث</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الاسم</TableHead>
                          <TableHead>الفصيلة</TableHead>
                          <TableHead>الهاتف</TableHead>
                          <TableHead>آخر تبرع</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDonors.map((donor) => {
                          const status = statusConfig[donor.status as keyof typeof statusConfig];
                          return (
                            <TableRow key={donor.id}>
                              <TableCell className="font-medium">{donor.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Droplet className="h-4 w-4 text-primary fill-primary" />
                                  <span className="font-bold">{donor.bloodType}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {donor.phone}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {donor.lastDonation}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge variant={status.variant}>{status.label}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" title="عرض التفاصيل">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title="تعديل">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    طلب تبرع
                                  </Button>
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
                {donorsData?.data?.totalPages && donorsData.data.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDonorPage(p => Math.max(1, p - 1))}
                      disabled={donorPage === 1}
                    >
                      السابق
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                      صفحة {donorPage} من {donorsData.data.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDonorPage(p => p + 1)}
                      disabled={donorPage === donorsData.data.totalPages}
                    >
                      التالي
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default StaffDashboard;
