import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, Lock, Phone, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi } from "@/api/auth";

const StaffRegister = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        username: "",
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
        if (!formData.username || !formData.fullName || !formData.phone) {
            setError("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("كلمات المرور غير متطابقة");
            return;
        }

        if (formData.password.length < 6) {
            setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            return;
        }

        setIsLoading(true);

        try {
            const response = await authApi.register({
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName,
                phone: formData.phone,
                roleId: 2, // Staff role (1=Admin, 2=Staff, 3=Donor)
            });

            if (response.success) {
                setSuccess("تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.");
                setTimeout(() => {
                    navigate("/staff/login");
                }, 2000);
            } else {
                setError(response.message || response.errors?.join(', ') || "حدث خطأ أثناء التسجيل");
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
                                    مستشفى غريان المركزي - بنك الدم
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
                                            type="password"
                                            placeholder="••••••••"
                                            className="pr-10"
                                            value={formData.password}
                                            onChange={(e) => handleChange("password", e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pr-10"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                                    <p>هذا التسجيل مخصص لموظفي مستشفى غريان المركزي فقط.</p>
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
                                    <Link to="/staff/login" className="text-primary hover:underline font-medium">
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
