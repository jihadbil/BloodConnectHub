import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Phone, ArrowLeft, Clock, MapPin } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donor CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 text-primary-foreground">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary-foreground/5 rounded-full translate-x-1/4 translate-y-1/4" />
            
            <div className="relative z-10">
              <Heart className="h-12 w-12 mb-6 animate-heartbeat" />
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                كن بطلاً اليوم
              </h3>
              <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                سجّل الآن كمتبرع في بنك الدم بمستشفى غريان المركزي وكن جزءاً من مجتمع المنقذين للأرواح.
              </p>
              <Button variant="hero" size="lg" asChild className="group">
                <Link to="/register">
                  سجّل كمتبرع
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-foreground to-foreground/90 p-8 md:p-12 text-primary-foreground">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full -translate-x-1/4 translate-y-1/4" />
            
            <div className="relative z-10">
              <Phone className="h-12 w-12 mb-6 text-primary" />
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                تواصل معنا
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>مستشفى غريان المركزي، غريان، ليبيا</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <Phone className="h-4 w-4 text-primary" />
                  <span dir="ltr">+218 41 123 4567</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>متاحون 24 ساعة / 7 أيام</span>
                </div>
              </div>
              <Button size="lg" asChild className="group">
                <Link to="/contact">
                  تواصل الآن
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
