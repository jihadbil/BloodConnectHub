import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Clock, Droplet, Search, Building2, AlertCircle, RefreshCw, Plus, Loader2, Trash2, Power, PowerOff } from "lucide-react";
import { useBloodRequests, useUrgentBloodRequests, useCreateBloodRequest, useUpdateBloodRequestStatus, useDeleteBloodRequest } from "@/hooks/useBloodRequests";
import { usePatients } from "@/hooks/usePatients";
import { useAuth } from "@/hooks/useAuth";
import { BLOOD_TYPE_MAP, BLOOD_TYPE_REVERSE_MAP, BloodRequest, RequestStatus } from "@/types/api";
import type { UrgencyLevel } from "@/types/api";
import { mapUrgencyLevel, formatTimeAgo, mapRequestStatus } from "@/lib/utils";
import { ResponseDialog } from "@/components/blood-requests/ResponseDialog";

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
  critical: { label: "طارئ", variant: "destructive" as const, className: "bg-destructive text-white animate-pulse" },
  urgent: { label: "عاجل", variant: "outline" as const, className: "border-orange-500 text-orange-600 bg-orange-50" },
  normal: { label: "عادي", variant: "secondary" as const, className: "" },
};


const urgencyLevels = ["جميع المستويات", "طارئ", "عاجل", "عادي"];

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} variant="elevated">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-5 w-12" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-4" />
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

// Error Component
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <Alert variant="destructive" className="my-8">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>خطأ في تحميل البيانات</AlertTitle>
    <AlertDescription className="flex items-center justify-between">
      <span>{message}</span>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="h-4 w-4 ml-2" />
        إعادة المحاولة
      </Button>
    </AlertDescription>
  </Alert>
);

// Empty State Component
const EmptyState = () => (
  <div className="text-center py-16">
    <Droplet className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
    <h3 className="text-xl font-bold text-foreground mb-2">لا توجد طلبات</h3>
    <p className="text-muted-foreground">لا توجد طلبات دم في الوقت الحالي</p>
  </div>
);

const BloodRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("جميع الفصائل");
  const [selectedUrgency, setSelectedUrgency] = useState("جميع المستويات");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Dialog state for responding to request
  const [isRespondDialogOpen, setIsRespondDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  // Dialog state for creating new request
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    patientId: "",
    bloodType: "",
    unitsNeeded: "1",
    department: "",
    urgencyLevel: "" as UrgencyLevel | "",
    notes: ""
  });

  // Auth
  const { isStaff } = useAuth();

  // جلب البيانات من API
  const { data, isLoading, error, refetch } = useBloodRequests(page, pageSize);
  const { data: urgentData } = useUrgentBloodRequests();
  const { data: patientsData, isLoading: patientsLoading } = usePatients(1, 100);
  const patients = patientsData?.data?.items || [];

  const createRequest = useCreateBloodRequest();
  const statusMutation = useUpdateBloodRequestStatus();
  const deleteMutation = useDeleteBloodRequest();
  const [selectedActionId, setSelectedActionId] = useState<number | null>(null);

  const handleToggleStatus = async (id: number, status: RequestStatus) => {
    setSelectedActionId(id);
    try {
      await statusMutation.mutateAsync({ id, status });
      refetch();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setSelectedActionId(null);
    }
  };

  const handleDeleteRequest = async (id: number) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف طلب الدم هذا نهائياً؟")) {
      setSelectedActionId(id);
      try {
        await deleteMutation.mutateAsync(id);
        refetch();
      } catch (err) {
        console.error("Failed to delete request:", err);
      } finally {
        setSelectedActionId(null);
      }
    }
  };

  // Handle respond to request
  const handleRespond = (request: BloodRequest) => {
    setSelectedRequest(request);
    setIsRespondDialogOpen(true);
  };

  // Handle successful response - refresh the list
  const handleResponseSuccess = () => {
    refetch();
  };

  // معالجة إنشاء طلب جديد
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.patientId || !newRequest.bloodType || !newRequest.urgencyLevel) return;

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
    setNewRequest({ patientId: "", bloodType: "", unitsNeeded: "1", department: "", urgencyLevel: "", notes: "" });
    refetch();
  };

  // تحويل البيانات من API للعرض
  const transformedRequests = data?.data?.items?.map(req => {
    // استخراج عدد الوحدات - الحقل الصحيح هو quantityNeeded
    const units = req.quantityNeeded || 0;

    // استخراج فصيلة الدم - استخدام BLOOD_TYPE_MAP مباشرة لأن API يُرجع bloodTypeId
    // BLOOD_TYPE_MAP تم تحديثه ليطابق البيانات الفعلية من API
    const bloodTypeName = BLOOD_TYPE_MAP[req.bloodTypeId] || req.bloodType?.typeName || `فصيلة ${req.bloodTypeId}`;

    // استخراج ملاحظات/قسم
    const notesText = req.notes || '';

    return {
      id: req.requestId,
      bloodType: bloodTypeName,
      department: notesText.split(' - ')[0] || 'بنك الدم',
      unitsNeeded: units,
      urgency: mapUrgencyLevel(req.urgencyLevel),
      timeAgo: formatTimeAgo(req.requestDate || new Date().toISOString()),
      description: notesText || 'طلب دم للمستشفى',
      status: req.status,
      patientName: req.patient?.fullName || 'مريض'
    };
  }) || [];

  // تصفية البيانات
  const filteredRequests = transformedRequests.filter((request) => {
    const matchesSearch = request.department.includes(searchTerm) ||
      request.description.includes(searchTerm) ||
      request.patientName.includes(searchTerm);
    const matchesBloodType = selectedBloodType === "جميع الفصائل" || request.bloodType === selectedBloodType;
    const matchesUrgency = selectedUrgency === "جميع المستويات" ||
      urgencyConfig[request.urgency as keyof typeof urgencyConfig]?.label === selectedUrgency;
    return matchesSearch && matchesBloodType && matchesUrgency;
  });

  // إحصائيات سريعة
  const urgentCount = urgentData?.data?.length || 0;
  const totalPages = data?.data?.totalPages || 1;
  const totalCount = data?.data?.totalCount || 0;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Building2 className="h-4 w-4" />
                <span>مستشفى غريان التعليمي</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                طلبات <span className="text-primary">الدم</span>
              </h1>
              <p className="text-muted-foreground">
                تصفح طلبات الدم الحالية في مستشفى غريان التعليمي واستجب للحالات التي تناسب فصيلة دمك
              </p>
              {urgentCount > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
                  <AlertCircle className="h-4 w-4" />
                  <span>{urgentCount} طلب عاجل يحتاج مساعدتك!</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-center">
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث البيانات
              </Button>

              {isStaff && (
                <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="gap-2">
                      <Plus className="h-5 w-5" />
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
                            <div className="p-2 text-center text-sm text-muted-foreground">جاري التحميل...</div>
                          ) : patients.length === 0 ? (
                            <div className="p-2 text-center text-sm text-muted-foreground">لا يوجد مرضى مسجلين. يرجى إضافة مرضى أولاً.</div>
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
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>عدد الوحدات</Label>
                        <input
                          type="number"
                          min="1"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
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
                              <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
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
                        disabled={createRequest.isPending || !newRequest.patientId || !newRequest.bloodType || !newRequest.urgencyLevel}
                      >
                        {createRequest.isPending ? (
                          <><Loader2 className="h-4 w-4 ml-2 animate-spin" />جاري الإنشاء...</>
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
            )}
          </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن قسم أو وصف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                <SelectTrigger>
                  <SelectValue placeholder="فصيلة الدم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="جميع الفصائل">الكل</SelectItem>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="مستوى الاستعجال" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-32 inline-block" />
            ) : (
              <>
                عرض <span className="font-bold text-foreground">{filteredRequests.length}</span> من{" "}
                <span className="font-bold text-foreground">{totalCount}</span> طلب
              </>
            )}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              طارئ
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-warning" />
              عاجل
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success" />
              عادي
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <ErrorState
            message="فشل في تحميل طلبات الدم. تأكد من اتصالك بالإنترنت ومن تشغيل الخادم."
            onRetry={() => refetch()}
          />
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Empty State */}
        {!isLoading && !error && filteredRequests.length === 0 && <EmptyState />}

        {/* Requests Grid */}
        {!isLoading && !error && filteredRequests.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request, index) => {
                const urgency = urgencyConfig[request.urgency as keyof typeof urgencyConfig];
                // Find the original API request data for this transformed request
                const originalRequest = data?.data?.items?.find(r => r.requestId === request.id);

                return (
                  <Card
                    key={request.id}
                    variant={request.urgency === "critical" ? "urgent" : "elevated"}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Droplet className="h-12 w-12 text-primary fill-primary" />
                            <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-xs">
                              {request.bloodType}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-lg">{request.department}</CardTitle>
                            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                              <MapPin className="h-3 w-3" />
                              <span>مستشفى غريان التعليمي</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={urgency.variant} className={urgency.className}>
                          {urgency.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-muted-foreground">الكمية المطلوبة:</span>
                        <span className="font-bold text-foreground">
                          {request.unitsNeeded > 0 ? `${request.unitsNeeded} وحدة` : 'غير محدد'}
                        </span>
                      </div>
                      {request.status && (() => {
                        const statusInfo = mapRequestStatus(request.status);
                        return (
                          <div className="flex items-center justify-between text-sm mb-3">
                            <span className="text-muted-foreground">حالة الطلب:</span>
                            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          </div>
                        );
                      })()}
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mb-4">
                        <Clock className="h-3 w-3" />
                        <span>{request.timeAgo}</span>
                      </div>
                      {isStaff ? (
                        <div className="flex flex-col gap-2 w-full mt-2">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Select
                                value={request.status}
                                onValueChange={(value) => handleToggleStatus(request.id, value as RequestStatus)}
                                disabled={statusMutation.isPending && selectedActionId === request.id}
                              >
                                <SelectTrigger className="w-full text-xs h-9 bg-background border-border">
                                  {statusMutation.isPending && selectedActionId === request.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin ml-2" />
                                  ) : null}
                                  <SelectValue placeholder="تغيير الحالة" />
                                </SelectTrigger>
                                <SelectContent dir="rtl">
                                  <SelectItem value="Pending">قيد الانتظار (نشط)</SelectItem>
                                  <SelectItem value="Fulfilled">تم التوفير</SelectItem>
                                  <SelectItem value="PartiallyFulfilled">تم التوفير جزئياً</SelectItem>
                                  <SelectItem value="Cancelled">ملغى (غير نشط)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="bg-rose-600 hover:bg-rose-700 h-9 w-9 shrink-0 transition-all duration-300"
                              onClick={() => handleDeleteRequest(request.id)}
                              disabled={deleteMutation.isPending && selectedActionId === request.id}
                            >
                              {deleteMutation.isPending && selectedActionId === request.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant={request.urgency === "critical" ? "urgent" : "default"}
                          className="w-full"
                          onClick={() => originalRequest && handleRespond(originalRequest)}
                          disabled={!originalRequest}
                        >
                          استجب للطلب
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
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
          </>
        )}

        {/* Respond Dialog */}
        <ResponseDialog
          open={isRespondDialogOpen}
          onOpenChange={setIsRespondDialogOpen}
          request={selectedRequest}
          onSuccess={handleResponseSuccess}
        />
      </main>
      <Footer />
    </div>
  );
};

export default BloodRequests;
