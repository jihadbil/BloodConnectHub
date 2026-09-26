import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplet, User, Lock, Phone, ArrowLeft, Calendar, Heart, Loader2, AlertCircle, MapPin, CreditCard, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { donorsApi } from "@/api/donors";
import { BLOOD_TYPE_REVERSE_MAP } from "@/types/api";
import type { Gender } from "@/types/api";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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

const Register = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signUp, signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    nationalId: "",
    gender: "" as Gender | "",
    dateOfBirth: "",
    phone: "",
    bloodType: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    if (field === "nationalId") {
      const sanitized = value.replace(/\D/g, ""); // السماح بالأرقام فقط
      if (sanitized.length > 12) return; // لا أكثر من 12 خانة
      
      setFormData((prev) => ({ ...prev, [field]: sanitized }));
      
      if (sanitized.length > 0 && sanitized.length !== 12) {
        setError("الرقم الوطني يجب أن يتكون من 12 خانة بالضبط");
      } else {
        setError(null);
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.username || !formData.email || !formData.fullName || !formData.nationalId || !formData.gender || !formData.bloodType) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (formData.nationalId.length !== 12) {
      setError("الرقم الوطني يجب أن يتكون من 12 خانة بالضبط (لا أكثر ولا أقل)");
      return;
    }

    // التحقق من توافق الرقم الأول مع الجنس المختار (1 للذكر، 2 للأنثى)
    const firstDigit = formData.nationalId[0];
    if (firstDigit !== "1" && firstDigit !== "2") {
      setError("الرقم الوطني يجب أن يبدأ بالرقم 1 (للذكور) أو 2 (للإناث)");
      return;
    }
    if (formData.gender === "Male" && firstDigit !== "1") {
      setError("تضارب في البيانات: الرقم الوطني يبدأ بـ 2 (أنثى) ولكن الجنس المختار هو ذكر");
      return;
    }
    if (formData.gender === "Female" && firstDigit !== "2") {
      setError("تضارب في البيانات: الرقم الوطني يبدأ بـ 1 (ذكر) ولكن الجنس المختار هو أنثى");
      return;
    }

    // التحقق من توافق سنة الميلاد في الرقم الوطني مع تاريخ الميلاد المحدد
    if (formData.dateOfBirth) {
      const nationalIdYear = formData.nationalId.substring(1, 5);
      const dobYear = formData.dateOfBirth.split("-")[0];
      if (nationalIdYear !== dobYear) {
        setError(`تضارب في البيانات: سنة الميلاد في الرقم الوطني (${nationalIdYear}) لا تطابق سنة الميلاد في تاريخ الميلاد المحدد (${dobYear})`);
        return;
      }
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

    // Calculate age from date of birth
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 65) {
        setError("العمر يجب أن يكون بين 18 و 65 سنة");
        return;
      }
    }

    setIsLoading(true);

    try {
      // التحقق من أن الرقم الوطني غير مسجل مسبقاً
      try {
        const nationalIdCheck = await donorsApi.getByNationalId(formData.nationalId);
        if (nationalIdCheck.isSuccess && nationalIdCheck.data) {
          setError("الرقم الوطني مسجل مسبقاً لدى متبرع آخر");
          return;
        }
      } catch (checkError) {
        console.error("خطأ أثناء التحقق من الرقم الوطني:", checkError);
      }

      // Step 1: إنشاء الحساب
      const { error: signUpError, data: userData } = await signUp(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone
      );

      if (signUpError) {
        setError(translateApiError(signUpError.message) || "حدث خطأ أثناء التسجيل");
        return;
      }

      // Step 2: إنشاء سجل المتبرع
      try {
        const userID = (userData as any)?.id || null;

        const donorPayload = {
          fullName: formData.fullName,
          nationalID: formData.nationalId,
          gender: formData.gender === "Male" ? 1 : 2,
          dateOfBirth: formData.dateOfBirth || new Date().toISOString().split("T")[0],
          phone: formData.phone,
          bloodTypeID: BLOOD_TYPE_REVERSE_MAP[formData.bloodType],
          city: formData.city,
          isActive: true,
          userId: userID,
        };

        await donorsApi.create(donorPayload);
        
        // إبطال التخزين المؤقت لتحديث بيانات المتبرع فوراً
        queryClient.invalidateQueries({ queryKey: ['donors'] });
      } catch (err) {
        console.error("فشل إنشاء سجل المتبرع:", err);
      }

      setSuccess("تم إنشاء حسابك بنجاح! جاري التوجيه...");
      setTimeout(() => navigate("/donor/dashboard"), 1500);
    } catch (err) {
      setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-4 group">
          <Droplet className="h-8 w-8 text-primary animate-heartbeat" />
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">
              مستشفى غريان <span className="text-primary">التعليمي</span>
            </span>
            <span className="text-xs text-muted-foreground">بنك الدم</span>
          </div>
        </Link>

        <Card variant="elevated" className="animate-scale-in">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">تسجيل متبرع جديد</CardTitle>
            <CardDescription className="text-xs">
              سجل الآن وكن جزءاً من مجتمع المتبرعين في مستشفى غريان التعليمي
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-2 border-green-500 bg-green-50 text-green-700">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                {/* Username */}
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
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

                {/* National ID */}
                <div className="space-y-1.5">
                  <Label htmlFor="nationalId">الرقم الوطني *</Label>
                  <div className="relative">
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nationalId"
                      placeholder="أدخل الرقم الوطني"
                      className="pr-10"
                      value={formData.nationalId}
                      onChange={(e) => handleChange("nationalId", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
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

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth">تاريخ الميلاد</Label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      className="pr-10"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <Label>الجنس *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleChange("gender", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجنس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">ذكر</SelectItem>
                      <SelectItem value="Female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Blood Type */}
                <div className="space-y-1.5">
                  <Label>فصيلة الدم *</Label>
                  <Select
                    value={formData.bloodType}
                    onValueChange={(value) => handleChange("bloodType", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفصيلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="city">المدينة</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="city"
                      placeholder="المدينة"
                      className="pr-10"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password">كلمة المرور *</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10 pl-10"
                      dir="ltr"
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
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10 pl-10"
                      dir="ltr"
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
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5 text-xs text-muted-foreground text-center">
                <span className="font-medium text-foreground ml-2">شروط التبرع بالدم:</span>
                العمر 18 - 65 سنة • الوزن لا يقل عن 50 كجم • عدم التبرع خلال آخر 3 أشهر
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  "تسجيل كمتبرع"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">لديك حساب بالفعل؟ </span>
              <Link to="/login" className="text-primary font-medium hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 rotate-180" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
