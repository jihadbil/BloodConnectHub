import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, Building2, ArrowLeft } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Blood donation hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mr-auto text-right">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Heart className="h-4 w-4 animate-heartbeat" />
            <span>أنقذ حياة اليوم</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            قطرة دم منك
            <br />
            <span className="text-primary">حياة لغيرك</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            بنك الدم في مستشفى غريان المركزي يربط بين المتبرعين والمرضى المحتاجين لتسهيل الوصول السريع للمتبرعين المناسبين وإنقاذ الأرواح.
          </p>
          
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button size="xl" asChild className="group">
              <Link to="/register">
                سجل كمتبرع الآن
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Link>
            </Button>
            <Button variant="hero" size="xl" asChild>
              <Link to="/blood-requests">
                طلبات الدم العاجلة
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold text-primary-foreground">+5000</span>
              </div>
              <p className="text-primary-foreground/70 text-sm">متبرع مسجل</p>
            </div>
            <div className="text-center border-r border-l border-primary-foreground/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold text-primary-foreground">+1200</span>
              </div>
              <p className="text-primary-foreground/70 text-sm">عملية تبرع</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold text-primary-foreground">+50</span>
              </div>
              <p className="text-primary-foreground/70 text-sm">مستشفى شريك</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
