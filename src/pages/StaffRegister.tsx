import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, Lock, Phone, Loader2, AlertCircle, Mail, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi } from "@/api/auth";

export const translateApiError = (msg: string): string => {
  if (!msg) return msg;
  
  if (msg.includes(",")) {
    return msg
      .split(",")
      .map(part => translateApiError(part.trim()))
      .join(" • ");
  }

  const map: Record<string, string> = {
    'Username already exists':         'اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم آخر',
    'Username is already taken':       'اسم المستخدم مستخدم مسبقاً، يرجى اختيار اسم آخر',
    'Email already exists':            'البريد الإلكتروني مسجل مسبقاً',
    'DuplicateUserName':               'اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم آخر',
    'DuplicateEmail':                  'البريد الإلكتروني مسجل مسبقاً',
    'PasswordTooShort':                'كلمة المرور قصيرة جداً (يجب أن تكون 8 خانات على الأقل)',
    'PasswordRequiresDigit':           'كلمة المرور يجب أن تحتوي على أرقام',
    'PasswordRequiresUpper':           'كلمة المرور يجب أن تحتوي على حرف كبير',
    'InvalidEmail':                    'صيغة البريد الإلكتروني غير صحيحة',
  };
  const cleanMsg = msg.trim();
  if (map[cleanMsg]) return map[cleanMsg];

  if (
    cleanMsg.toLowerCase().includes("username already exists") ||
    cleanMsg.toLowerCase().includes("duplicateusername") ||
    cleanMsg.toLowerCase().includes("username is already taken") ||
    (cleanMsg.toLowerCase().includes("username") && cleanMsg.toLowerCase().includes("already taken"))
  ) {
    return 'اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم آخر';
  }
  if (
    cleanMsg.toLowerCase().includes("email already exists") ||
    cleanMsg.toLowerCase().includes("duplicateemail") ||
    (cleanMsg.toLowerCase().includes("email") && cleanMsg.toLowerCase().includes("already taken"))
  ) {
    return 'البريد الإلكتروني مسجل مسبقاً';
  }
  if (
    cleanMsg.toLowerCase().includes("passwordtooshort") ||
    cleanMsg.toLowerCase().includes("password must be at least") ||
    cleanMsg.toLowerCase().includes("passwords must be at least") ||
    cleanMsg.toLowerCase().includes("password should be at least") ||
    cleanMsg.toLowerCase().includes("password is too short")
  ) {
    return 'كلمة المرور قصيرة جداً (يجب أن تكون 8 خانات على الأقل)';
  }
  if (
    cleanMsg.toLowerCase().includes("passwordrequiresdigit") ||
    cleanMsg.toLowerCase().includes("password must have at least one digit") ||
    cleanMsg.toLowerCase().includes("password requires digit")
  ) {
    return 'كلمة المرور يجب أن تحتوي على أرقام';
  }
  if (
    cleanMsg.toLowerCase().includes("passwordrequiresupper") ||
    cleanMsg.toLowerCase().includes("password must have at least one uppercase") ||
    cleanMsg.toLowerCase().includes("password requires upper")
  ) {
    return 'كلمة المرور يجب أن تحتوي على حرف كبير';
  }
  
  return cleanMsg;
};

const StaffRegister = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (!formData.username || !formData.email || !formData.fullName || !formData.phone) {
            setError("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("كلمات المرور غير متطابقة");
            return;
        }

        if (formData.password.length < 8) {
            setError("كلمة المرور يجب أن تكون 8 خانات على الأقل");
            return;
        }

        if (!/^\d+$/.test(formData.password)) {
            setError("كلمة المرور يجب أن تحتوي على أرقام فقط");
            return;
        }

        setIsLoading(true);

        try {
            const response = await authApi.register({
                userName: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phoneNumber: formData.phone,
            });

            if (response.isSuccess) {
                setSuccess("تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                const combined = response.errors && response.errors.length > 0
                    ? response.errors.map(translateApiError).join(' • ')
                    : translateApiError(response.message || "حدث خطأ أثناء التسجيل");
                setError(combined);
            }
        } catch (err) {
            setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background" dir="rtl">
            <Header />
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto">
                    <Card className="border-primary/20 shadow-lg">
                        <CardHeader className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">تسجيل موظف جديد</CardTitle>
                                <CardDescription className="mt-2">
                                    مستشفى غريان التعليمي - بنك الدم
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {success && (
                                <Alert className="mb-4 border-green-500 bg-green-50 text-green-700">
                                    <AlertDescription>{success}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Username */}
                                <div className="space-y-2">
                                    <Label htmlFor="username">اسم المستخدم *</Label>
                                    <div className="relative">
                                        <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="username"
                                            placeholder="أدخل اسم المستخدم"
                                            className="pr-10"
                                            value={formData.username}
                                            onChange={(e) => handleChange("username", e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                                    <div className="relative">
                                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="أدخل البريد الإلكتروني"
                                            className="pr-10"
                                            dir="ltr"
                                            value={formData.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">الاسم الكامل *</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="أدخل الاسم الكامل"
                                        value={formData.fullName}
                                        onChange={(e) => handleChange("fullName", e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone">رقم الهاتف *</Label>
                                    <div className="relative">
                                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="09xxxxxxxx"
                                            className="pr-10"
                                            dir="ltr"
                                            value={formData.phone}
                                            onChange={(e) => handleChange("phone", e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">كلمة المرور *</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pr-10 pl-10"
                                            value={formData.password}
                                            onChange={(e) => handleChange("password", e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pr-10 pl-10"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                            disabled={isLoading}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                                    <p>هذا التسجيل مخصص لموظفي مستشفى غريان التعليمي فقط.</p>
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                            جاري إنشاء الحساب...
                                        </>
                                    ) : (
                                        "إنشاء حساب موظف"
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm text-muted-foreground">
                                <p>لديك حساب بالفعل؟{" "}
                                    <Link to="/login" className="text-primary hover:underline font-medium">
                                        تسجيل الدخول
                                    </Link>
                                </p>
                            </div>

                            <div className="mt-4 text-center text-sm text-muted-foreground">
                                <p>هل أنت متبرع؟{" "}
                                    <Link to="/register" className="text-primary hover:underline font-medium">
                                        سجل كمتبرع
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default StaffRegister;
