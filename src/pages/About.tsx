import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Heart, Target, Eye, Users, Building2, Award, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "الإنسانية",
      description: "نضع صحة المرضى وسلامتهم في مقدمة أولوياتنا"
    },
    {
      icon: Users,
      title: "التعاون",
      description: "نعمل معاً كفريق واحد لإنقاذ الأرواح"
    },
    {
      icon: Award,
      title: "الجودة",
      description: "نلتزم بأعلى معايير الجودة في جمع وحفظ الدم"
    }
  ];

  const stats = [
    { number: "+5000", label: "متبرع مسجل" },
    { number: "+1200", label: "عملية تبرع ناجحة" },
    { number: "+3000", label: "حياة تم إنقاذها" },
    { number: "24/7", label: "خدمة متواصلة" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building2 className="h-4 w-4" />
              <span>مستشفى غريان التعليمي</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              من نحن
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              بنك الدم في مستشفى غريان التعليمي - شريكك في إنقاذ الأرواح
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  عن بنك الدم
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  يعد بنك الدم في مستشفى غريان التعليمي من أهم الأقسام الحيوية في المستشفى، 
                  حيث يقدم خدماته على مدار الساعة لتوفير الدم الآمن للمرضى المحتاجين.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  نعمل على ربط المتبرعين بالمرضى المحتاجين للدم بطريقة سهلة وسريعة، 
                  مع الحفاظ على أعلى معايير السلامة والجودة في جميع مراحل العملية.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  هدفنا هو بناء مجتمع من المتبرعين المنتظمين لضمان توفر الدم 
                  في جميع الأوقات وخاصة في حالات الطوارئ.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="text-center p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                    <CardContent className="p-0">
                      <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-background border-primary/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">رؤيتنا</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  أن نكون المرجع الأول في مدينة غريان والمناطق المحيطة لخدمات نقل الدم، 
                  ونساهم في إنقاذ أكبر عدد ممكن من الأرواح من خلال توفير الدم الآمن في الوقت المناسب.
                </p>
              </Card>
              <Card className="p-8 bg-background border-primary/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">رسالتنا</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  تقديم خدمات نقل الدم بأعلى معايير الجودة والسلامة، وتسهيل عملية التبرع 
                  للمتبرعين، وضمان توفر الدم لجميع المرضى المحتاجين في مستشفى غريان التعليمي.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">قيمنا</h2>
              <p className="text-muted-foreground">المبادئ التي توجه عملنا اليومي</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow border-primary/10">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">موقعنا</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">العنوان</p>
                  <p className="text-muted-foreground text-sm">مستشفى غريان التعليمي، غريان، ليبيا</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">الهاتف</p>
                  <p className="text-muted-foreground text-sm" dir="ltr">+218 41 123 4567</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
