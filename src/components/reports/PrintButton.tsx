import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrintButtonProps {
    reportTitle?: string;
    className?: string;
}

export default function PrintButton({ reportTitle, className = '' }: PrintButtonProps) {
    const handlePrint = () => {
        if (reportTitle) {
            const prev = document.title;
            document.title = reportTitle;
            window.print();
            document.title = prev;
        } else {
            window.print();
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className={`print:hidden flex items-center gap-2 border-gray-300 hover:border-red-400 hover:text-red-600 transition-colors ${className}`}
        >
            <Printer className="h-4 w-4" />
            طباعة التقرير
        </Button>
    );
}
