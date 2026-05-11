import { useState } from 'react';
import {
    useDonorStatistics,
    useActiveVsInactiveDonors,
    useDonorsByCity,
    useEligibleDonorsByBloodType,
} from '@/hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { Users, AlertTriangle, ChevronRight, ChevronLeft } from 'lucide-react';
import PrintButton from '@/components/reports/PrintButton';

const BLOOD_COLORS = ['#dc2626', '#ef4444', '#f97316', '#fb923c', '#7c3aed', '#a855f7', '#0ea5e9', '#38bdf8'];

function SectionSkeleton() {
    return <Skeleton className="h-64 rounded-xl w-full" />;
}

export default function ReportsDonors() {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data: statsData, isLoading: statsLoading } = useDonorStatistics();
    const { data: activeData, isLoading: activeLoading } = useActiveVsInactiveDonors();
    const { data: cityData, isLoading: cityLoading } = useDonorsByCity(page, pageSize);
    const { data: eligibleData, isLoading: eligibleLoading } = useEligibleDonorsByBloodType();

    const stats = statsData?.data?.statistics ?? [];
    const active = activeData?.data;
    const cityResult = cityData?.data;
    const eligible = eligibleData?.data ?? [];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto report-print-area" dir="rtl">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 report-print-title">
                        <Users className="h-7 w-7 text-red-600" />
                        تقارير المتبرعين
                    </h1>
                    <p className="text-muted-foreground mt-1">تحليل شامل لبيانات المتبرعين</p>
                </div>
                <PrintButton reportTitle="تقارير المتبرعين - بنك الدم" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donors by Blood Type */}
                <Card className="shadow-md border-0">
                    <CardHeader>
                        <CardTitle className="text-base">توزيع المتبرعين حسب فصيلة الدم</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <SectionSkeleton />
                        ) : stats.length === 0 ? (
                            <Alert><AlertDescription>لا توجد بيانات</AlertDescription></Alert>
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={stats} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="bloodType" tick={{ fontSize: 13 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        formatter={(v: number) => [v.toLocaleString('ar-EG'), 'المتبرعون']}
                                        contentStyle={{ direction: 'rtl', borderRadius: 8 }}
                                    />
                                    <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} name="المتبرعون" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Active vs Inactive */}
                <Card className="shadow-md border-0">
                    <CardHeader>
                        <CardTitle className="text-base">المتبرعون النشطون مقابل غير النشطين</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeLoading ? (
                            <SectionSkeleton />
                        ) : !active ? (
                            <Alert><AlertDescription>لا توجد بيانات</AlertDescription></Alert>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'نشط', value: active.activeCount },
                                                { name: 'غير نشط', value: active.inactiveCount },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={90}
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                `${name}: ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            <Cell fill="#16a34a" />
                                            <Cell fill="#dc2626" />
                                        </Pie>
                                        <Legend />
                                        <Tooltip formatter={(v: number) => v.toLocaleString('ar-EG')} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex gap-6 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-emerald-600">{active.activeCount.toLocaleString('ar-EG')}</p>
                                        <p className="text-xs text-muted-foreground">نشط ({active.activePercentage.toFixed(1)}%)</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-red-600">{active.inactiveCount.toLocaleString('ar-EG')}</p>
                                        <p className="text-xs text-muted-foreground">غير نشط ({active.inactivePercentage.toFixed(1)}%)</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-700">{active.totalCount.toLocaleString('ar-EG')}</p>
                                        <p className="text-xs text-muted-foreground">الإجمالي</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Eligible Donors */}
            <Card className="shadow-md border-0">
                <CardHeader>
                    <CardTitle className="text-base">المتبرعون المؤهلون حسب فصيلة الدم</CardTitle>
                </CardHeader>
                <CardContent>
                    {eligibleLoading ? (
                        <SectionSkeleton />
                    ) : (
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={eligible} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="bloodType" tick={{ fontSize: 13 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(v: number) => [v.toLocaleString('ar-EG'), 'مؤهل']}
                                    contentStyle={{ direction: 'rtl', borderRadius: 8 }}
                                />
                                <Bar dataKey="eligibleCount" radius={[4, 4, 0, 0]} name="مؤهل">
                                    {eligible.map((_e, i) => (
                                        <Cell key={i} fill={BLOOD_COLORS[i % BLOOD_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Donors by City — paginated */}
            <Card className="shadow-md border-0">
                <CardHeader>
                    <CardTitle className="text-base">المتبرعون حسب المدينة</CardTitle>
                </CardHeader>
                <CardContent>
                    {cityLoading ? (
                        <SectionSkeleton />
                    ) : !cityResult ? (
                        <Alert><AlertDescription><AlertTriangle className="inline h-4 w-4 ml-1" />فشل التحميل</AlertDescription></Alert>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-right p-3 font-semibold">#</th>
                                            <th className="text-right p-3 font-semibold">المدينة</th>
                                            <th className="text-right p-3 font-semibold">عدد المتبرعين</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cityResult.items.map((row, idx) => (
                                            <tr key={row.city} className="border-b hover:bg-gray-50 transition-colors">
                                                <td className="p-3 text-muted-foreground">{(page - 1) * pageSize + idx + 1}</td>
                                                <td className="p-3 font-medium">{row.city}</td>
                                                <td className="p-3">
                                                    <Badge variant="secondary" className="font-mono">
                                                        {row.donorCount.toLocaleString('ar-EG')}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                                <span>
                                    صفحة {cityResult.pageNumber} من {cityResult.totalPages} — الإجمالي:{' '}
                                    {cityResult.totalCount.toLocaleString('ar-EG')}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={!cityResult.hasPrevious}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                        السابق
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={!cityResult.hasNext}
                                    >
                                        التالي
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
