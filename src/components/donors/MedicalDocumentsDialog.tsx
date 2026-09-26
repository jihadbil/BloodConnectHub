import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Trash2, CheckCircle, Loader2, Eye, Paperclip } from "lucide-react";
import { useDonorDocuments, useUploadDocument, useDeleteDocument, useVerifyDocument } from "@/hooks/useMedicalDocuments";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";
import { medicalDocumentsApi } from "@/api";

interface MedicalDocumentsDialogProps {
  donorId: number | null;
  isOpen: boolean;
  onClose: () => void;
  donorName: string;
}

export function MedicalDocumentsDialog({ donorId, isOpen, onClose, donorName }: MedicalDocumentsDialogProps) {
  const { user } = useAuth();
  const isAdminOrStaff = user?.roles?.some(r => ['Admin', 'BloodBankStaff'].includes(r));

  const { data, isLoading } = useDonorDocuments(donorId || 0);
  const uploadDoc = useUploadDocument();
  const deleteDoc = useDeleteDocument();
  const verifyDoc = useVerifyDocument();

  const documents = data?.data || [];

  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [openingDocId, setOpeningDocId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setFileName(selected?.name || "");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorId || !documentType.trim() || !file) return;

    await uploadDoc.mutateAsync({ donorId, documentType, file });
    setDocumentType("");
    setFile(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الوثيقة؟")) {
      await deleteDoc.mutateAsync(id);
    }
  };

  const handleVerify = async (id: number, isVerified: boolean) => {
    await verifyDoc.mutateAsync({
      id,
      data: {
        isVerified,
        notes: isVerified ? "تم التحقق بواسطة موظف" : "تم رفض الوثيقة",
      },
    });
  };

  // فتح الملف بشكل آمن عبر Blob + JWT لتجنب مشاكل CORS والأحرف العربية
  const handleOpenFile = async (docId: number, filePath: string) => {
    const token = localStorage.getItem('api_token');
    setOpeningDocId(docId);
    try {
      await medicalDocumentsApi.openFileSecurely(filePath, token);
    } catch (err) {
      alert('تعذّر فتح الملف. تأكد من أن الخادم يعمل ويدعم Static Files.');
      console.error('[MedicalDocs] فشل فتح الملف:', err);
    } finally {
      setOpeningDocId(null);
    }
  };

  const canUpload = !!donorId && !!documentType.trim() && !!file;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            الوثائق الطبية: {donorName}
          </DialogTitle>
          <DialogDescription>
            ارفع وثائقك الطبية والتحاليل لمراجعتها من قِبل الكادر الطبي
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">

          {/* رسالة إذا لم يتم ربط المتبرع */}
          {!donorId ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm dark:bg-yellow-900/20 dark:border-yellow-700">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">⚠️ لا يمكن رفع الوثائق حالياً</p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                لم يتم ربط حسابك بسجل متبرع بعد. يرجى التواصل مع إدارة المستشفى.
              </p>
            </div>
          ) : (
            <div className="bg-secondary/30 p-4 rounded-lg border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                رفع وثيقة جديدة
              </h3>
              <form onSubmit={handleUpload} className="space-y-4">

                {/* نوع الوثيقة */}
                <div className="space-y-2">
                  <Label htmlFor="doc-type">
                    نوع الوثيقة <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="doc-type"
                    placeholder="مثال: فحص دم، تقرير طبي، صورة أشعة..."
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  />
                </div>

                {/* اختيار الملف — native input مخفي + زر مخصص */}
                <div className="space-y-2">
                  <Label>
                    الملف (صورة أو PDF) <span className="text-destructive">*</span>
                  </Label>
                  {/* hidden native file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="file-upload-input"
                  />
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 shrink-0"
                    >
                      <Paperclip className="h-4 w-4" />
                      اختر ملفاً
                    </Button>
                    {fileName ? (
                      <span
                        className="text-sm text-green-700 dark:text-green-400 truncate max-w-[200px]"
                        title={fileName}
                      >
                        ✅ {fileName}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">لم يتم اختيار ملف</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    الصيغ المقبولة: JPG، PNG، PDF
                  </p>
                </div>

                {/* زر الرفع */}
                <Button
                  type="submit"
                  disabled={!canUpload || uploadDoc.isPending}
                  className="w-full"
                >
                  {uploadDoc.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 ml-2" />
                      رفع الوثيقة
                    </>
                  )}
                </Button>

                {/* تلميح للمستخدم */}
                {(!documentType.trim() || !file) && (
                  <p className="text-xs text-center text-muted-foreground">
                    {!documentType.trim() && !file
                      ? "أدخل نوع الوثيقة واختر ملفاً لتفعيل الزر"
                      : !documentType.trim()
                      ? "أدخل نوع الوثيقة لتفعيل الزر"
                      : "اختر ملفاً لتفعيل الزر"}
                  </p>
                )}
              </form>
            </div>
          )}

          {/* قائمة الوثائق */}
          <div>
            <h3 className="font-semibold mb-4">قائمة الوثائق المرفوعة</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 bg-secondary/20 rounded-lg border border-dashed">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground">لا توجد وثائق مرفوعة بعد</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>نوع الوثيقة</TableHead>
                      <TableHead>تاريخ الرفع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>ملاحظات</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => {
                      // دعم كلا الصيغتين: PascalCase من الـ API أو camelCase
                      const docId = (doc as any).documentID ?? doc.documentId ?? 0;

                      return (
                      <TableRow key={docId}>
                        <TableCell className="font-medium">{doc.documentType}</TableCell>
                        <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                        <TableCell>
                          <Badge variant={doc.isVerified ? "default" : "secondary"}>
                            {doc.isVerified ? "✅ تم التحقق" : "⏳ قيد المراجعة"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate" title={doc.notes || ""}>
                          {doc.notes || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {doc.filePath && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="عرض الوثيقة"
                                onClick={() => handleOpenFile(docId, doc.filePath)}
                                disabled={openingDocId === docId}
                              >
                                {openingDocId === docId
                                  ? <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                  : <Eye className="h-4 w-4 text-blue-600" />
                                }
                              </Button>
                            )}
                            {isAdminOrStaff && !doc.isVerified && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="تأكيد الوثيقة"
                                className="text-green-600"
                                onClick={() => handleVerify(docId, true)}
                                disabled={verifyDoc.isPending}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {(isAdminOrStaff || !doc.isVerified) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="حذف"
                                className="text-destructive"
                                onClick={() => handleDelete(docId)}
                                disabled={deleteDoc.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      );
                    })}

                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
