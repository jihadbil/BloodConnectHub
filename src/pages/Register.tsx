import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplet, User, Lock, Phone, ArrowLeft, Calendar, Heart, Loader2, AlertCircle, MapPin, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { donorsApi } from "@/api/donors";
import { BLOOD_TYPE_REVERSE_MAP } from "@/types/api";
import type { Gender } from "@/types/api";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
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
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.username || !formData.fullName || !formData.nationalId || !formData.gender || !formData.bloodType) {
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
      // Step 1: Register user account
      const { error: signUpError, data: userData } = await signUp(
        formData.username,
        formData.password,
        formData.fullName,
        formData.phone
      );

      if (signUpError) {
        if (signUpError.message.includes("already") || signUpError.message.includes("exists")) {
          setError("اسم المستخدم أو البريد مسجل مسبقاً");
        } else {
          setError(signUpError.message || "حدث خطأ أثناء التسجيل");
        }
        setIsLoading(false);
        return;
      }

      // Step 2: Create donor record using /api/Donors endpoint
      try {
        // Debug: Log the data being sent
        console.log("Form Data:", formData);
        console.log("User Data received from signUp:", userData);
        console.log("Blood Type ID:", BLOOD_TYPE_REVERSE_MAP[formData.bloodType]);
        
        // Extract userID from the response - API returns userID (capital I and D)
        const userID = (userData as any)?.userID || (userData as any)?.userId || null;
        console.log("Extracted userID:", userID);
        
        const donorPayload = {
          fullName: formData.fullName,
          nationalID: formData.nationalId,
          gender: formData.gender === "Male" ? 0 : 1, // 0=Male, 1=Female
          dateOfBirth: formData.dateOfBirth || new Date().toISOString().split('T')[0],
          phone: formData.phone,
          bloodTypeID: BLOOD_TYPE_REVERSE_MAP[formData.bloodType],
          city: formData.city,
          isActive: true,
          userID: userID, // ✅ إضافة معرف المستخدم (API returns userID not userId)
        };
        
        console.log("Donor Payload being sent:", JSON.stringify(donorPayload, null, 2));
        
        const donorResponse = await donorsApi.create(donorPayload);

        if (!donorResponse.success) {
          console.error("Failed to create donor record:", donorResponse.message);
          console.error("Full response:", donorResponse);
          // Continue anyway - user account is created
        } else {
          console.log("Donor created successfully:", donorResponse.data);
        }
      } catch (donorError) {
        console.error("Failed to create donor record:", donorError);
        // Continue anyway - user account is created
      }

      setSuccess("تم إنشاء حسابك بنجاح! جاري التوجيه...");

      // Navigate to donor dashboard
      setTimeout(() => {
        navigate("/donor/dashboard");
      }, 1500);
    } catch (err) {
      setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Droplet className="h-10 w-10 text-primary animate-heartbeat" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-foreground">
              مستشفى غريان <span className="text-primary">المركزي</span>
            </span>
            <span className="text-sm text-muted-foreground">بنك الدم</span>
          </div>
        </Link>

        <Card variant="elevated" className="animate-scale-in">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">تسجيل متبرع جديد</CardTitle>
            <CardDescription>
              سجل الآن وكن جزءاً من مجتمع المتبرعين في مستشفى غريان المركزي
            </CardDescription>
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

              {/* National ID */}
              <div className="space-y-2">
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

              <div className="grid grid-cols-2 gap-4">
                {/* Gender */}
                <div className="space-y-2">
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

                {/* Date of Birth */}
                <div className="space-y-2">
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

              <div className="grid grid-cols-2 gap-4">
                {/* Blood Type */}
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                    dir="ltr"
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
                    dir="ltr"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">شروط التبرع بالدم:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>العمر بين 18 و 65 سنة</li>
                  <li>الوزن لا يقل عن 50 كجم</li>
                  <li>عدم التبرع خلال آخر 3 أشهر</li>
                </ul>
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

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">لديك حساب بالفعل؟ </span>
              <Link to="/login" className="text-primary font-medium hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
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
