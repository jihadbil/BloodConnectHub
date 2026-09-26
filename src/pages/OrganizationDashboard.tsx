import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Droplet, 
  Bell, 
  Plus,
  Building2, 
  MapPin, 
  Clock, 
  Users, 
  Settings,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  BarChart3
} from "lucide-react";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const OrganizationDashboard = () => {
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

  const organization = {
    name: "مستشفى الملك فهد",
    type: "مستشفى",
    city: "الرياض",
    activeRequests: 3,
    completedRequests: 45,
    totalDonors: 128,
  };

  const activeRequests = [
    { id: 1, bloodType: "O-", unitsNeeded: 3, urgency: "critical", responses: 2, timeAgo: "منذ ساعة" },
    { id: 2, bloodType: "A-", unitsNeeded: 2, urgency: "urgent", responses: 5, timeAgo: "منذ 3 ساعات" },
    { id: 3, bloodType: "B+", unitsNeeded: 4, urgency: "normal", responses: 3, timeAgo: "منذ 5 ساعات" },
  ];

  const urgencyConfig = {
    critical: { label: "طارئ", color: "bg-destructive text-destructive-foreground" },
    urgent: { label: "عاجل", color: "bg-warning text-warning-foreground" },
    normal: { label: "عادي", color: "bg-success text-success-foreground" },
  };

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
                {organization.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="secondary">{organization.type}</Badge>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {organization.city}
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
                <form className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>فصيلة الدم المطلوبة</Label>
                      <Select>
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
                    <div className="space-y-2">
                      <Label>عدد الوحدات</Label>
                      <Input type="number" min="1" placeholder="3" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>مستوى الاستعجال</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المستوى" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">طارئ - فوري</SelectItem>
                        <SelectItem value="urgent">عاجل</SelectItem>
                        <SelectItem value="normal">عادي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>وصف الحالة</Label>
                    <Textarea placeholder="اكتب وصفاً مختصراً للحالة..." />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      نشر الطلب
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsNewRequestOpen(false)}>
                      إلغاء
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card variant="stat">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">طلبات نشطة</p>
                  <p className="text-3xl font-bold text-primary">{organization.activeRequests}</p>
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
                  <p className="text-3xl font-bold text-success">{organization.completedRequests}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-success/30" />
              </div>
            </CardContent>
          </Card>

          <Card variant="stat">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">متبرعين استجابوا</p>
                  <p className="text-3xl font-bold text-foreground">{organization.totalDonors}</p>
                </div>
                <Users className="h-10 w-10 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>الطلبات النشطة</CardTitle>
              <CardDescription>إدارة طلبات الدم الحالية</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRequests.map((request) => {
                const urgency = urgencyConfig[request.urgency as keyof typeof urgencyConfig];
                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Droplet className="h-12 w-12 text-primary fill-primary" />
                        <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {request.bloodType}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-foreground">
                            {request.unitsNeeded} وحدات مطلوبة
                          </p>
                          <Badge className={urgency.color}>{urgency.label}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {request.responses} استجابة
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {request.timeAgo}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        عرض الاستجابات
                      </Button>
                      <Button variant="ghost" size="sm">
                        إغلاق الطلب
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default OrganizationDashboard;
