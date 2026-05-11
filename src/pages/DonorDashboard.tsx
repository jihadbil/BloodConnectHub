import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
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
  XCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUrgentBloodRequests } from "@/hooks/useBloodRequests";
import { useDonors } from "@/hooks/useDonors";
import { useDonations } from "@/hooks/useDonations";
import { formatDate, mapUrgencyLevel } from "@/lib/utils";
import { BLOOD_TYPE_MAP } from "@/types/api";
import type { ApiUser, BloodRequest } from "@/types/api";

const DonorDashboard = () => {
  const { user } = useAuth();
  const apiUser = user as ApiUser | null;

  // جلب الطلبات العاجلة
  const { data: urgentRequestsData, isLoading: requestsLoading } = useUrgentBloodRequests();

  // جلب بيانات المتبرع (نحتاج للبحث بناءً على المستخدم الحالي)
  const { data: donorsData, isLoading: donorsLoading } = useDonors(1, 100);

  // جلب التبرعات
  const { data: donationsData, isLoading: donationsLoading } = useDonations(1, 10);

  // البحث عن المتبرع الحالي من قائمة المتبرعين
  const currentDonor = donorsData?.data?.items?.find(
    (donor) => donor.fullName === apiUser?.fullName || donor.phone === apiUser?.phone
  );

  // دالة تحويل testResult من رقم إلى نص
  const normalizeTestResult = (result: string | number | undefined | null): string => {
    const numericMap: Record<number, string> = { 0: 'Pending', 1: 'Approved', 2: 'Rejected' };
    if (result === null || result === undefined) return 'Pending';
    if (typeof result === 'number') return numericMap[result] || 'Pending';
    return result;
  };

  // تبرعات المتبرع الحالي
  const myDonations = (donationsData?.data?.items || [])
    .filter((donation) => donation.donorId === currentDonor?.donorId)
    .map(d => ({ ...d, testResult: normalizeTestResult(d.testResult) }));

  // حساب الإحصائيات
  const totalDonations = myDonations.length;
  const approvedDonations = myDonations.filter(d => d.testResult === 'Approved').length;
  const livesImpacted = approvedDonations * 3; // تقريباً كل تبرع ينقذ 3 أرواح

  // فصيلة دم المتبرع
  const donorBloodType = currentDonor?.bloodType?.typeName ||
    BLOOD_TYPE_MAP[currentDonor?.bloodTypeId || 1] || "غير محدد";

  // آخر تبرع
  const lastDonation = myDonations.length > 0
    ? myDonations.sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime())[0]
    : null;

  // تصفية الطلبات المتوافقة مع فصيلة دم المتبرع
  const urgentRequests = (urgentRequestsData?.data as BloodRequest[]) || [];

  const matchingRequests = urgentRequests.filter((request) => {
    if (!currentDonor?.bloodTypeId) return true; // عرض الكل إذا لم نعرف الفصيلة

    // استخدام منطق التوافق الصحيح
    // المتبرع يمكنه التبرع للمريض إذا كانت فصيلته متوافقة
    const compatibility: { [key: number]: number[] } = {
      1: [1, 2, 3, 4, 5, 6, 7, 8], // O- يعطي الجميع
      2: [2, 4, 6, 8],              // O+ يعطي الإيجابية
      3: [3, 4, 7, 8],              // A- يعطي A و AB
      4: [4, 8],                    // A+ يعطي A+ و AB+
      5: [5, 6, 7, 8],              // B- يعطي B و AB
      6: [6, 8],                    // B+ يعطي B+ و AB+
      7: [7, 8],                    // AB- يعطي AB فقط
      8: [8],                       // AB+ يعطي AB+ فقط
    };

    const canDonate = compatibility[currentDonor.bloodTypeId]?.includes(request.bloodTypeId);
    return canDonate || false;
  }).slice(0, 3);

  const isLoading = requestsLoading || donorsLoading || donationsLoading;

  return (
    <div className="min-h-screen bg-secondary/30" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
              <Building2 className="h-3 w-3" />
              <span>مستشفى غريان المركزي</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              مرحباً، {apiUser?.fullName || "متبرع"}
            </h1>
            <p className="text-muted-foreground">
              شكراً لك على مساهمتك في إنقاذ الأرواح
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 ml-2" />
              الإشعارات
            </Button>
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
          <div className="lg:col-span-2">
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
                                  مستشفى غريان المركزي
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
                        {donation.testResult === 'Approved' ? (
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
                              donation.testResult === 'Approved' ? 'default' :
                                donation.testResult === 'Rejected' ? 'destructive' : 'secondary'
                            } className="text-xs">
                              {donation.testResult === 'Approved' ? 'معتمد' :
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DonorDashboard;
