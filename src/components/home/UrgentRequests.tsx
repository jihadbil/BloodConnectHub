import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Droplet, ArrowLeft, Building2 } from "lucide-react";

const urgentRequests = [
  {
    id: 1,
    bloodType: "O-",
    department: "قسم الطوارئ",
    unitsNeeded: 3,
    urgency: "حرج",
    timeAgo: "منذ 30 دقيقة",
  },
  {
    id: 2,
    bloodType: "AB-",
    department: "قسم الجراحة",
    unitsNeeded: 2,
    urgency: "عاجل",
    timeAgo: "منذ ساعة",
  },
  {
    id: 3,
    bloodType: "A-",
    department: "قسم العناية المركزة",
    unitsNeeded: 4,
    urgency: "عاجل",
    timeAgo: "منذ ساعتين",
  },
];

const UrgentRequests = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Building2 className="h-4 w-4" />
              <span>مستشفى غريان المركزي</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              طلبات <span className="text-primary">عاجلة</span>
            </h2>
            <p className="text-muted-foreground">
              هناك مرضى في مستشفى غريان بحاجة ماسة للدم الآن
            </p>
          </div>
          <Button variant="outline" asChild className="mt-4 md:mt-0">
            <Link to="/blood-requests">
              عرض جميع الطلبات
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {urgentRequests.map((request, index) => (
            <Card
              key={request.id}
              variant="urgent"
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
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
                  <Badge variant="destructive" className="animate-pulse">
                    {request.urgency}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-muted-foreground">الكمية المطلوبة:</span>
                  <span className="font-bold text-foreground">{request.unitsNeeded} وحدات</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-xs mb-4">
                  <Clock className="h-3 w-3" />
                  <span>{request.timeAgo}</span>
                </div>
                <Button variant="urgent" size="lg" className="w-full">
                  استجب للطلب
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UrgentRequests;
