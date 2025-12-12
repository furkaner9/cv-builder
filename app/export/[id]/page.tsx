"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCVStore } from '@/store/cvStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CVPreview } from '@/components/cv/preview/CVPreview';
import { exportToPDF, exportToPDFFromHTML } from '@/lib/export/pdf';
import { 
  Download, 
  FileText, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';

export default function ExportPage() {
  const params = useParams();
  const router = useRouter();
  const cvId = params.id as string;
  
  const { currentCV, loadCV } = useCVStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportMethod, setExportMethod] = useState<'text' | 'html'>('text');

  useEffect(() => {
    if (cvId) {
      loadCV(cvId);
    }
  }, [cvId, loadCV]);

  if (!currentCV) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">CV yükleniyor...</p>
        </div>
      </div>
    );
  }

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      await exportToPDF(currentCV);
      setExportSuccess(true);
      
      // 2 saniye sonra success mesajını kaldır
      setTimeout(() => {
        setExportSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDFFromHTML = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const fileName = `${currentCV.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
      await exportToPDFFromHTML('cv-preview-export', fileName);
      setExportSuccess(true);
      
      setTimeout(() => {
        setExportSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/editor/${cvId}`)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-semibold text-lg">CV İndir</h1>
                <p className="text-xs text-gray-500">{currentCV.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/editor/${cvId}`)}
              >
                Düzenlemeye Dön
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Export Options */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>İndirme Seçenekleri</CardTitle>
                <CardDescription>
                  CV'nizi farklı formatlarda indirin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* PDF - Text Method */}
                <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <FileText className="h-6 w-6 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">PDF (Metin)</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        ATS uyumlu, düzenli metin formatı. İş başvuruları için önerilir.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isExporting && exportMethod === 'text' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        İndiriliyor...
                      </>
                    ) : exportSuccess && exportMethod === 'text' ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        İndirildi!
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        PDF İndir
                      </>
                    )}
                  </Button>
                </div>

                {/* PDF - HTML Method */}
                <div className="border rounded-lg p-4 hover:border-purple-500 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <ImageIcon className="h-6 w-6 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">PDF (Görsel)</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Tam görsel olarak, renk ve düzeni koruyarak. Portfolio için ideal.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleExportPDFFromHTML}
                    disabled={isExporting}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isExporting && exportMethod === 'html' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        İndiriliyor...
                      </>
                    ) : exportSuccess && exportMethod === 'html' ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        İndirildi!
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Görsel PDF İndir
                      </>
                    )}
                  </Button>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    💡 İpucu
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• <strong>Metin PDF:</strong> ATS sistemleri için en iyi seçim</li>
                    <li>• <strong>Görsel PDF:</strong> Portfolio ve kişisel kullanım için</li>
                    <li>• Her iki formatı da indirip karşılaştırabilirsiniz</li>
                  </ul>
                </div>

                {/* Stats */}
                <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">CV İstatistikleri</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">İş Deneyimi:</span>
                        <span className="font-medium">{currentCV.experiences.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Eğitim:</span>
                        <span className="font-medium">{currentCV.education.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Yetenek:</span>
                        <span className="font-medium">{currentCV.skills.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Proje:</span>
                        <span className="font-medium">{currentCV.projects.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sertifika:</span>
                        <span className="font-medium">{currentCV.certifications.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dil:</span>
                        <span className="font-medium">{currentCV.languages.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Önizleme</CardTitle>
                <CardDescription>
                  CV'niz şu şekilde görünecek
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  id="cv-preview-export"
                  className="border rounded-lg overflow-hidden bg-white shadow-lg"
                  style={{ maxHeight: '800px', overflowY: 'auto' }}
                >
                  <CVPreview cv={currentCV} scale={1} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}