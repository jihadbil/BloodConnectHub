import { UserPlus, Search, HeartHandshake, Award } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "سجّل حسابك",
    description: "أنشئ حساباً جديداً وأدخل بياناتك الشخصية وفصيلة دمك",
  },
  {
    icon: Search,
    title: "تصفح الطلبات",
    description: "اطلع على طلبات الدم المتاحة والمناسبة لفصيلة دمك",
  },
  {
    icon: HeartHandshake,
    title: "استجب للطلب",
    description: "وافق على الطلب وتواصل مع المستشفى لإتمام التبرع",
  },
  {
    icon: Award,
    title: "أنقذ حياة",
    description: "تبرعك يساهم في إنقاذ حياة إنسان ويُسجل في سجلك",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            كيف <span className="text-primary">يعمل</span> الموقع؟
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            خطوات بسيطة تفصلك عن إنقاذ حياة إنسان
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-border -z-10">
                  <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-0 h-full bg-primary transition-all duration-500 group-hover:w-full" />
                </div>
              )}

              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-card shadow-card mb-6 group-hover:shadow-glow transition-all duration-300">
                <step.icon className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
