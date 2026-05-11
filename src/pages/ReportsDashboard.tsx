import { useDashboardSummary } from '@/hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Users,
    Droplets,
    ClipboardList,
    AlertTriangle,
    CheckCircle,
    Clock,
    Activity,
    TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PrintButton from '@/components/reports/PrintButton';

const BLOOD_COLORS: Record<string, string> = {
    'A+': 'bg-red-500',
    'A-': 'bg-red-400',
    'B+': 'bg-orange-500',
    'B-': 'bg-orange-400',
    'O+': 'bg-rose-600',
    'O-': 'bg-rose-500',
    'AB+': 'bg-purple-600',
    'AB-': 'bg-purple-500',
};

function StatCard({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
}: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
}) {
    return (
        <Card className="relative overflow-hidden border-0 shadow-md">
            <div className={`absolute inset-0 opacity-5 ${color}`} />
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold mt-1">{value}</p>
                        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
                    </div>
                    <div className={`p-3 rounded-full ${color} bg-opacity-15`}>
                        <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function QuickLink({
    to,
    label,
    description,
    icon: Icon,
}: {
    to: string;
    label: string;
    description: string;
    icon: React.ElementType;
}) {
    return (
        <Link to={to}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border hover:border-red-300 group">
                <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                        <Icon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default function ReportsDashboard() {
    const { data, isLoading, isError } = useDashboardSummary();
    const summary = data?.data;

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-64 rounded-xl" />
            </div>
        );
    }

    if (isError || !summary) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>فشل تحميل بيانات لوحة التحكم. يرجى المحاولة مجدداً.</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto report-print-area" dir="rtl">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 report-print-title">لوحة تحكم التقارير</h1>
                    <p className="text-muted-foreground mt-1">نظرة عامة على بيانات بنك الدم</p>
                </div>
                <PrintButton reportTitle="لوحة تحكم التقارير - بنك الدم" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="المتبرعون النشطون"
                    value={summary.activeDonorsCount.toLocaleString('ar-EG')}
                    icon={Users}
                    color="bg-emerald-500"
                    subtitle={`غير نشط: ${summary.inactiveDonorsCount}`}
                />
                <StatCard
                    title="التبرعات هذا الشهر"
                    value={summary.donationsThisMonth.toLocaleString('ar-EG')}
                    icon={Droplets}
                    color="bg-blue-500"
                    subtitle={`هذا العام: ${summary.donationsThisYear}`}
                />
                <StatCard
                    title="الطلبات المعلقة"
                    value={summary.pendingRequestsCount.toLocaleString('ar-EG')}
                    icon={Clock}
                    color="bg-amber-500"
                    subtitle={`منجزة هذا الشهر: ${summary.fulfilledRequestsThisMonth}`}
                />
                <StatCard
                    title="الطلبات الطارئة"
                    value={summary.emergencyRequestsCount.toLocaleString('ar-EG')}
                    icon={AlertTriangle}
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                    title="وحدات تنتهي قريباً"
                    value={summary.expiringUnitsCount.toLocaleString('ar-EG')}
                    icon={Activity}
                    color="bg-orange-500"
                />
                <StatCard
                    title="التبرعات المنجزة هذا الشهر"
                    value={summary.fulfilledRequestsThisMonth.toLocaleString('ar-EG')}
                    icon={CheckCircle}
                    color="bg-teal-500"
                />
            </div>

            {/* Inventory by Blood Type */}
            <Card className="shadow-md border-0">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Droplets className="h-5 w-5 text-red-600" />
                        المخزون الحالي حسب فصيلة الدم
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {summary.inventoryByBloodType.map((inv) => (
                            <div
                                key={inv.bloodType}
                                className="flex flex-col items-center p-4 rounded-xl bg-gray-50 border"
                            >
                                <Badge
                                    className={`${BLOOD_COLORS[inv.bloodType] ?? 'bg-gray-400'} text-white text-lg px-3 py-1 mb-2`}
                                >
                                    {inv.bloodType}
                                </Badge>
                                <span className="text-2xl font-bold text-gray-800">
                                    {inv.quantityAvailable.toLocaleString('ar-EG')}
                                </span>
                                <span className="text-xs text-muted-foreground mt-1">وحدة متاحة</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Links */}
            <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                    تقارير تفصيلية
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <QuickLink
                        to="/staff/reports/donors"
                        label="تقارير المتبرعين"
                        description="إحصائيات، توزيع المدن، الأهلية"
                        icon={Users}
                    />
                    <QuickLink
                        to="/staff/reports/donations"
                        label="تقارير التبرعات"
                        description="الفترات، الكميات، نتائج الفحوصات"
                        icon={Droplets}
                    />
                    <QuickLink
                        to="/staff/reports/inventory"
                        label="تقارير المخزون"
                        description="التوافر، الانتهاء، الاستهلاك"
                        icon={Activity}
                    />
                    <QuickLink
                        to="/staff/reports/requests"
                        label="الطلبات والمرضى"
                        description="حالة الطلبات، معدل الإنجاز"
                        icon={ClipboardList}
                    />
                </div>
            </div>
        </div>
    );
}
