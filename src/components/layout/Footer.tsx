import { Link } from "react-router-dom";
import { Droplet, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "طلبات الدم", href: "/blood-requests" },
    { name: "من نحن", href: "/about" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  const donorLinks = [
    { name: "تسجيل كمتبرع", href: "/register" },
    { name: "سجل التبرعات", href: "/donor/history" },
    { name: "الأسئلة الشائعة", href: "/faq" },
  ];

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Droplet className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">
                  مستشفى غريان <span className="text-primary">المركزي</span>
                </span>
                <span className="text-xs text-primary-foreground/60">بنك الدم</span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              بنك الدم في مستشفى غريان المركزي - نربط بين المتبرعين والمرضى لإنقاذ الأرواح.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Donor Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">للمتبرعين</h4>
            <ul className="space-y-2">
              {donorLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4 text-primary" />
                <span dir="ltr">+218 41 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4 text-primary" />
                <span>bloodbank@gharyan-hospital.ly</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 text-primary" />
                <span>مستشفى غريان المركزي، غريان، ليبيا</span>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} مستشفى غريان المركزي - بنك الدم. جميع الحقوق محفوظة. مشروع جامعي.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
