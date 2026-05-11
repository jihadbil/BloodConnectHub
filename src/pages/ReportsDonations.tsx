import { useState } from 'react';
import {
    useDonationsByPeriod,
    useDonationsQuantity,
    useDonationTestResults,
    useDonationsByBloodType,
    useMostActiveDonors,
} from '@/hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Cell,
    PieChart,
    Pie,
    Legend,
} from 'recharts';
import { Droplets, Trophy, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { GroupBy } from '@/types/api';
import PrintButton from '@/components/reports/PrintButton';

const BLOOD_COLORS = ['#dc2626', '#ef4444', '#f97316', '#fb923c', '#7c3aed', '#a855f7', '#0ea5e9', '#38bdf8'];

interface DateFilter {
    startDate?: string;
    endDate?: string;
}

function SectionSkeleton() {
    return <Skeleton className="h-64 rounded-xl w-full" />;
}

export default function ReportsDonations() {
    const [dateFilter, setDateFilter] = useState<DateFilter>({});
    const [groupBy, setGroupBy] = useState<GroupBy>('month');
    const [limit, setLimit] = useState(10);

    const periodParams = { ...dateFilter, groupBy };
    const { data: periodData, isLoading: periodLoading } = useDonationsByPeriod(periodParams);
    const { data: quantityData, isLoading: quantityLoading } = useDonationsQuantity(dateFilter);
    const { data: testData, isLoading: testLoading } = useDonationTestResults(dateFilter);
    const { data: bloodTypeData, isLoading: bloodTypeLoading } = useDonationsByBloodType(dateFilter);
    const { data: topDonorData, isLoading: topDonorLoading } = useMostActiveDonors({ ...dateFilter, limit });

    const periods = periodData?.data ?? [];
    // filter out "Total" row from quantity
    const quantities = (quantityData?.data ?? []).filter((q) => q.bloodType !== 'Total');
    const tests = testData?.data;
    const byBloodType = bloodTypeData?.data ?? [];
    const topDonors = topDonorData?.data ?? [];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto report-print-area" dir="rtl">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 report-print-title">
                        <Droplets className="h-7 w-7 text-red-600" />
                        تقارير التبرعات
                    </h1>
                    <p className="text-muted-foreground mt-1">تحليل عمليات التبرع بالدم</p>
                </div>
                <PrintButton reportTitle="تقارير التبرعات - بنك الدم" />
            </div>

            {/* Date Filter Bar */}
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
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs text-muted-foreground">تجميع حسب</Label>
                            <Select value={groupBy} onValueChange={(v) => setGroupBy(v as GroupBy)}>
                                <SelectTrigger className="w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">يوم</SelectItem>
                                    <SelectItem value="week">أسبوع</SelectItem>
                                    <SelectItem value="month">شهر</SelectItem>
                                    <SelectItem value="year">سنة</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDateFilter({})}
                        >
                            إعادة تعيين
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Donations by Period — Line Chart */}
            <Card className="shadow-md border-0">
                <CardHeader>
                    <CardTitle className="text-base">التبرعات عبر الزمن</CardTitle>
                </CardHeader>
                <CardContent>
                    {periodLoading ? (
                        <SectionSkeleton />
                    ) : periods.length === 0 ? (
                        <p className="text-center text-muted-foreground py-12">لا توجد بيانات للفترة المحددة</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={periods} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(v: number) => [v.toLocaleString('ar-EG'), 'التبرعات']}
                                    contentStyle={{ direction: 'rtl', borderRadius: 8 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="donationCount"
                                    stroke="#dc2626"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    name="التبرعات"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quantity by Blood Type */}
                <Card className="shadow-md border-0">
                    <CardHeader>
                        <CardTitle className="text-base">الكميات حسب فصيلة الدم (مل)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {quantityLoading ? (
                            <SectionSkeleton />
                        ) : (
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={quantities} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="bloodType" tick={{ fontSize: 13 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        formatter={(v: number) => [`${v.toLocaleString('ar-EG')} مل`, 'الكمية']}
                                        contentStyle={{ direction: 'rtl', borderRadius: 8 }}
                                    />
                                    <Bar dataKey="totalQuantityML" radius={[4, 4, 0, 0]} name="الكمية (مل)">
                                        {quantities.map((_q, i) => (
                                            <Cell key={i} fill={BLOOD_COLORS[i % BLOOD_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Donations by Blood Type — Pie */}
                <Card className="shadow-md border-0">
                    <CardHeader>
                        <CardTitle className="text-base">التبرعات حسب فصيلة الدم</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {bloodTypeLoading ? (
                            <SectionSkeleton />
                        ) : (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={byBloodType}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        dataKey="donationCount"
                                        nameKey="bloodType"
                                        label={({ bloodType, percentage }) =>
                                            `${bloodType} ${percentage.toFixed(0)}%`
                                        }
                                    >
                                        {byBloodType.map((_e, i) => (
                                            <Cell key={i} fill={BLOOD_COLORS[i % BLOOD_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                    <Tooltip formatter={(v: number) => v.toLocaleString('ar-EG')} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Test Results */}
            {!testLoading && tests && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-md bg-emerald-50">
                        <CardContent className="p-5 flex items-center gap-4">
                            <CheckCircle className="h-8 w-8 text-emerald-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">مقبولة</p>
                                <p className="text-2xl font-bold text-emerald-700">{tests.acceptedCount.toLocaleString('ar-EG')}</p>
                                <p className="text-xs text-emerald-600">{tests.acceptanceRate.toFixed(1)}%</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md bg-red-50">
                        <CardContent className="p-5 flex items-center gap-4">
                            <XCircle className="h-8 w-8 text-red-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">مرفوضة</p>
                                <p className="text-2xl font-bold text-red-700">{tests.rejectedCount.toLocaleString('ar-EG')}</p>
                                <p className="text-xs text-red-600">{tests.rejectionRate.toFixed(1)}%</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md bg-amber-50">
                        <CardContent className="p-5 flex items-center gap-4">
                            <Clock className="h-8 w-8 text-amber-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">معلقة</p>
                                <p className="text-2xl font-bold text-amber-700">{tests.pendingCount.toLocaleString('ar-EG')}</p>
                                <p className="text-xs text-amber-600">من أصل {tests.totalCount.toLocaleString('ar-EG')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {testLoading && <SectionSkeleton />}

            {/* Most Active Donors */}
            <Card className="shadow-md border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        أكثر المتبرعين نشاطاً
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">عرض</Label>
                        <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 50].map((n) => (
                                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {topDonorLoading ? (
                        <SectionSkeleton />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-right p-3 font-semibold">#</th>
                                        <th className="text-right p-3 font-semibold">الاسم</th>
                                        <th className="text-right p-3 font-semibold">فصيلة الدم</th>
                                        <th className="text-right p-3 font-semibold">عدد التبرعات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topDonors.map((d, idx) => (
                                        <tr key={d.donorID} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="p-3">
                                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                                            </td>
                                            <td className="p-3 font-medium">{d.donorName}</td>
                                            <td className="p-3">
                                                <Badge className="bg-red-600 text-white">{d.bloodType}</Badge>
                                            </td>
                                            <td className="p-3">
                                                <Badge variant="secondary">{d.donationCount.toLocaleString('ar-EG')}</Badge>
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
