import { Card, CardContent } from "@/components/ui/card";
import { Droplet } from "lucide-react";

const bloodTypes = [
  { type: "A+", canDonateTo: "A+, AB+", canReceiveFrom: "A+, A-, O+, O-", urgency: "normal" },
  { type: "A-", canDonateTo: "A+, A-, AB+, AB-", canReceiveFrom: "A-, O-", urgency: "high" },
  { type: "B+", canDonateTo: "B+, AB+", canReceiveFrom: "B+, B-, O+, O-", urgency: "normal" },
  { type: "B-", canDonateTo: "B+, B-, AB+, AB-", canReceiveFrom: "B-, O-", urgency: "high" },
  { type: "AB+", canDonateTo: "AB+", canReceiveFrom: "جميع الفصائل", urgency: "low" },
  { type: "AB-", canDonateTo: "AB+, AB-", canReceiveFrom: "A-, B-, AB-, O-", urgency: "high" },
  { type: "O+", canDonateTo: "A+, B+, AB+, O+", canReceiveFrom: "O+, O-", urgency: "normal" },
  { type: "O-", canDonateTo: "جميع الفصائل", canReceiveFrom: "O-", urgency: "critical" },
];

const urgencyColors = {
  low: "text-success",
  normal: "text-foreground",
  high: "text-warning",
  critical: "text-destructive",
};

const BloodTypesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            فصائل <span className="text-primary">الدم</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            تعرف على فصائل الدم المختلفة وتوافقها في عملية التبرع
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bloodTypes.map((blood, index) => (
            <Card
              key={blood.type}
              variant="elevated"
              className="text-center animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="pt-6">
                <div className="relative inline-flex items-center justify-center mb-4">
                  <Droplet className={`h-16 w-16 ${urgencyColors[blood.urgency as keyof typeof urgencyColors]} fill-current`} />
                  <span className="absolute text-primary-foreground font-bold text-sm">
                    {blood.type}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">يتبرع لـ: </span>
                    <span className="font-medium text-foreground">{blood.canDonateTo}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">يستقبل من: </span>
                    <span className="font-medium text-foreground">{blood.canReceiveFrom}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-destructive" />
              حاجة حرجة
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning" />
              حاجة عالية
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-foreground" />
              عادي
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success" />
              متوفر
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BloodTypesSection;
