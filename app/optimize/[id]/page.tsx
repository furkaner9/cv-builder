"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCVStore } from '@/store/cvStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
  FileText,
  Zap,
  Edit,
  Download,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { analyzeCV, type ATSAnalysisResult } from '@/lib/ats/analyzer';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function OptimizePage() {
  const params = useParams();
  const router = useRouter();
  const cvId = params.id as string;
  
  const { currentCV, loadCV } = useCVStore();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const handleAnalyze = () => {
    if (!jobDescription.trim()) {
      alert('Lütfen iş ilanı açıklaması girin');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay for UX
    setTimeout(() => {
      const result = analyzeCV(currentCV, jobDescription);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'low': return <Info className="w-5 h-5 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                <h1 className="font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  ATS Optimizasyon
                </h1>
                <p className="text-xs text-gray-500">{currentCV.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/editor/${cvId}`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                CV'yi Düzenle
              </Button>
              <Button
                variant="default"
                onClick={() => router.push(`/export/${cvId}`)}
              >
                <Download className="w-4 h-4 mr-2" />
                İndir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Panel - İş İlanı Girişi */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  İş İlanı Bilgileri
                </CardTitle>
                <CardDescription>
                  CV'nizi hangi pozisyon için optimize ediyorsunuz?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="jobTitle">Hedef Pozisyon</Label>
                  <Input
                    id="jobTitle"
                    placeholder="Örn: Senior Frontend Developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="jobDescription">İş İlanı Açıklaması</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="İş ilanındaki açıklamayı, gereksinimleri ve aranan yetkinlikleri buraya yapıştırın..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={12}
                    className="mt-1.5 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 İpucu: İş ilanının tamamını yapıştırın, ATS daha iyi analiz edebilir
                  </p>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!jobDescription.trim() || isAnalyzing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analiz Ediliyor...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      ATS Analizi Yap
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* CV İstatistikleri */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
              <CardHeader>
                <CardTitle className="text-lg">CV İstatistikleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">İş Deneyimi:</span>
                    <span className="font-semibold text-blue-600">{currentCV.experiences.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Eğitim:</span>
                    <span className="font-semibold text-blue-600">{currentCV.education.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Yetenek:</span>
                    <span className="font-semibold text-blue-600">{currentCV.skills.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Proje:</span>
                    <span className="font-semibold text-blue-600">{currentCV.projects.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sertifika:</span>
                    <span className="font-semibold text-blue-600">{currentCV.certifications.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Panel - Analiz Sonuçları */}
          <div className="lg:col-span-2 space-y-6">
            {!analysis ? (
              <Card className="border-2 border-dashed">
                <CardContent className="py-16 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    ATS Analizi Bekleniyor
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    İş ilanı bilgilerini girdikten sonra "ATS Analizi Yap" butonuna tıklayın
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* ATS Skoru */}
                <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Skor Göstergesi */}
                      <div className="relative">
                        <div className="w-40 h-40">
                          <svg className="w-40 h-40 transform -rotate-90">
                            <circle
                              cx="80"
                              cy="80"
                              r="70"
                              stroke="#e5e7eb"
                              strokeWidth="12"
                              fill="none"
                            />
                            <circle
                              cx="80"
                              cy="80"
                              r="70"
                              stroke={analysis.score >= 80 ? '#10b981' : analysis.score >= 60 ? '#f59e0b' : '#ef4444'}
                              strokeWidth="12"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 70}`}
                              strokeDashoffset={`${2 * Math.PI * 70 * (1 - analysis.score / 100)}`}
                              className="transition-all duration-1000"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
                              {analysis.score}
                            </span>
                            <span className="text-sm text-gray-600 mt-1">{analysis.scoreLabel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Skor Açıklaması */}
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold mb-2">ATS Uyumluluk Skoru</h2>
                        <p className="text-gray-600 mb-4">
                          {analysis.score >= 80 && "Harika! CV'niz ATS sistemleri için iyi optimize edilmiş."}
                          {analysis.score >= 60 && analysis.score < 80 && "İyi bir başlangıç, birkaç iyileştirme ile daha da iyi olabilir."}
                          {analysis.score < 60 && "CV'nizin ATS optimizasyonu için iyileştirme gerekiyor."}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-sm">
                            <Target className="w-4 h-4 text-blue-600" />
                            <span>Anahtar Kelime: %{analysis.keywords.matchRate.toFixed(0)}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Yapı: %{analysis.structure.completeness.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Anahtar Kelime Analizi */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      Anahtar Kelime Analizi
                    </CardTitle>
                    <CardDescription>
                      İş ilanı ile CV'niz arasındaki kelime eşleşmesi
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Eşleşme Oranı */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Eşleşme Oranı</span>
                        <span className="font-semibold">{analysis.keywords.matchRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${getScoreGradient(analysis.keywords.matchRate)}`}
                          style={{ width: `${analysis.keywords.matchRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {analysis.keywords.matched.length} / {analysis.keywords.totalJobKeywords} anahtar kelime eşleşti
                      </p>
                    </div>

                    {/* Eksik Anahtar Kelimeler */}
                    {analysis.keywords.topMissingKeywords.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-red-700">
                          <AlertCircle className="w-4 h-4" />
                          Eksik Önemli Kelimeler ({analysis.keywords.topMissingKeywords.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keywords.topMissingKeywords.map((kw, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 mt-3">
                          💡 Bu kelimeleri CV'nizde kullanarak ATS skorunuzu artırabilirsiniz
                        </p>
                      </div>
                    )}

                    {/* Eşleşen Kelimeler */}
                    {analysis.keywords.matched.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          Eşleşen Kelimeler ({analysis.keywords.matched.slice(0, 15).length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keywords.matched.slice(0, 15).map((kw, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm border border-green-200"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* CV Yapısı */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      CV Yapı Kontrolü
                    </CardTitle>
                    <CardDescription>
                      Gerekli bölümlerin durumu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(analysis.structure.sections).map(([section, exists]) => {
                        const labels: Record<string, string> = {
                          contact: 'İletişim Bilgileri',
                          summary: 'Özet/Hakkımda',
                          experience: 'İş Deneyimi',
                          education: 'Eğitim',
                          skills: 'Yetenekler',
                        };

                        return (
                          <div
                            key={section}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              exists ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}
                          >
                            <span className="font-medium">{labels[section]}</span>
                            {exists ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Format Kontrolleri */}
                {analysis.formatIssues.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        Format Kontrolleri
                      </CardTitle>
                      <CardDescription>
                        Tespit edilen sorunlar ve uyarılar
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.formatIssues.map((issue, idx) => (
                          <Alert
                            key={idx}
                            className={
                              issue.type === 'error'
                                ? 'border-red-200 bg-red-50'
                                : issue.type === 'warning'
                                ? 'border-yellow-200 bg-yellow-50'
                                : 'border-blue-200 bg-blue-50'
                            }
                          >
                            <AlertDescription className="text-sm flex items-start gap-2">
                              {issue.type === 'error' ? (
                                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                              ) : issue.type === 'warning' ? (
                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              ) : (
                                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              )}
                              <div>
                                <span className="font-medium">{issue.section}: </span>
                                {issue.text}
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* İyileştirme Önerileri */}
                {analysis.recommendations.length > 0 && (
                  <Card className="border-2 border-blue-200">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        İyileştirme Önerileri
                      </CardTitle>
                      <CardDescription>
                        CV'nizi daha iyi hale getirmek için öneriler
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {analysis.recommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            className={`p-4 border-l-4 rounded-r-lg ${getPriorityColor(rec.priority)}`}
                          >
                            <div className="flex items-start gap-3">
                              {getPriorityIcon(rec.priority)}
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{rec.title}</h4>
                                <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                                {rec.actionable && (
                                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                    <span className="text-blue-600">✓</span> {rec.actionable}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Aksiyon Butonları */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => router.push(`/editor/${cvId}`)}
                    className="flex-1"
                    size="lg"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    CV'yi İyileştir
                  </Button>
                  <Button
                    onClick={() => router.push(`/export/${cvId}`)}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    İndir
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}