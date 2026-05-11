import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Clock, Droplet, Search, Building2, AlertCircle, RefreshCw } from "lucide-react";
import { useBloodRequests, useUrgentBloodRequests } from "@/hooks/useBloodRequests";
import { BLOOD_TYPE_MAP, BloodRequest } from "@/types/api";
import { mapUrgencyLevel, formatTimeAgo, mapRequestStatus } from "@/lib/utils";
import { ResponseDialog } from "@/components/blood-requests/ResponseDialog";

const urgencyConfig = {
  critical: { label: "حرج", variant: "destructive" as const, className: "bg-destructive text-white animate-pulse" },
  urgent: { label: "عاجل", variant: "outline" as const, className: "border-orange-500 text-orange-600 bg-orange-50" },
  normal: { label: "عادي", variant: "secondary" as const, className: "" },
};

const bloodTypes = ["جميع الفصائل", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = ["جميع المستويات", "حرج", "عاجل", "عادي"];

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

  // جلب البيانات من API
  const { data, isLoading, error, refetch } = useBloodRequests(page, pageSize);
  const { data: urgentData } = useUrgentBloodRequests();

  // Handle respond to request
  const handleRespond = (request: BloodRequest) => {
    setSelectedRequest(request);
    setIsRespondDialogOpen(true);
  };

  // Handle successful response - refresh the list
  const handleResponseSuccess = () => {
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
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Building2 className="h-4 w-4" />
            <span>مستشفى غريان المركزي</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            طلبات <span className="text-primary">الدم</span>
          </h1>
          <p className="text-muted-foreground">
            تصفح طلبات الدم الحالية في مستشفى غريان المركزي واستجب للحالات التي تناسب فصيلة دمك
          </p>
          {urgentCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
              <AlertCircle className="h-4 w-4" />
              <span>{urgentCount} طلب عاجل يحتاج مساعدتك!</span>
            </div>
          )}
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
              حرج
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
                              <span>مستشفى غريان المركزي</span>
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
                      <Button
                        variant={request.urgency === "critical" ? "urgent" : "default"}
                        className="w-full"
                        onClick={() => originalRequest && handleRespond(originalRequest)}
                        disabled={!originalRequest}
                      >
                        استجب للطلب
                      </Button>
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
