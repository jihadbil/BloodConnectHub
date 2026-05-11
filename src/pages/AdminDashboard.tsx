import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Building2,
  Droplet,
  Heart,
  TrendingUp,
  Shield,
  UserCheck,
  UserX,
  BarChart3,
  Activity,
  RefreshCw,
  AlertCircle,
  Package
} from "lucide-react";
import { useDonors } from "@/hooks/useDonors";
import { useBloodRequests, usePendingBloodRequests, useUrgentBloodRequests } from "@/hooks/useBloodRequests";
import { useDonations } from "@/hooks/useDonations";
import { useInventory, useLowStockInventory } from "@/hooks/useInventory";
import { usePatients } from "@/hooks/usePatients";
import { BLOOD_TYPE_MAP } from "@/types/api";
import { mapUrgencyLevel, formatDate, mapRequestStatus } from "@/lib/utils";

// Loading skeleton for stats
const StatsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} variant="stat">
        <CardContent className="pt-4 pb-4">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-8 rounded-full mx-auto" />
            <Skeleton className="h-6 w-16 mx-auto" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Loading skeleton for list
const ListSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);

const AdminDashboard = () => {
  // جلب البيانات من API
  const { data: donorsData, isLoading: donorsLoading, refetch: refetchDonors } = useDonors(1, 10);
  const { data: requestsData, isLoading: requestsLoading, refetch: refetchRequests } = useBloodRequests(1, 10);
  const { data: pendingData, isLoading: pendingLoading } = usePendingBloodRequests();
  const { data: urgentData } = useUrgentBloodRequests();
  const { data: donationsData, isLoading: donationsLoading } = useDonations(1, 10);
  const { data: inventoryData, isLoading: inventoryLoading } = useInventory();
  const { data: lowStockData } = useLowStockInventory();
  const { data: patientsData } = usePatients(1, 10);

  // الإحصائيات
  const stats = {
    totalDonors: donorsData?.data?.totalCount || 0,
    totalPatients: patientsData?.data?.totalCount || 0,
    totalRequests: requestsData?.data?.totalCount || 0,
    totalDonations: donationsData?.data?.totalCount || 0,
    activeRequests: pendingData?.data?.length || 0,
    lowStockItems: lowStockData?.data?.length || 0,
  };

  // تحويل بيانات المتبرعين
  const recentDonors = donorsData?.data?.items?.slice(0, 5).map(donor => ({
    id: donor.donorId,
    name: donor.fullName,
    type: "متبرع",
    bloodType: BLOOD_TYPE_MAP[donor.bloodTypeId],
    city: donor.city,
    status: donor.isActive ? "active" : "pending",
    joinDate: formatDate(donor.createdAt || new Date().toISOString())
  })) || [];

  // تحويل بيانات الطلبات
  const recentRequests = requestsData?.data?.items?.slice(0, 5).map(req => {
    const rawReq = req as any;
    // عدد الوحدات مع دعم أسماء حقول متعددة
    const quantity = req.quantityNeeded ?? rawReq.quantity ?? rawReq.unitsNeeded ?? 0;
    // فصيلة الدم - استخدام BLOOD_TYPE_MAP مباشرة لأن API يُرجع bloodTypeId
    const bloodType = BLOOD_TYPE_MAP[req.bloodTypeId] || req.bloodType?.typeName || rawReq.bloodTypeName || '-';
    // المريض
    const patient = req.patient?.fullName || rawReq.patientName || 'مريض';
    // حالة الطلب
    const rawStatus = req.status || rawReq.requestStatus || 'Pending';
    return {
      id: req.requestId,
      hospital: 'مستشفى غريان المركزي',
      bloodType,
      urgency: mapUrgencyLevel(req.urgencyLevel),
      status: rawStatus === 'Pending' ? 'open' : 'completed',
      rawStatus,
      patient,
      quantity,
    };
  }) || [];

  const urgencyConfig = {
    critical: { label: "حرج", variant: "destructive" as const, className: "border-red-500 text-red-700 bg-red-50" },
    urgent: { label: "عاجل", variant: "outline" as const, className: "border-orange-500 text-orange-600 bg-orange-50" },
    normal: { label: "عادي", variant: "secondary" as const, className: "" },
  };

  // حساب توزيع فصائل الدم من المخزون
  const bloodTypeDistribution = inventoryData?.data?.map(inv => {
    const total = inventoryData.data?.reduce((sum, i) => sum + i.quantityAvailable, 0) || 1;
    return {
      type: BLOOD_TYPE_MAP[inv.bloodTypeId],
      percentage: Math.round((inv.quantityAvailable / total) * 100),
      quantity: inv.quantityAvailable
    };
  }) || [];


  const isLoading = donorsLoading || requestsLoading || pendingLoading || donationsLoading;


  return (
    <div className="min-h-screen bg-secondary/30" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                لوحة تحكم المدير
              </h1>
              <p className="text-muted-foreground">
                إدارة شاملة للنظام - مستشفى غريان المركزي
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/staff-management">
                <Users className="h-4 w-4 ml-2" />
                إدارة الموظفين
              </Link>
            </Button>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockItems > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                تحذير: يوجد {stats.lowStockItems} فصائل دم بمخزون منخفض!
                {lowStockData?.data?.map(inv => ` (${BLOOD_TYPE_MAP[inv.bloodTypeId]}: ${inv.quantityAvailable} وحدة)`).join(', ')}
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link to="/staff/inventory">إدارة المخزون</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card variant="stat">
              <CardContent className="pt-4 pb-4">
                <div className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.totalDonors.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">متبرع</p>
                </div>
              </CardContent>
            </Card>

            <Card variant="stat">
              <CardContent className="pt-4 pb-4">
                <div className="text-center">
                  <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.totalPatients}</p>
                  <p className="text-xs text-muted-foreground">مريض</p>
                </div>
              </CardContent>
            </Card>

            <Card variant="stat">
              <CardContent className="pt-4 pb-4">
                <div className="text-center">
                  <Droplet className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.totalRequests.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">طلب</p>
                </div>
              </CardContent>
            </Card>

            <Card variant="stat">
              <CardContent className="pt-4 pb-4">
                <div className="text-center">
                  <Heart className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold text-success">{stats.totalDonations.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">تبرع</p>
                </div>
              </CardContent>
            </Card>

            <Card variant="stat">
              <CardContent className="pt-4 pb-4">
                <div className="text-center">
                  <Activity className="h-8 w-8 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold text-warning">{stats.activeRequests}</p>
                  <p className="text-xs text-muted-foreground">طلب نشط</p>
                </div>
              </CardContent>
            </Card>

            <Card variant="stat">
              <CardContent className="pt-4 pb-4">
                <div className="text-center">
                  <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className={`text-2xl font-bold ${stats.lowStockItems > 0 ? 'text-destructive' : 'text-foreground'}`}>
                    {stats.lowStockItems}
                  </p>
                  <p className="text-xs text-muted-foreground">مخزون منخفض</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              المتبرعين
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2">
              <Droplet className="h-4 w-4" />
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="statistics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              المخزون
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>أحدث المتبرعين</CardTitle>
                  <CardDescription>إدارة حسابات المتبرعين المسجلين</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetchDonors()}>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  تحديث
                </Button>
              </CardHeader>
              <CardContent>
                {donorsLoading ? (
                  <ListSkeleton />
                ) : recentDonors.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-lg font-medium">لا يوجد متبرعين</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentDonors.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{user.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{user.type}</Badge>
                              {user.bloodType && <Badge variant="secondary">{user.bloodType}</Badge>}
                              <span>{user.city}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "مفعّل" : "بانتظار التفعيل"}
                          </Badge>
                          {user.status === "pending" && (
                            <>
                              <Button size="sm" variant="default">
                                <UserCheck className="h-4 w-4 ml-1" />
                                تفعيل
                              </Button>
                              <Button size="sm" variant="outline">
                                <UserX className="h-4 w-4 ml-1" />
                                رفض
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost">
                            عرض
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link to="/staff/donors">عرض جميع المتبرعين</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>طلبات الدم الأخيرة</CardTitle>
                  <CardDescription>جميع طلبات الدم في النظام ({requestsData?.data?.totalCount || 0} طلب)</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetchRequests()}>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  تحديث
                </Button>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <ListSkeleton />
                ) : recentRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Droplet className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-lg font-medium">لا توجد طلبات</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentRequests.map((request) => {
                      const urgency = urgencyConfig[request.urgency as keyof typeof urgencyConfig];
                      const statusInfo = mapRequestStatus(request.rawStatus);
                      return (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Droplet className="h-10 w-10 text-primary fill-primary" />
                              <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-xs">
                                {request.bloodType}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{request.patient}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant={urgency.variant} className={urgency.className}>
                                  {urgency.label}
                                </Badge>
                                <span>{request.quantity > 0 ? `${request.quantity} وحدة` : '-'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={statusInfo.variant}>
                              {statusInfo.label}
                            </Badge>
                            <Button size="sm" variant="ghost">
                              عرض التفاصيل
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link to="/blood-requests">عرض جميع الطلبات</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>توزيع المخزون حسب فصيلة الدم</CardTitle>
                  <CardDescription>الكميات المتوفرة من كل فصيلة</CardDescription>
                </CardHeader>
                <CardContent>
                  {inventoryLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-full" />
                      ))}
                    </div>
                  ) : bloodTypeDistribution.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">لا توجد بيانات مخزون</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bloodTypeDistribution.map((blood) => (
                        <div key={blood.type} className="flex items-center gap-3">
                          <span className="w-10 font-bold text-primary">{blood.type}</span>
                          <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${blood.quantity < 5 ? 'bg-destructive' : 'bg-primary'}`}
                              style={{ width: `${Math.max(blood.percentage, 5)}%` }}
                            />
                          </div>
                          <span className="w-16 text-sm text-muted-foreground text-left">
                            {blood.quantity} وحدة
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ملخص سريع</CardTitle>
                  <CardDescription>نظرة عامة على النظام</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-muted-foreground">إجمالي المتبرعين</span>
                      <span className="font-bold text-lg">{stats.totalDonors}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-muted-foreground">إجمالي المرضى</span>
                      <span className="font-bold text-lg">{stats.totalPatients}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-muted-foreground">إجمالي التبرعات</span>
                      <span className="font-bold text-lg text-success">{stats.totalDonations}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-muted-foreground">طلبات معلقة</span>
                      <span className="font-bold text-lg text-warning">{stats.activeRequests}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-muted-foreground">طلبات عاجلة</span>
                      <span className={`font-bold text-lg ${(urgentData?.data?.length || 0) > 0 ? 'text-destructive' : 'text-foreground'}`}>
                        {urgentData?.data?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/staff/inventory">إدارة المخزون</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
