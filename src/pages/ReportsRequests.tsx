import { useState } from 'react';
import {
    useRequestsByStatus,
    useRequestsByUrgency,
    useFulfillmentRate,
    useRequestsByBloodType,
    useAvgFulfillmentTime,
    usePatientCount,
    usePatientsByBloodType,
    usePatientsWithActiveRequests,
} from '@/hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
    ClipboardList,
    CheckCircle,
    XCircle,
    Clock,
    Users,
    TrendingUp,
} from 'lucide-react';
import PrintButton from '@/components/reports/PrintButton';

interface DateFilter {
    startDate?: string;
    endDate?: string;
}

const URGENCY_COLOR: Record<string, string> = {
    Emergency: '#dc2626',
    Urgent: '#f97316',
    Normal: '#16a34a',
    'طارئ': '#dc2626',
    'عاجل': '#f97316',
    'عادي': '#16a34a',
};

const BLOOD_COLORS = ['#dc2626', '#ef4444', '#f97316', '#fb923c', '#7c3aed', '#a855f7', '#0ea5e9', '#38bdf8'];

function SectionSkeleton() {
    return <Skeleton className="h-60 rounded-xl w-full" />;
}

function DateFilterBar({
    filter,
    setFilter,
}: {
    filter: DateFilter;
    setFilter: (f: DateFilter) => void;
}) {
    return (
        <Card className="border-dashed no-print">
            <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs text-muted-foreground">من تاريخ</Label>
                        <Input
                            type="date"
                            className="w-40"
                            value={filter.startDate ?? ''}
                            onChange={(e) => setFilter({ ...filter, startDate: e.target.value || undefined })}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs text-muted-foreground">إلى تاريخ</Label>
                        <Input
                            type="date"
                            className="w-40"
                            value={filter.endDate ?? ''}
                            onChange={(e) => setFilter({ ...filter, endDate: e.target.value || undefined })}
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setFilter({})}>
                        إعادة تعيين
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ReportsRequests() {
    const [dateFilter, setDateFilter] = useState<DateFilter>({});

    // Requests
    const { data: statusData, isLoading: statusLoading } = useRequestsByStatus(dateFilter);
    const { data: urgencyData, isLoading: urgencyLoading } = useRequestsByUrgency(dateFilter);
    const { data: fulfillRateData, isLoading: fulfillRateLoading } = useFulfillmentRate(dateFilter);
    const { data: reqBloodTypeData, isLoading: reqBloodTypeLoading } = useRequestsByBloodType(dateFilter);
    const { data: avgTimeData, isLoading: avgTimeLoading } = useAvgFulfillmentTime(dateFilter);

    // Patients
    const { data: countData, isLoading: countLoading } = usePatientCount(dateFilter);
    const { data: pbtData, isLoading: pbtLoading } = usePatientsByBloodType();
    const { data: activeReqData, isLoading: activeReqLoading } = usePatientsWithActiveRequests();

    const URGENCY_MAP: Record<string, string> = {
        Normal: 'عادي',
        Urgent: 'عاجل',
        Emergency: 'طارئ',
    };

    const status = statusData?.data;
    const urgency = (urgencyData?.data ?? []).map(u => ({
        ...u,
        urgencyLevel: URGENCY_MAP[u.urgencyLevel] ?? u.urgencyLevel
    }));
    const fulfillRate = fulfillRateData?.data ?? [];
    const reqByBloodType = reqBloodTypeData?.data ?? [];
    const avgTime = (avgTimeData?.data ?? []).map(a => ({
        ...a,
        urgencyLevel: URGENCY_MAP[a.urgencyLevel] ?? a.urgencyLevel
    }));
    const patientCount = countData?.data;
    const patientsByBT = pbtData?.data ?? [];
    const activePatients = activeReqData?.data ?? [];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto report-print-area" dir="rtl">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 report-print-title">
                        <ClipboardList className="h-7 w-7 text-red-600" />
                        تقارير الطلبات والمرضى
                    </h1>
                    <p className="text-muted-foreground mt-1">تحليل طلبات الدم وبيانات المرضى</p>
                </div>
                <PrintButton reportTitle="تقارير الطلبات والمرضى - بنك الدم" />
            </div>

            <DateFilterBar filter={dateFilter} setFilter={setDateFilter} />

            <Tabs defaultValue="requests">
                <TabsList className="mb-4 no-print">
                    <TabsTrigger value="requests" className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        طلبات الدم
                    </TabsTrigger>
                    <TabsTrigger value="patients" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        المرضى
                    </TabsTrigger>
                </TabsList>

                {/* ═══════════ Requests Tab ═══════════ */}
                <TabsContent value="requests" className="space-y-6">
                    {/* Status Cards */}
                    {statusLoading ? (
                        <SectionSkeleton />
                    ) : status ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="border-0 shadow-md bg-amber-50">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <Clock className="h-8 w-8 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">معلقة</p>
                                        <p className="text-2xl font-bold text-amber-700">{status.pendingCount.toLocaleString('ar-EG')}</p>
                                        <p className="text-xs text-amber-600">من {status.totalCount.toLocaleString('ar-EG')} إجمالي</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-md bg-emerald-50">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">منجزة</p>
                                        <p className="text-2xl font-bold text-emerald-700">{status.fulfilledCount.toLocaleString('ar-EG')}</p>
                                        <p className="text-xs text-emerald-600">نسبة الإنجاز: {status.fulfillmentRate.toFixed(1)}%</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-md bg-red-50">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <XCircle className="h-8 w-8 text-red-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">ملغاة</p>
                                        <p className="text-2xl font-bold text-red-700">{status.cancelledCount.toLocaleString('ar-EG')}</p>
                                        <p className="text-xs text-red-600">نسبة الإلغاء: {status.cancellationRate.toFixed(1)}%</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* By Urgency */}
                        <Card className="shadow-md border-0">
                            <CardHeader>
                                <CardTitle className="text-base">الطلبات حسب مستوى الاستعجال</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {urgencyLoading ? (
                                    <SectionSkeleton />
                                ) : (
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={urgency} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="urgencyLevel" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                formatter={(v: number) => [v.toLocaleString('ar-EG'), 'الطلبات']}
                                                contentStyle={{ direction: 'rtl', borderRadius: 8 }}
                                            />
                                            <Bar dataKey="requestCount" radius={[4, 4, 0, 0]} name="الطلبات">
                                                {urgency.map((u, i) => (
                                                    <Cell key={i} fill={URGENCY_COLOR[u.urgencyLevel] ?? '#6b7280'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* By Blood Type */}
                        <Card className="shadow-md border-0">
                            <CardHeader>
                                <CardTitle className="text-base">الطلبات حسب فصيلة الدم</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {reqBloodTypeLoading ? (
                                    <SectionSkeleton />
                                ) : (
                                    <ResponsiveContainer width="100%" height={350}>
                                        <PieChart>
                                            <Pie
                                                data={reqByBloodType}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={90}
                                                dataKey="requestCount"
                                                nameKey="bloodType"
                                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percentage, bloodType }) => {
                                                    const RADIAN = Math.PI / 180;
                                                    const radius = outerRadius + 22;
                                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                                    const textAnchor = x > cx ? 'start' : 'end';
                                                    return (
                                                        <text
                                                            x={x}
                                                            y={y}
                                                            fill="currentColor"
                                                            className="text-xs font-semibold"
                                                            textAnchor={textAnchor}
                                                            dominantBaseline="central"
                                                        >
                                                            {`${bloodType} ${percentage.toFixed(0)}%`}
                                                        </text>
                                                    );
                                                }}
                                                labelLine={{ stroke: 'currentColor', strokeWidth: 1, opacity: 0.5 }}
                                            >
                                                {reqByBloodType.map((_e, i) => (
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

                    {/* Fulfillment Rate */}
                    <Card className="shadow-md border-0">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                                معدل الإنجاز حسب فصيلة الدم
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {fulfillRateLoading ? (
                                <SectionSkeleton />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-gray-50">
                                                <th className="text-right p-3">فصيلة الدم</th>
                                                <th className="text-right p-3">إجمالي الطلبات</th>
                                                <th className="text-right p-3">المنجزة</th>
                                                <th className="text-right p-3">معدل الإنجاز</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fulfillRate.map((r) => (
                                                <tr key={r.bloodType} className="border-b hover:bg-gray-50">
                                                    <td className="p-3">
                                                        <Badge className="bg-red-600 text-white">{r.bloodType}</Badge>
                                                    </td>
                                                    <td className="p-3 font-mono">{r.totalRequests}</td>
                                                    <td className="p-3 font-mono">{r.fulfilledRequests}</td>
                                                    <td className="p-3">
                                                        <Badge
                                                            className={
                                                                r.fulfillmentRate >= 80
                                                                    ? 'bg-emerald-500 text-white'
                                                                    : r.fulfillmentRate >= 50
                                                                        ? 'bg-amber-500 text-white'
                                                                        : 'bg-red-500 text-white'
                                                            }
                                                        >
                                                            {r.fulfillmentRate.toFixed(1)}%
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

                    {/* Avg Fulfillment Time */}
                    <Card className="shadow-md border-0">
                        <CardHeader>
                            <CardTitle className="text-base">متوسط وقت الإنجاز (بالساعات)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {avgTimeLoading ? (
                                <SectionSkeleton />
                            ) : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={avgTime} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="urgencyLevel" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            formatter={(v: number) => [`${v.toFixed(1)} ساعة`, 'متوسط الوقت']}
                                            contentStyle={{ direction: 'rtl', borderRadius: 8 }}
                                        />
                                        <Bar dataKey="averageHours" radius={[4, 4, 0, 0]} name="ساعة">
                                            {avgTime.map((a, i) => (
                                                <Cell key={i} fill={URGENCY_COLOR[a.urgencyLevel] ?? '#6b7280'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ═══════════ Patients Tab ═══════════ */}
                <TabsContent value="patients" className="space-y-6">
                    {/* Patient Count Card */}
                    {countLoading ? (
                        <SectionSkeleton />
                    ) : patientCount ? (
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-6 flex items-center gap-6">
                                <div className="p-4 rounded-full bg-purple-50">
                                    <Users className="h-8 w-8 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">إجمالي المرضى</p>
                                    <p className="text-4xl font-bold text-purple-700">
                                        {patientCount.totalCount.toLocaleString('ar-EG')}
                                    </p>
                                    {patientCount.trends && patientCount.trends.length > 0 && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            اتجاه: {patientCount.trends.map((t) => `${t.month}: ${t.count}`).join(' ← ')}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Patients by Blood Type */}
                        <Card className="shadow-md border-0">
                            <CardHeader>
                                <CardTitle className="text-base">المرضى حسب فصيلة الدم</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {pbtLoading ? (
                                    <SectionSkeleton />
                                ) : (
                                    <ResponsiveContainer width="100%" height={350}>
                                        <PieChart>
                                            <Pie
                                                data={patientsByBT}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={90}
                                                dataKey="patientCount"
                                                nameKey="bloodType"
                                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percentage, bloodType }) => {
                                                    const RADIAN = Math.PI / 180;
                                                    const radius = outerRadius + 30;
                                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                                    const textAnchor = x > cx ? 'start' : 'end';
                                                    return (
                                                        <text
                                                            x={x}
                                                            y={y}
                                                            fill="currentColor"
                                                            className="text-xs font-semibold"
                                                            textAnchor={textAnchor}
                                                            dominantBaseline="central"
                                                        >
                                                            {`${bloodType} ${percentage.toFixed(0)}%`}
                                                        </text>
                                                    );
                                                }}
                                                labelLine={{ stroke: 'currentColor', strokeWidth: 1, opacity: 0.5 }}
                                            >
                                                {patientsByBT.map((_e, i) => (
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

                        {/* Patients with Active Requests */}
                        <Card className="shadow-md border-0">
                            <CardHeader>
                                <CardTitle className="text-base">المرضى ذوو الطلبات النشطة</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {activeReqLoading ? (
                                    <SectionSkeleton />
                                ) : activePatients.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-10">لا يوجد مرضى بطلبات نشطة حالياً</p>
                                ) : (
                                    <div className="overflow-auto max-h-[350px]">
                                        <table className="w-full text-sm">
                                            <thead className="sticky top-0 bg-white">
                                                <tr className="border-b bg-gray-50">
                                                    <th className="text-right p-2">المريض</th>
                                                    <th className="text-right p-2">فصيلة الدم</th>
                                                    <th className="text-right p-2">الطلبات</th>
                                                    <th className="text-right p-2">أعلى استعجال</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activePatients.map((p) => (
                                                    <tr key={p.patientID} className="border-b hover:bg-gray-50">
                                                        <td className="p-2 font-medium">{p.patientName}</td>
                                                        <td className="p-2">
                                                            <Badge className="bg-red-600 text-white">{p.bloodType}</Badge>
                                                        </td>
                                                        <td className="p-2 font-mono">{p.activeRequestCount}</td>
                                                        <td className="p-2">
                                                            <Badge
                                                                className={
                                                                    p.highestUrgencyLevel === 'Emergency'
                                                                        ? 'bg-red-600 text-white'
                                                                        : p.highestUrgencyLevel === 'Urgent'
                                                                            ? 'bg-orange-500 text-white'
                                                                            : 'bg-emerald-500 text-white'
                                                                }
                                                            >
                                                                {p.highestUrgencyLevel === 'Emergency'
                                                                    ? 'طارئ'
                                                                    : p.highestUrgencyLevel === 'Urgent'
                                                                        ? 'عاجل'
                                                                        : 'عادي'}
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
                </TabsContent>
            </Tabs>
        </div>
    );
}
