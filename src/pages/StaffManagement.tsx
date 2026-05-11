import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Shield, Users, ArrowRight } from "lucide-react";

type AppRole = "admin" | "staff" | "donor";

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: AppRole;
  created_at: string;
}

const StaffManagement = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New user form state
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newRole, setNewRole] = useState<AppRole>("staff");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      // Fetch all user roles with their profiles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("id, user_id, role, created_at");

      if (rolesError) throw rolesError;

      // Fetch profiles for these users
      const userIds = rolesData?.map(r => r.user_id) || [];

      if (userIds.length === 0) {
        setUsers([]);
        return;
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const combinedUsers: UserWithRole[] = rolesData.map(role => {
        const profile = profilesData?.find(p => p.user_id === role.user_id);
        return {
          id: role.id,
          user_id: role.user_id,
          full_name: profile?.full_name || "غير معروف",
          email: "", // We can't access auth.users directly
          role: role.role as AppRole,
          created_at: role.created_at,
        };
      });

      setUsers(combinedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "خطأ",
        description: "فشل في جلب قائمة المستخدمين",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail || !newPassword || !newFullName) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsAddingUser(true);

    try {
      // Create new user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newEmail,
        password: newPassword,
        options: {
          data: {
            full_name: newFullName,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("فشل في إنشاء المستخدم");
      }

      // Update the user's role if it's not donor (default)
      if (newRole !== "donor") {
        const { error: roleError } = await supabase
          .from("user_roles")
          .update({ role: newRole })
          .eq("user_id", authData.user.id);

        if (roleError) throw roleError;
      }

      toast({
        title: "تم بنجاح",
        description: `تم إضافة ${newFullName} كـ ${getRoleLabel(newRole)}`,
      });

      // Reset form
      setNewEmail("");
      setNewPassword("");
      setNewFullName("");
      setNewRole("staff");
      setIsDialogOpen(false);

      // Refresh users list
      fetchUsers();
    } catch (error: unknown) {
      console.error("Error adding user:", error);
      const errorMessage = error instanceof Error ? error.message : "فشل في إضافة المستخدم";
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم تحديث صلاحيات المستخدم",
      });

      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الصلاحيات",
        variant: "destructive",
      });
    }
  };

  const getRoleLabel = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "مدير";
      case "staff":
        return "موظف";
      case "donor":
        return "متبرع";
      default:
        return role;
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "staff":
        return "default";
      case "donor":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30" dir="rtl">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">إدارة المستخدمين</h1>
            <p className="text-muted-foreground mt-1">
              إضافة موظفين جدد وتعديل صلاحياتهم
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة للوحة التحكم
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              تسجيل الخروج
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الموظفين</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === "staff").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المدراء</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === "admin").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>قائمة المستخدمين</CardTitle>
              <CardDescription>
                جميع المستخدمين المسجلين في النظام
              </CardDescription>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="ml-2 h-4 w-4" />
                  إضافة مستخدم
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader>
                  <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                  <DialogDescription>
                    أدخل بيانات المستخدم الجديد
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">الاسم الكامل</Label>
                      <Input
                        id="fullName"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        placeholder="أحمد محمد"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="example@hospital.ly"
                        required
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">كلمة المرور</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">الدور</Label>
                      <Select value={newRole} onValueChange={(value: AppRole) => setNewRole(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الدور" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="donor">متبرع</SelectItem>
                          <SelectItem value="staff">موظف</SelectItem>
                          <SelectItem value="admin">مدير</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isAddingUser}>
                      {isAddingUser ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري الإضافة...
                        </>
                      ) : (
                        "إضافة المستخدم"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا يوجد مستخدمين مسجلين
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">الدور الحالي</TableHead>
                    <TableHead className="text-right">تاريخ التسجيل</TableHead>
                    <TableHead className="text-right">تغيير الدور</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userItem) => (
                    <TableRow key={userItem.id}>
                      <TableCell className="font-medium">
                        {userItem.full_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(userItem.role)}>
                          {getRoleLabel(userItem.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(userItem.created_at).toLocaleDateString("ar-LY")}
                      </TableCell>
                      <TableCell>
                        {userItem.user_id !== user?.id ? (
                          <Select
                            value={userItem.role}
                            onValueChange={(value: AppRole) =>
                              handleRoleChange(userItem.user_id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="donor">متبرع</SelectItem>
                              <SelectItem value="staff">موظف</SelectItem>
                              <SelectItem value="admin">مدير</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            (أنت)
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default StaffManagement;
