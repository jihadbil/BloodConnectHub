import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    User,
    Mail,
    Phone,
    Lock,
    Save,
    Loader2,
    ArrowRight,
    Shield,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChangePassword } from "@/hooks/useApiAuth";
import type { ApiUser } from "@/types/api";

const Profile = () => {
    const { user, userRole, signOut } = useAuth();
    const apiUser = user as ApiUser | null;
    const changePassword = useChangePassword();

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(false);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("كلمات المرور الجديدة غير متطابقة");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
            return;
        }

        changePassword.mutate(
            {
                userId: apiUser?.userId || 0,
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            },
            {
                onSuccess: () => {
                    setPasswordSuccess(true);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                },
                onError: (error) => {
                    setPasswordError(error.message || "فشل في تغيير كلمة المرور");
                },
            }
        );
    };

    const getRoleName = () => {
        switch (userRole) {
            case "admin": return "مدير النظام";
            case "staff": return "موظف";
            case "donor": return "متبرع";
            default: return "مستخدم";
        }
    };

    const getRoleColor = () => {
        switch (userRole) {
            case "admin": return "destructive";
            case "staff": return "default";
            case "donor": return "secondary";
            default: return "outline";
        }
    };

    return (
        <div className="min-h-screen bg-secondary/30" dir="rtl">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link to="/" className="hover:text-foreground">الرئيسية</Link>
                    <ArrowRight className="h-3 w-3 rotate-180" />
                    <span className="text-foreground">الملف الشخصي</span>
                </div>

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">الملف الشخصي</h1>

                    <div className="grid gap-6">
                        {/* User Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    معلومات الحساب
                                </CardTitle>
                                <CardDescription>معلومات حسابك الأساسية</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{apiUser?.fullName || "المستخدم"}</h3>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={getRoleColor() as "default" | "secondary" | "destructive" | "outline"}>
                                                <Shield className="h-3 w-3 ml-1" />
                                                {getRoleName()}
                                            </Badge>
                                            {apiUser?.isActive && (
                                                <Badge variant="outline" className="text-success border-success">
                                                    <CheckCircle className="h-3 w-3 ml-1" />
                                                    نشط
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">اسم المستخدم</Label>
                                        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{apiUser?.username || "-"}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">رقم الهاتف</Label>
                                        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span dir="ltr">{apiUser?.phone || "-"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">تاريخ الإنشاء</Label>
                                        <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                                            {apiUser?.createdAt
                                                ? new Date(apiUser.createdAt).toLocaleDateString('ar-SA', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                                : "-"
                                            }
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">رقم المستخدم</Label>
                                        <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                                            #{apiUser?.userId || "-"}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Change Password Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    تغيير كلمة المرور
                                </CardTitle>
                                <CardDescription>قم بتحديث كلمة المرور الخاصة بحسابك</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    {passwordError && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{passwordError}</AlertDescription>
                                        </Alert>
                                    )}

                                    {passwordSuccess && (
                                        <Alert className="border-success bg-success/10 text-success">
                                            <CheckCircle className="h-4 w-4" />
                                            <AlertDescription>تم تغيير كلمة المرور بنجاح</AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                                        <div className="relative">
                                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="currentPassword"
                                                type="password"
                                                placeholder="أدخل كلمة المرور الحالية"
                                                className="pr-10"
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                                            <div className="relative">
                                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    placeholder="أدخل كلمة المرور الجديدة"
                                                    className="pr-10"
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                                            <div className="relative">
                                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="أعد إدخال كلمة المرور"
                                                    className="pr-10"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={changePassword.isPending}>
                                        {changePassword.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                                جاري الحفظ...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 ml-2" />
                                                تغيير كلمة المرور
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Logout Section */}
                        <Card className="border-destructive/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-destructive">تسجيل الخروج</h3>
                                        <p className="text-sm text-muted-foreground">تسجيل الخروج من حسابك على هذا الجهاز</p>
                                    </div>
                                    <Button variant="destructive" onClick={() => signOut()}>
                                        تسجيل الخروج
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
