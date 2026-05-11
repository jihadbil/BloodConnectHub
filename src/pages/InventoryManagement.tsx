import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Droplet,
    Package,
    AlertCircle,
    RefreshCw,
    Loader2,
    Plus,
    Minus,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";
import { useInventory, useLowStockInventory, useUpdateInventoryQuantity } from "@/hooks/useInventory";
import { BLOOD_TYPE_MAP } from "@/types/api";

// Blood type card component
const BloodTypeCard = ({
    bloodType,
    quantity,
    isLowStock,
    onUpdate
}: {
    bloodType: string;
    quantity: number;
    isLowStock: boolean;
    onUpdate: (newQuantity: number) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newQuantity, setNewQuantity] = useState(quantity.toString());

    const handleSave = () => {
        const qty = parseInt(newQuantity);
        if (!isNaN(qty) && qty >= 0) {
            onUpdate(qty);
            setIsEditing(false);
        }
    };

    return (
        <Card
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${isLowStock ? 'border-destructive/50 bg-destructive/5' : 'hover:border-primary/50'
                }`}
        >
            {isLowStock && (
                <div className="absolute top-2 left-2">
                    <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
                </div>
            )}
            <CardContent className="pt-6 text-center">
                <div className="relative inline-block mb-4">
                    <Droplet
                        className={`h-20 w-20 ${isLowStock ? 'text-destructive' : 'text-primary'} fill-current`}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                        {bloodType}
                    </span>
                </div>

                {isEditing ? (
                    <div className="space-y-3">
                        <Input
                            type="number"
                            min="0"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(e.target.value)}
                            className="text-center text-xl font-bold"
                        />
                        <div className="flex gap-2">
                            <Button size="sm" className="flex-1" onClick={handleSave}>
                                حفظ
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                                إلغاء
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className={`text-4xl font-bold mb-2 ${isLowStock ? 'text-destructive' : 'text-foreground'}`}>
                            {quantity}
                        </p>
                        <p className="text-muted-foreground text-sm mb-4">وحدة</p>

                        <div className="flex gap-2 justify-center">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setNewQuantity((quantity + 1).toString());
                                    onUpdate(quantity + 1);
                                }}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsEditing(true)}
                            >
                                تعديل
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    if (quantity > 0) {
                                        setNewQuantity((quantity - 1).toString());
                                        onUpdate(quantity - 1);
                                    }
                                }}
                                disabled={quantity === 0}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                        </div>
                    </>
                )}

                {isLowStock && (
                    <Badge variant="destructive" className="mt-3">
                        مخزون منخفض
                    </Badge>
                )}
            </CardContent>
        </Card>
    );
};

// Loading skeleton
const InventorySkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
                <CardContent className="pt-6 text-center">
                    <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-12 mx-auto mb-4" />
                    <div className="flex gap-2 justify-center">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

const InventoryManagement = () => {
    // جلب البيانات
    const { data, isLoading, error, refetch } = useInventory();
    const { data: lowStockData } = useLowStockInventory();
    const updateQuantity = useUpdateInventoryQuantity();

    // تحويل البيانات
    const inventory = data?.data?.map(inv => {
        // Handle different possible field names from API
        const invAny = inv as any;
        const bloodTypeId = inv.bloodTypeId ?? invAny.BloodTypeID ?? invAny.bloodTypeID;
        const quantityAvailable = inv.quantityAvailable ?? invAny.QuantityAvailable ?? 0;

        return {
            bloodTypeId: bloodTypeId,
            bloodType: BLOOD_TYPE_MAP[bloodTypeId],
            quantity: quantityAvailable,
            isLowStock: quantityAvailable < 5
        };
    }) || [];

    // Debug: log inventory data to understand structure
    console.log('Inventory API Response:', data?.data);
    if (data?.data && data.data.length > 0) {
        console.log('First inventory item:', data.data[0]);
        console.log('Keys:', Object.keys(data.data[0]));
    }
    console.log('Processed inventory:', inventory);

    // حساب الإحصائيات
    const totalUnits = inventory.reduce((sum, inv) => sum + inv.quantity, 0);
    const lowStockCount = lowStockData?.data?.length || 0;
    const criticalCount = inventory.filter(inv => inv.quantity === 0).length;

    // معالجة تحديث الكمية
    const handleUpdateQuantity = async (bloodTypeId: number, quantityChange: number) => {
        console.log('handleUpdateQuantity called with:', { bloodTypeId, quantityChange });
        if (!bloodTypeId) {
            console.error('bloodTypeId is undefined!');
            return;
        }
        if (quantityChange === 0) {
            console.log('No change in quantity, skipping update');
            return;
        }
        await updateQuantity.mutateAsync({ bloodTypeId, quantity: quantityChange });
    };

    return (
        <div className="min-h-screen bg-secondary/30" dir="rtl">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Package className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                إدارة المخزون
                            </h1>
                            <p className="text-muted-foreground">
                                مراقبة وتحديث مخزون الدم لجميع الفصائل
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => refetch()} className="mt-4 md:mt-0">
                        <RefreshCw className="h-4 w-4 ml-2" />
                        تحديث
                    </Button>
                </div>

                {/* Alerts */}
                {lowStockCount > 0 && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>تحذير: مخزون منخفض</AlertTitle>
                        <AlertDescription>
                            يوجد {lowStockCount} فصائل دم بمخزون منخفض (أقل من 5 وحدات). يرجى التزويد في أقرب وقت.
                        </AlertDescription>
                    </Alert>
                )}

                {criticalCount > 0 && (
                    <Alert variant="destructive" className="mb-6 border-2 animate-pulse">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>تحذير حرج!</AlertTitle>
                        <AlertDescription>
                            يوجد {criticalCount} فصائل دم نفدت تماماً!
                        </AlertDescription>
                    </Alert>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">إجمالي المخزون</p>
                                    <p className="text-3xl font-bold text-primary">{totalUnits}</p>
                                </div>
                                <Package className="h-10 w-10 text-primary/30" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">فصائل الدم</p>
                                    <p className="text-3xl font-bold text-foreground">{inventory.length}</p>
                                </div>
                                <Droplet className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">مخزون منخفض</p>
                                    <p className={`text-3xl font-bold ${lowStockCount > 0 ? 'text-warning' : 'text-success'}`}>
                                        {lowStockCount}
                                    </p>
                                </div>
                                <AlertTriangle className={`h-10 w-10 ${lowStockCount > 0 ? 'text-warning/30' : 'text-success/30'}`} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="stat">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">نفد المخزون</p>
                                    <p className={`text-3xl font-bold ${criticalCount > 0 ? 'text-destructive' : 'text-success'}`}>
                                        {criticalCount}
                                    </p>
                                </div>
                                {criticalCount > 0 ? (
                                    <AlertCircle className="h-10 w-10 text-destructive/30" />
                                ) : (
                                    <CheckCircle2 className="h-10 w-10 text-success/30" />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Error State */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            فشل في تحميل بيانات المخزون.
                            <Button variant="link" onClick={() => refetch()}>إعادة المحاولة</Button>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Inventory Grid */}
                <Card>
                    <CardHeader>
                        <CardTitle>مخزون فصائل الدم</CardTitle>
                        <CardDescription>
                            انقر على "تعديل" لتغيير الكمية أو استخدم أزرار + و - للتعديل السريع
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <InventorySkeleton />
                        ) : inventory.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-lg font-medium">لا توجد بيانات مخزون</h3>
                                <p className="text-muted-foreground">لم يتم تسجيل أي مخزون بعد</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {inventory.map((item) => (
                                    <BloodTypeCard
                                        key={item.bloodTypeId}
                                        bloodType={item.bloodType}
                                        quantity={item.quantity}
                                        isLowStock={item.isLowStock}
                                        onUpdate={(newQuantity) => {
                                            const change = newQuantity - item.quantity;
                                            handleUpdateQuantity(item.bloodTypeId, change);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Legend */}
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary" />
                        مخزون طبيعي (≥5 وحدات)
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-warning" />
                        مخزون منخفض (1-4 وحدات)
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-destructive" />
                        نفد المخزون (0 وحدة)
                    </span>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default InventoryManagement;
