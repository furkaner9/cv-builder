"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCVStore } from '@/store/cvStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CVPreview } from '@/components/cv/preview/CVPreview';
import { exportToPDF } from '@/lib/export/pdf';
import {
  Download,
  FileText,
  ArrowLeft,
  QrCode,
  Globe,
  Loader2,
  CheckCircle,
  Sparkles,
  Image as ImageIcon,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Printer
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500 font-medium">CV verileri hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    setExportMethod('text');

    try {
      await exportToPDF(currentCV);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDFFromHTML = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    setExportMethod('html');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const element = document.getElementById('cv-preview-export');

      if (!element) throw new Error('CV preview element not found');

      element.style.display = 'block';
      element.style.visibility = 'visible';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const fileName = `${currentCV.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
      pdf.save(fileName);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error('PDF export error:', error);
      alert(`PDF hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Modern Stats Widget Component
  const StatItem = ({ icon: Icon, label, value, colorClass }: any) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-xs filter hover:brightness-95 transition-all">
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon className={`h-5 w-5 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/80 font-sans">
      {/* --- Modernleştirilmiş Header --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 supports-backdrop-filter:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 -ml-2"
              onClick={() => router.push(`/editor/${cvId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Geri
            </Button>
            <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">CV'yi Tamamla & İndir</h1>
              <p className="text-xs text-gray-500 hidden md:block">{currentCV.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              onClick={() => router.push(`/optimize/${cvId}`)}
            >
              <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
              ATS Analizi
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push(`/editor/${cvId}`)}
              className="shadow-sm"
            >
              Düzenlemeye Dön
            </Button>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* --- Sol Sütun: İşlemler ve Bilgiler (4/12) --- */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">

            {/* 1. Yeni Özellik Tanıtım Kartı (Header'dan buraya taşındı) */}
            <Card className="border-0 ring-1 ring-green-600/20 bg-linear-to-br from-green-50 to-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-green-100 h-24 w-24 rounded-full opacity-50 blur-2xl group-hover:bg-green-200 transition-all"></div>
              <CardHeader className="pb-2 relative">
                <Badge className="w-fit bg-green-600 mb-2 hover:bg-green-700">YENİ ÖZELLİK</Badge>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Globe className="h-5 w-5" /> Online Portfolio
                </CardTitle>
                <CardDescription className="text-green-700/80">
                  CV'nizi dijital bir kimliğe dönüştürün. Paylaşılabilir link ve QR kod ile anında erişim sağlayın.
                </CardDescription>
              </CardHeader>
              <CardFooter className="relative">
                <Button
                  onClick={() => router.push(`/portfolio/${cvId}`)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Portfolio Oluştur
                </Button>
              </CardFooter>
            </Card>

            {/* 2. İndirme Seçenekleri */}
            <Card className="border-0 shadow-sm ring-1 ring-gray-200/50 bg-white overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">İndirme Formatları</CardTitle>
                <CardDescription>Başvurunuz için en uygun formatı seçin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Seçenek 1: Görsel PDF (Önerilen) - Vurgulu Tasarım */}
                <div className="rounded-2xl p-0.5 bg-linear-to-r from-purple-500 via-blue-500 to-purple-500 shadow-md hover:shadow-lg transition-all group">
                  <div className="bg-white rounded-2xl p-4 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-2.5 bg-purple-100 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                         <ImageIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 text-lg">Görsel PDF</h3>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">ÖNERİLEN</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          Tasarımı, renkleri ve düzeni %100 korur. Modern ve yaratıcı başvurular için idealdir.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleExportPDFFromHTML}
                      disabled={isExporting}
                      className="w-full bg-gray-900 hover:bg-black text-white h-11 rounded-xl font-medium shadow-sm transition-all"
                    >
                      {isExporting && exportMethod === 'html' ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Hazırlanıyor...</>
                      ) : exportSuccess && exportMethod === 'html' ? (
                        <><CheckCircle className="mr-2 h-4 w-4" /> İndirildi!</>
                      ) : (
                        <><Download className="mr-2 h-4 w-4" /> PDF Olarak İndir (Tam Görsel)</>
                      )}
                    </Button>
                  </div>
                </div>

                 {/* Diğer Seçenekler Grubu */}
                 <div className="grid grid-cols-2 gap-3">
                    {/* Seçenek 2: Metin PDF (ATS) */}
                    <Button
                        variant="outline"
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="h-auto flex-col items-start p-3 bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300 text-left transition-all group rounded-xl shadow-xs hover:shadow-md"
                    >
                        <FileText className="h-5 w-5 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">Standart PDF</span>
                          <span className="text-xs text-gray-500 leading-tight mt-0.5">ATS sistemleri için optimize edilmiş metin formatı.</span>
                        </div>
                         <div className="mt-2 w-full">
                             {isExporting && exportMethod === 'text' ? (
                               <Loader2 className="h-4 w-4 animate-spin ml-auto text-blue-600" />
                             ) : (
                                <span className="text-xs font-medium text-blue-600 block text-right group-hover:underline">İndir →</span>
                             )}
                         </div>
                    </Button>

                    {/* Seçenek 3: Yazdır */}
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="h-auto flex-col items-start p-3 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-left transition-all group rounded-xl shadow-xs hover:shadow-md"
                    >
                        <Printer className="h-5 w-5 text-gray-500 mb-2 group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Yazdır</span>
                            <span className="text-xs text-gray-500 leading-tight mt-0.5">Tarayıcı diyaloğu ile yazdır veya kaydet.</span>
                        </div>
                        <div className="mt-2 w-full text-right">
                            <span className="text-xs font-medium text-gray-600 group-hover:underline">Aç →</span>
                        </div>
                    </Button>
                 </div>

              </CardContent>
            </Card>

            {/* 3. Modern İstatistikler */}
            <div className="grid grid-cols-2 gap-3">
               <StatItem icon={Briefcase} label="Deneyim" value={currentCV.experiences.length} colorClass="bg-blue-500" />
               <StatItem icon={GraduationCap} label="Eğitim" value={currentCV.education.length} colorClass="bg-indigo-500" />
               <StatItem icon={Award} label="Yetenekler" value={currentCV.skills.length} colorClass="bg-amber-500" />
               <StatItem icon={Layers} label="Projeler" value={currentCV.projects.length} colorClass="bg-emerald-500" />
            </div>

          </div>

          {/* --- Sağ Sütun: Önizleme (8/12) --- */}
          <div className="lg:col-span-8">
            <div className="bg-gray-100/50 rounded-4xl p-4 sm:p-8 border border-gray-200/50 shadow-inner relative overflow-hidden">
               {/* Arka plan dekorasyonu */}
               <div className="absolute inset-0 bg-grid-slate-200/50 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

              <div className="flex items-center justify-between mb-4 px-2">
                 <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                   <FileText className="h-5 w-5 text-gray-500"/> Önizleme
                 </h2>
                 <Badge variant="outline" className="bg-white pl-1 pr-3 py-1 gap-1.5 text-sm font-medium border-gray-300 shadow-xs cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`/editor/${cvId}?tab=settings`)}>
                    <span className="h-2 w-2 rounded-full bg-blue-500 block"></span>
                    Template: <span className="capitalize ml-1">{currentCV.settings.templateType}</span>
                 </Badge>
              </div>

              {/* Gerçekçi Kağıt Görünümlü Önizleme Alanı */}
              <div className="overflow-auto py-4 flex justify-center relative z-10">
                <div
                  id="cv-preview-export"
                  className="bg-white transition-transform duration-300 ease-in-out origin-top"
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    padding: '0',
                    margin: '0 auto',
                    // Daha gerçekçi, yumuşak ve katmanlı gölge
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 10px 15px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)',
                    borderRadius: '2px' // Çok hafif köşe yumuşatma
                  }}
                >
                  <CVPreview cv={currentCV} scale={1} />
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-1">
                  <CheckCircle className="h-3 w-3"/>
                  Bu, belgenizin tam baskı önizlemesidir.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}