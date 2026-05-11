import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  Droplet,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Users,
  Heart,
  Package,
  FileText,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { ApiUser } from "@/types/api";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, isAuthenticated, signOut } = useAuth();
  const apiUser = user as ApiUser | null;

  const publicNavigation = [
    { name: "الرئيسية", href: "/" },
    { name: "طلبات الدم", href: "/blood-requests" },
    { name: "من نحن", href: "/about" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  const staffNavigation = [
    { name: "لوحة التحكم", href: "/staff/dashboard", icon: LayoutDashboard },
    { name: "المتبرعين", href: "/staff/donors", icon: Users },
    { name: "المرضى", href: "/staff/patients", icon: Users },
    { name: "التبرعات", href: "/staff/donations", icon: Heart },
    { name: "المخزون", href: "/staff/inventory", icon: Package },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (userRole === "admin") return "/admin/dashboard";
    if (userRole === "staff") return "/staff/dashboard";
    return "/donor/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Droplet className="h-8 w-8 text-primary animate-heartbeat" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-tight">
                مستشفى غريان <span className="text-primary">المركزي</span>
              </span>
              <span className="text-xs text-muted-foreground">بنك الدم</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {publicNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors relative group ${isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                />
              </Link>
            ))}

            {/* Staff Navigation Dropdown */}
            {isAuthenticated && (userRole === "staff" || userRole === "admin") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <FileText className="h-4 w-4" />
                    إدارة
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>صفحات الإدارة</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {staffNavigation.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link to={item.href} className="flex items-center gap-2 cursor-pointer">
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="max-w-[120px] truncate">{apiUser?.fullName || "المستخدم"}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{apiUser?.fullName}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {userRole === "admin" ? "مدير النظام" : userRole === "staff" ? "موظف" : "متبرع"}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      لوحة التحكم
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      الملف الشخصي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 ml-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">تسجيل الدخول</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">إنشاء حساب</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {publicNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                    }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Staff Navigation for Mobile */}
              {isAuthenticated && (userRole === "staff" || userRole === "admin") && (
                <>
                  <div className="border-t border-border my-2" />
                  <span className="px-4 text-xs text-muted-foreground font-medium">إدارة</span>
                  {staffNavigation.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary"
                        }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              <div className="border-t border-border mt-2 pt-4 flex flex-col gap-2 px-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{apiUser?.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {userRole === "admin" ? "مدير النظام" : userRole === "staff" ? "موظف" : "متبرع"}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4 ml-2" />
                        لوحة التحكم
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        <Settings className="h-4 w-4 ml-2" />
                        الملف الشخصي
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 ml-2" />
                      تسجيل الخروج
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/login">تسجيل الدخول</Link>
                    </Button>
                    <Button size="sm" asChild className="w-full">
                      <Link to="/register">إنشاء حساب</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
