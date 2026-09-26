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
    AlertCircle,
    Eye,
    EyeOff
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChangePassword } from "@/hooks/useApiAuth";
import { useDonorByUserId } from "@/hooks/useDonors";
import type { ApiUser } from "@/types/api";

const Profile = () => {
    const { user, userRole, signOut } = useAuth();
    const apiUser = user as ApiUser | null;
    const changePassword = useChangePassword();
    const { data: donorData } = useDonorByUserId(apiUser?.id || "");
    const currentDonor = donorData?.data;

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(false);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("كلمات المرور الجديدة غير متطابقة");
            return;
        }

        if (passwordForm.newPassword.length < 4) {
            setPasswordError("كلمة المرور الجديدة يجب أن تكون 4 خانات على الأقل");
            return;
        }

        if (!/^\d+$/.test(passwordForm.newPassword)) {
            setPasswordError("كلمة المرور الجديدة يجب أن تحتوي على أرقام فقط");
            return;
        }

        changePassword.mutate(
            {
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

    const getApprovalStatusBadge = (status?: number) => {
        switch (status) {
            case 1:
                return <Badge variant="outline" className="border-gray-400 text-gray-500 bg-gray-50">في انتظار رفع المستندات</Badge>;
            case 2:
                return <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50">في انتظار الموافقة</Badge>;
            case 3:
                return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">مقبول</Badge>;
            case 4:
                return <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">مرفوض</Badge>;
            case 5:
                return <Badge variant="outline" className="border-orange-400 text-orange-600 bg-orange-50">مطلوب وثائق إضافية</Badge>;
            default:
                return <Badge variant="outline" className="border-gray-300 text-gray-400 bg-white">غير معروف</Badge>;
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
                                            {apiUser?.roles && apiUser.roles.length > 0 ? (
                                                apiUser.roles.map((role) => (
                                                    <Badge key={role} variant={getRoleColor() as "default" | "secondary" | "destructive" | "outline"}>
                                                        <Shield className="h-3 w-3 ml-1" />
                                                        {role === 'Admin' ? 'مدير النظام' : role === 'BloodBankStaff' ? 'موظف بنك الدم' : role === 'Donor' ? 'متبرع' : role}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <Badge variant={getRoleColor() as "default" | "secondary" | "destructive" | "outline"}>
                                                    <Shield className="h-3 w-3 ml-1" />
                                                    {getRoleName()}
                                                </Badge>
                                            )}
                                            {userRole === 'donor' && currentDonor ? (
                                                getApprovalStatusBadge(currentDonor.approvalStatus)
                                            ) : (
                                                apiUser?.isActive && (
                                                    <Badge variant="outline" className="text-success border-success">
                                                        <CheckCircle className="h-3 w-3 ml-1" />
                                                        نشط
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">اسم المستخدم</Label>
                                        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{apiUser?.userName || "-"}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">البريد الإلكتروني</Label>
                                        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{apiUser?.email || "-"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">رقم الهاتف</Label>
                                        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span dir="ltr">{apiUser?.phoneNumber || "-"}</span>
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
                                        <div className="p-3 bg-secondary/50 rounded-lg text-sm truncate" title={apiUser?.id}>
                                            #{apiUser?.id || "-"}
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
                                                type={showCurrentPassword ? "text" : "password"}
                                                placeholder="أدخل كلمة المرور الحالية"
                                                className="pr-10 pl-10"
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                                            <div className="relative">
                                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="newPassword"
                                                    type={showNewPassword ? "text" : "password"}
                                                    placeholder="أدخل كلمة المرور الجديدة"
                                                    className="pr-10 pl-10"
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                                            <div className="relative">
                                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="أعد إدخال كلمة المرور"
                                                    className="pr-10 pl-10"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
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
