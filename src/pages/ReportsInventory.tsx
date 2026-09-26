import { useState } from 'react';
import {
    useInventoryAvailability,
    useExpiringBloodUnits,
    useExpiredBloodUnits,
    useConsumptionRate,
    useLowStockAlerts,
} from '@/hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
} from 'recharts';
import { Activity, AlertTriangle, Hourglass, Flame } from 'lucide-react';
import PrintButton from '@/components/reports/PrintButton';

interface DateFilter {
    startDate?: string;
    endDate?: string;
}

function SectionSkeleton() {
    return <Skeleton className="h-60 rounded-xl w-full" />;
}

function SeverityBadge({ severity }: { severity: string }) {
    if (severity === 'Critical')
        return <Badge className="bg-red-600 text-white">حرج</Badge>;
    if (severity === 'Warning')
        return <Badge className="bg-amber-500 text-white">تحذير</Badge>;
    return <Badge variant="secondary">{severity}</Badge>;
}

export default function ReportsInventory() {
    const [dateFilter, setDateFilter] = useState<DateFilter>({});
    const [threshold] = useState<number | undefined>(undefined);

    const { data: availData, isLoading: availLoading } = useInventoryAvailability();
    const { data: expiringData, isLoading: expiringLoading } = useExpiringBloodUnits();
    const { data: expiredData, isLoading: expiredLoading } = useExpiredBloodUnits(dateFilter);
    const { data: consumptionData, isLoading: consumptionLoading } = useConsumptionRate(dateFilter);
    const { data: alertsData, isLoading: alertsLoading } = useLowStockAlerts(threshold);

    const availability = availData?.data ?? [];
    const expiring = expiringData?.data ?? [];
    const expired = (expiredData?.data ?? []).filter((e) => e.bloodType !== 'Total');
    const consumption = consumptionData?.data ?? [];
    const alerts = alertsData?.data ?? [];

    const availChartData = availability.map((a) => ({
        bloodType: a.bloodType,
        متاح: a.quantityAvailable,
        محجوز: a.quantityReserved,
    }));

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto report-print-area" dir="rtl">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 report-print-title">
                        <Activity className="h-7 w-7 text-red-600" />
                        تقارير المخزون
                    </h1>
                    <p className="text-muted-foreground mt-1">إدارة وتحليل مخزون الدم</p>
                </div>
                <PrintButton reportTitle="تقارير المخزون - بنك الدم" />
            </div>

            {/* Date filter */}
            <Card className="border-dashed no-print">
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs text-muted-foreground">من تاريخ</Label>
                            <Input
                                type="date"
                                className="w-40"
                                value={dateFilter.startDate ?? ''}
                                onChange={(e) => setDateFilter((f) => ({ ...f, startDate: e.target.value || undefined }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs text-muted-foreground">إلى تاريخ</Label>
                            <Input
                                type="date"
                                className="w-40"
                                value={dateFilter.endDate ?? ''}
                                onChange={(e) => setDateFilter((f) => ({ ...f, endDate: e.target.value || undefined }))}
                            />
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setDateFilter({})}>إعادة تعيين</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            {!alertsLoading && alerts.length > 0 && (
                <div className="space-y-2">
                    <h2 className="font-semibold flex items-center gap-2 text-red-700">
                        <AlertTriangle className="h-5 w-5" />
                        تنبيهات المخزون المنخفض
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {alerts.map((a) => (
                            <Alert
                                key={a.bloodType}
                                className={a.severity === 'Critical' ? 'border-red-400 bg-red-50' : 'border-amber-400 bg-amber-50'}
                            >
                                <AlertDescription className="flex items-center justify-between">
                                    <span className="font-bold">{a.bloodType}</span>
                                    <SeverityBadge severity={a.severity} />
                                    <span className="text-sm">{a.currentQuantity} / {a.threshold}</span>
                                </AlertDescription>
                            </Alert>
                        ))}
                    </div>
                </div>
            )}

            {/* Availability — Stacked Bar */}
            <Card className="shadow-md border-0">
                <CardHeader>
                    <CardTitle className="text-base">التوافر حسب فصيلة الدم</CardTitle>
                </CardHeader>
                <CardContent>
                    {availLoading ? (
                        <SectionSkeleton />
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={availChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="bloodType" tick={{ fontSize: 13 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ direction: 'rtl', borderRadius: 8 }} />
                                <Legend />
                                <Bar dataKey="متاح" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="محجوز" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expiring Units */}
                <Card className="shadow-md border-0">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Hourglass className="h-4 w-4 text-amber-500" />
                            الوحدات المنتهية صلاحيتها قريباً
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {expiringLoading ? (
                            <SectionSkeleton />
                        ) : expiring.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">لا توجد وحدات منتهية قريباً</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-right p-2 font-semibold">فصيلة الدم</th>
                                            <th className="text-right p-2 font-semibold">الوحدات</th>
                                            <th className="text-right p-2 font-semibold">تاريخ الانتهاء</th>
                                            <th className="text-right p-2 font-semibold">الأيام المتبقية</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expiring.map((e, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                <td className="p-2">
                                                    <Badge className="bg-red-600 text-white">{e.bloodType}</Badge>
                                                </td>
                                                <td className="p-2 font-mono">{e.unitCount}</td>
                                                <td className="p-2 text-muted-foreground text-xs">
                                                    {new Date(e.expiryDate).toLocaleDateString('ar-EG')}
                                                </td>
                                                <td className="p-2">
                                                    <Badge
                                                        className={
                                                            e.daysUntilExpiry <= 3
                                                                ? 'bg-red-500 text-white'
                                                                : e.daysUntilExpiry <= 7
                                                                    ? 'bg-amber-500 text-white'
                                                                    : 'bg-gray-200 text-gray-800'
                                                        }
                                                    >
                                                        {e.daysUntilExpiry} يوم
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Expired Units */}
                <Card className="shadow-md border-0">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Flame className="h-4 w-4 text-red-500" />
                            الوحدات المنتهية الصلاحية (الهدر)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {expiredLoading ? (
                            <SectionSkeleton />
                        ) : expired.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">لا توجد وحدات منتهية في هذه الفترة</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-right p-2 font-semibold">فصيلة الدم</th>
                                            <th className="text-right p-2 font-semibold">الوحدات</th>
                                            <th className="text-right p-2 font-semibold">الكمية المهدرة (وحدة)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expired.map((e, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                <td className="p-2">
                                                    <Badge className="bg-red-600 text-white">{e.bloodType}</Badge>
                                                </td>
                                                <td className="p-2 font-mono">{e.expiredUnitCount}</td>
                                                <td className="p-2 text-red-600 font-mono">
                                                    {e.totalQuantityWasted.toLocaleString('ar-EG')} وحدة
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Consumption Rate */}
            <Card className="shadow-md border-0">
                <CardHeader>
                    <CardTitle className="text-base">معدل الاستهلاك والأيام المتبقية لنفاد المخزون</CardTitle>
                </CardHeader>
                <CardContent>
                    {consumptionLoading ? (
                        <SectionSkeleton />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-right p-3 font-semibold">فصيلة الدم</th>
                                        <th className="text-right p-3 font-semibold">المستهلك الكلي (وحدة)</th>
                                        <th className="text-right p-3 font-semibold">متوسط يومي (وحدة)</th>
                                        <th className="text-right p-3 font-semibold">المخزون الحالي</th>
                                        <th className="text-right p-3 font-semibold">أيام حتى النفاد</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consumption.map((c) => (
                                        <tr key={c.bloodType} className="border-b hover:bg-gray-50">
                                            <td className="p-3">
                                                <Badge className="bg-red-600 text-white">{c.bloodType}</Badge>
                                            </td>
                                            <td className="p-3 font-mono">{c.totalConsumed.toLocaleString('ar-EG')}</td>
                                            <td className="p-3 font-mono">{c.averageDailyConsumption.toFixed(1)}</td>
                                            <td className="p-3 font-mono">{c.currentInventory.toLocaleString('ar-EG')}</td>
                                            <td className="p-3">
                                                <Badge
                                                    className={
                                                        c.projectedDaysUntilStockout <= 7
                                                            ? 'bg-red-500 text-white'
                                                            : c.projectedDaysUntilStockout <= 30
                                                                ? 'bg-amber-500 text-white'
                                                                : 'bg-emerald-500 text-white'
                                                    }
                                                >
                                                    {c.projectedDaysUntilStockout === 0
                                                        ? 'نفد'
                                                        : `${c.projectedDaysUntilStockout} يوم`}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
