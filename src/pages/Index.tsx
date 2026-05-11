import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import BloodTypesSection from "@/components/home/BloodTypesSection";
import UrgentRequests from "@/components/home/UrgentRequests";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <UrgentRequests />
        <BloodTypesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
