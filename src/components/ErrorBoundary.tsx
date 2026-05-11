import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: string | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            errorInfo: errorInfo.componentStack || null,
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4" dir="rtl">
                    <Card className="w-full max-w-lg">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                                <AlertCircle className="h-8 w-8 text-destructive" />
                            </div>
                            <CardTitle className="text-xl">حدث خطأ غير متوقع</CardTitle>
                            <CardDescription>
                                نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                                    <p className="font-mono text-sm text-destructive mb-2">
                                        {this.state.error.message}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="text-xs text-muted-foreground">
                                            <summary className="cursor-pointer hover:text-foreground">
                                                تفاصيل الخطأ
                                            </summary>
                                            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
                                                {this.state.errorInfo}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button onClick={this.handleRetry} className="flex-1">
                                    <RefreshCw className="h-4 w-4 ml-2" />
                                    إعادة المحاولة
                                </Button>
                                <Button variant="outline" onClick={this.handleGoHome} className="flex-1">
                                    <Home className="h-4 w-4 ml-2" />
                                    الصفحة الرئيسية
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
