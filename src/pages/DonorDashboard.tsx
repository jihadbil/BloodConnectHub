import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import NotificationBell from "@/components/notifications/NotificationBell";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Droplet,
  Bell,
  History,
  MapPin,
  Clock,
  Heart,
  User,
  Settings,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  Building2,
  AlertCircle,
  XCircle,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUrgentBloodRequests } from "@/hooks/useBloodRequests";
import { useDonor, useDonorByUserId } from "@/hooks/useDonors";
import { useDonorDonations } from "@/hooks/useDonations";
import { useDonorDocuments } from "@/hooks/useMedicalDocuments";
import { useDonorResponses, useCancelDonorResponse } from "@/hooks/useDonorResponses";
import { ResponseStatus, ResponseStatusLabels, ResponseStatusVariant } from "@/types/donor-response";
import { MedicalDocumentsDialog } from "@/components/donors/MedicalDocumentsDialog";
import { formatDate, mapUrgencyLevel } from "@/lib/utils";
import { BLOOD_TYPE_MAP } from "@/types/api";
import { canDonateToPatient } from "@/lib/bloodCompatibility";
import type { ApiUser, BloodRequest } from "@/types/api";
import { X } from "lucide-react";

const DonorDashboard = () => {
  const { user } = useAuth();
  const apiUser = user as ApiUser | null;
  const [isDocsDialogOpen, setIsDocsDialogOpen] = useState(false);

  // جلب الطلبات العاجلة
  const { data: urgentRequestsData, isLoading: requestsLoading } = useUrgentBloodRequests();

  // جلب بيانات المتبرع عبر userId مباشرة
  const { data: donorByUserData, isLoading: donorByUserLoading } = useDonorByUserId(apiUser?.id || "");
  const rawDonor = donorByUserData?.data as any;
  // الـ API يُعيد donorID بحرف كبير — نتعامل مع جميع الاحتمالات
  const donorId: number | undefined =
    rawDonor?.donorID || rawDonor?.donorId || rawDonor?.DonorID || undefined;

  // بيانات المتبرع الحالية
  const currentDonor = donorByUserData?.data;

  // جلب الوثائق الطبية
  const { data: documentsData, isLoading: documentsLoading } = useDonorDocuments(donorId ?? 0);
  const documents = documentsData?.data || [];

  // جلب التبرعات الخاصة بالمتبرع الحالي
  const { data: donationsData, isLoading: donationsLoading } = useDonorDonations(donorId ?? 0);

  // جلب الاستجابات
  const { data: responsesData, isLoading: responsesLoading } = useDonorResponses({ donorId: donorId ?? 0 });
  const myResponses = responsesData || [];
  const cancelResponse = useCancelDonorResponse();

  const handleCancelResponse = async (responseId: number) => {
    if (window.confirm("هل أنت متأكد من رغبتك في إلغاء استجابتك لهذا الطلب؟")) {
      try {
        const result = await cancelResponse.mutateAsync({ id: responseId, reason: "تم الإلغاء من قبل المتبرع عبر لوحة التحكم" });
        if (result.success) {
          alert("تم إلغاء الاستجابة بنجاح");
        } else {
          alert(result.message || "فشل في إلغاء الاستجابة");
        }
      } catch (err: any) {
        alert(err?.message || "حدث خطأ أثناء إلغاء الاستجابة");
      }
    }
  };

  // دالة تحويل testResult من رقم إلى نص
  const normalizeTestResult = (result: string | number | undefined | null): string => {
    const numericMap: Record<number, string> = { 1: 'Pending', 2: 'Accepted', 3: 'Rejected' };
    if (result === null || result === undefined) return 'Pending';
    if (typeof result === 'number') return numericMap[result] || 'Pending';
    if (result === 'Approved') return 'Accepted';
    return result;
  };

  // تبرعات المتبرع الحالي
  const myDonations = (donationsData?.data || [])
    .map(d => ({ ...d, testResult: normalizeTestResult(d.testResult) }));

  // حساب الإحصائيات
  const totalDonations = myDonations.length;
  const approvedDonations = myDonations.filter(d => d.testResult === 'Accepted').length;
  const livesImpacted = approvedDonations * 3; // تقريباً كل تبرع ينقذ 3 أرواح

  // فصيلة دم المتبرع
  const donorBloodTypeId =
    currentDonor?.bloodTypeId ||
    (currentDonor as any)?.bloodTypeID ||
    (currentDonor as any)?.BloodTypeID ||
    undefined;

  const donorBloodType =
    (typeof currentDonor?.bloodType === 'string' ? currentDonor.bloodType : currentDonor?.bloodType?.typeName) ||
    (currentDonor as any)?.bloodTypeName ||
    (donorBloodTypeId ? BLOOD_TYPE_MAP[donorBloodTypeId] : undefined) ||
    "غير محدد";

  // آخر تبرع
  const lastDonation = myDonations.length > 0
    ? myDonations.sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime())[0]
    : null;

  // تصفية الطلبات المتوافقة مع فصيلة دم المتبرع
  const urgentRequests = (urgentRequestsData?.data as BloodRequest[]) || [];

  const matchingRequests = urgentRequests.filter((request) => {
    if (!donorBloodTypeId) return true; // عرض الكل إذا لم نعرف الفصيلة

    const requestBloodTypeId = request.bloodTypeId || (request as any).bloodTypeID || (request as any).BloodTypeID;
    return canDonateToPatient(donorBloodTypeId, requestBloodTypeId);
  }).slice(0, 3);

  const isLoading = requestsLoading || donorByUserLoading || donationsLoading || responsesLoading;

  const getApprovalStatusBadge = (status?: number) => {
    switch (status) {
      case 1:
        return <Badge variant="outline" className="ml-2 border-gray-400 text-gray-500 bg-gray-50">في انتظار رفع المستندات</Badge>;
      case 2:
        return <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-600 bg-yellow-50">في انتظار الموافقة</Badge>;
      case 3:
        return <Badge variant="outline" className="ml-2 border-green-500 text-green-700 bg-green-50">مقبول</Badge>;
      case 4:
        return <Badge variant="outline" className="ml-2 border-red-500 text-red-700 bg-red-50">مرفوض</Badge>;
      case 5:
        return <Badge variant="outline" className="ml-2 border-orange-400 text-orange-600 bg-orange-50">مطلوب وثائق إضافية</Badge>;
      default:
        return <Badge variant="outline" className="ml-2 border-gray-300 text-gray-400 bg-white">غير معروف</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
              <Building2 className="h-3 w-3" />
              <span>مستشفى غريان التعليمي</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center">
              مرحباً، {apiUser?.fullName || "متبرع"}
              {currentDonor && getApprovalStatusBadge(currentDonor.approvalStatus)}
            </h1>
            <p className="text-muted-foreground">
              شكراً لك على مساهمتك في إنقاذ الأرواح
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <NotificationBell />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile">
                <Settings className="h-4 w-4 ml-2" />
                الإعدادات
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card variant="stat">
            <CardContent className="pt-6">
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">فصيلة الدم</p>
                    <p className="text-3xl font-bold text-primary">{donorBloodType}</p>
                  </div>
                  <Droplet className="h-10 w-10 text-primary/30" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="stat">
            <CardContent className="pt-6">
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">إجمالي التبرعات</p>
                    <p className="text-3xl font-bold text-foreground">{totalDonations}</p>
                  </div>
                  <Heart className="h-10 w-10 text-primary/30" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="stat">
            <CardContent className="pt-6">
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">أرواح تم إنقاذها</p>
                    <p className="text-3xl font-bold text-success">{livesImpacted}</p>
                  </div>
                  <User className="h-10 w-10 text-success/30" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="stat">
            <CardContent className="pt-6">
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">آخر تبرع</p>
                    <p className="text-lg font-bold text-foreground">
                      {lastDonation ? formatDate(lastDonation.donationDate) : "لا يوجد"}
                    </p>
                  </div>
                  <Calendar className="h-10 w-10 text-muted-foreground/30" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Matching Requests */}
          {/* Matching Requests & My Responses */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>طلبات مناسبة لك</CardTitle>
                  <CardDescription>طلبات دم في مستشفى غريان تتوافق مع فصيلة دمك {donorBloodType}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/blood-requests">
                    عرض الكل
                    <ChevronLeft className="h-4 w-4 mr-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : matchingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-success" />
                    <p>لا توجد طلبات عاجلة حالياً</p>
                    <p className="text-sm">سنبلغك عند وجود طلبات تتوافق مع فصيلة دمك</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matchingRequests.map((request) => {
                      const urgency = mapUrgencyLevel(request.urgencyLevel);
                      return (
                        <div
                          key={request.requestId}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Droplet className="h-10 w-10 text-primary fill-primary" />
                              <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-xs">
                                {BLOOD_TYPE_MAP[request.bloodTypeId]}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {request.patient?.fullName || `مريض #${request.patientId}`}
                              </p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  مستشفى غريان التعليمي
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(request.requestDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={
                              urgency === 'critical' ? 'destructive' :
                                urgency === 'urgent' ? 'default' : 'secondary'
                            }>
                              {request.urgencyLevel}
                            </Badge>
                            <Button size="sm" asChild>
                              <Link to="/blood-requests">استجب</Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Responses Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    استجاباتي للطلبات
                  </CardTitle>
                  <CardDescription>
                    طلبات الدم التي أبديت اهتمامك بها وحالة كل منها
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {responsesLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : myResponses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-3 opacity-30 text-primary" />
                    <p>لم تستجب لأي طلبات بعد</p>
                    <p className="text-sm">عندما تستجيب لطلب دم، ستظهر حالته هنا</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myResponses.map((response) => {
                      const dateString = response.responseDate || response.createdAt;
                      return (
                        <div
                          key={response.responseId}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-gray-100 hover:bg-secondary/40 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Droplet className="h-10 w-10 text-primary fill-primary" />
                              <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-xs">
                                {response.bloodTypeName}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {response.patientName ? `تبرع للمريض: ${response.patientName}` : `استجابة للطلب #${response.requestId}`}
                              </p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {formatDate(dateString)}
                                </span>
                                {response.notes && (
                                  <span className="truncate max-w-[200px]" title={response.notes}>
                                    ملاحظة: {response.notes}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge variant={ResponseStatusVariant[response.status] || 'default'}>
                              {ResponseStatusLabels[response.status] || 'غير معروف'}
                            </Badge>

                            {response.status === ResponseStatus.Interested && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                                onClick={() => handleCancelResponse(response.responseId)}
                                title="إلغاء الاستجابة"
                                disabled={cancelResponse.isPending}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Donations */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  سجل التبرعات
                </CardTitle>
              </CardHeader>
              <CardContent>
                {donationsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : myDonations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Droplet className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>لم تقم بأي تبرعات بعد</p>
                    <p className="text-sm">ابدأ رحلتك في إنقاذ الأرواح اليوم!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myDonations.slice(0, 5).map((donation) => (
                      <div key={donation.donationId} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                        {donation.testResult === 'Accepted' ? (
                          <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                        ) : donation.testResult === 'Rejected' ? (
                          <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            بنك الدم - مستشفى غريان
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              {formatDate(donation.donationDate)}
                            </p>
                            <Badge variant={
                              donation.testResult === 'Accepted' ? 'default' :
                                donation.testResult === 'Rejected' ? 'destructive' : 'secondary'
                            } className="text-xs">
                              {donation.testResult === 'Accepted' ? 'مقبول' :
                                donation.testResult === 'Rejected' ? 'مرفوض' : 'قيد الفحص'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/blood-requests">
                    عرض طلبات الدم
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Medical Documents */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  وثائقي الطبية
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">لا توجد وثائق طبية مرفوعة</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.documentId} className="flex flex-col gap-1 p-3 rounded-md bg-secondary/30">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate max-w-[150px]">{doc.documentType}</span>
                          <Badge variant={doc.isVerified ? "success" : "outline"} className="text-[10px] px-1 py-0 h-4">
                            {doc.isVerified ? "تم التحقق" : "قيد المراجعة"}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(doc.uploadedAt)}
                        </span>
                        {doc.notes && (
                          <span className="text-xs text-muted-foreground mt-1">
                            ملاحظة: {doc.notes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full mt-4 text-xs"
                  onClick={() => setIsDocsDialogOpen(true)}
                  disabled={!donorId}
                >
                  <FileText className="h-4 w-4 ml-2" />
                  {documents.length === 0 ? "رفع وثيقة طبية" : "إدارة الوثائق الطبية"}
                </Button>

                {/* Medical Documents Dialog */}
                <MedicalDocumentsDialog
                  donorId={donorId || null}
                  isOpen={isDocsDialogOpen}
                  onClose={() => setIsDocsDialogOpen(false)}
                  donorName={apiUser?.fullName || "المتبرع"}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DonorDashboard;
