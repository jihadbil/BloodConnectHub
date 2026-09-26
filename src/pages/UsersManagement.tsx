import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Users,
    Search,
    Shield,
    Trash2,
    Loader2,
    RefreshCw,
    AlertCircle,
    UserX,
    UserCheck,
    Plus,
    X
} from "lucide-react";
import { useUsers, useToggleUserActive, useDeleteUser, useAssignRole, useRemoveRole } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const availableRoles = ["Admin", "Donor"];

const UsersManagement = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");

    // جلب البيانات
    const { data, isLoading, error, refetch } = useUsers(page, 10, searchTerm);
    const toggleActive = useToggleUserActive();
    const deleteUser = useDeleteUser();
    const assignRole = useAssignRole();
    const removeRole = useRemoveRole();

    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [roleToAssign, setRoleToAssign] = useState("");

    const users = data?.data?.items || [];
    const totalPages = data?.data?.totalPages || 1;
    const totalCount = data?.data?.totalCount || 0;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchTerm(searchInput);
        setPage(1);
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        if (confirm(`هل أنت متأكد من ${currentStatus ? 'تعطيل' : 'تفعيل'} هذا الحساب؟`)) {
            try {
                await toggleActive.mutateAsync(id);
            } catch {
                toast({
                    title: 'خطأ',
                    description: 'حدث خطأ غير متوقع أثناء تحديث الحساب',
                    variant: 'destructive',
                });
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("هل أنت متأكد من حذف هذا المستخدم بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.")) {
            try {
                await deleteUser.mutateAsync(id);
            } catch {
                toast({
                    title: 'خطأ',
                    description: 'حدث خطأ غير متوقع أثناء الحذف',
                    variant: 'destructive',
                });
            }
        }
    };

    const handleAssignRole = async () => {
        if (selectedUserId && roleToAssign) {
            try {
                await assignRole.mutateAsync({ userId: selectedUserId, roleName: roleToAssign });
                setIsRoleDialogOpen(false);
                setRoleToAssign("");
                setSelectedUserId(null);
            } catch {
                toast({
                    title: 'خطأ في تعيين الدور',
                    description: 'حدث خطأ غير متوقع أثناء تعيين الدور',
                    variant: 'destructive',
                });
            }
        }
    };

    const handleRemoveRole = async (userId: string, roleName: string) => {
        if (confirm(`هل أنت متأكد من إزالة صلاحية ${roleName} من هذا المستخدم؟`)) {
            try {
                await removeRole.mutateAsync({ userId, roleName });
            } catch {
                toast({
                    title: 'خطأ في إزالة الدور',
                    description: 'حدث خطأ غير متوقع أثناء إزالة الدور',
                    variant: 'destructive',
                });
            }
        }
    };

    const openRoleDialog = (userId: string) => {
        setSelectedUserId(userId);
        setRoleToAssign("");
        setIsRoleDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-secondary/30" dir="rtl">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Users className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                إدارة المستخدمين
                            </h1>
                            <p className="text-muted-foreground">
                                التحكم في الحسابات والصلاحيات والأدوار
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>سجل المستخدمين</CardTitle>
                                <CardDescription>إجمالي المستخدمين: {totalCount}</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <form onSubmit={handleSearch} className="relative flex w-full sm:w-auto">
                                    <Input
                                        placeholder="بحث بالاسم أو البريد..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="pl-10 w-full sm:w-64"
                                    />
                                    <Button type="submit" variant="ghost" size="icon" className="absolute left-0 top-0 h-full">
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </form>
                                <Button variant="outline" size="icon" onClick={() => refetch()}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    فشل في تحميل البيانات.
                                </AlertDescription>
                            </Alert>
                        )}

                        {isLoading ? (
                            <div className="space-y-3">
                                {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14 w-full" />)}
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-lg font-medium">لا يوجد مستخدمين</h3>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>المستخدم</TableHead>
                                            <TableHead>الأدوار (الصلاحيات)</TableHead>
                                            <TableHead>حالة الحساب</TableHead>
                                            <TableHead>الإجراءات</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((u) => (
                                            <TableRow key={u.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{u.fullName}</p>
                                                        <p className="text-sm text-muted-foreground">{u.email}</p>
                                                        {u.phoneNumber && <p className="text-xs text-muted-foreground">{u.phoneNumber}</p>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1 items-center">
                                                        {u.roles?.length ? u.roles.map(r => (
                                                            <Badge key={r} variant={r === 'Admin' ? 'default' : r === 'BloodBankStaff' ? 'secondary' : 'outline'} className="flex items-center gap-1">
                                                                {r === 'Admin' && <Shield className="h-3 w-3 mr-1" />}
                                                                {r}
                                                                {user?.id !== u.id && (
                                                                    <X className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive transition-colors" onClick={() => handleRemoveRole(u.id, r)} />
                                                                )}
                                                            </Badge>
                                                        )) : (
                                                            <span className="text-xs text-muted-foreground">لا يوجد صلاحيات</span>
                                                        )}
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => openRoleDialog(u.id)} title="إضافة دور">
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={u.isActive ? "default" : "destructive"}>
                                                        {u.isActive ? "نشط" : "معطل"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        {user?.id !== u.id && (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title={u.isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
                                                                    onClick={() => handleToggleActive(u.id, u.isActive)}
                                                                >
                                                                    {u.isActive ? <UserX className="h-4 w-4 text-warning" /> : <UserCheck className="h-4 w-4 text-success" />}
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-destructive"
                                                                    title="حذف المستخدم"
                                                                    onClick={() => handleDelete(u.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    السابق
                                </Button>
                                <span className="text-sm text-muted-foreground px-4">
                                    صفحة {page} من {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    التالي
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                    <DialogContent className="max-w-md" dir="rtl">
                        <DialogHeader>
                            <DialogTitle>إضافة صلاحية للمستخدم</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <Select value={roleToAssign} onValueChange={setRoleToAssign}>
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر الدور" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableRoles.map(r => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex gap-3 pt-2">
                                <Button className="flex-1" onClick={handleAssignRole} disabled={!roleToAssign || assignRole.isPending}>
                                    {assignRole.isPending ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : null}
                                    تعيين الصلاحية
                                </Button>
                                <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>إلغاء</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div>
    );
};

export default UsersManagement;
