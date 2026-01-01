"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCVStore } from '@/store/cvStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  GitCompare,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  AlertCircle,
  CheckCircle,
  Trophy,
  Edit,
  BarChart3,
  Zap,
} from 'lucide-react';
import { compareCVs, type CVComparison } from '@/lib/compare/comparator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { CVData } from '@/types/cv';

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cvList, loadCV } = useCVStore();

  const [cv1Id, setCv1Id] = useState<string>('');
  const [cv2Id, setCv2Id] = useState<string>('');
  const [cv1, setCv1] = useState<CVData | null>(null);
  const [cv2, setCv2] = useState<CVData | null>(null);
  const [comparison, setComparison] = useState<CVComparison | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // URL'den ID'leri al
  useEffect(() => {
    const id1 = searchParams.get('cv1');
    const id2 = searchParams.get('cv2');
    
    if (id1) setCv1Id(id1);
    if (id2) setCv2Id(id2);
  }, [searchParams]);

  // CV'leri yükle
  useEffect(() => {
    if (cv1Id) {
      const foundCv1 = cvList.find(cv => cv.id === cv1Id);
      if (foundCv1) setCv1(foundCv1);
    }
  }, [cv1Id, cvList]);

  useEffect(() => {
    if (cv2Id) {
      const foundCv2 = cvList.find(cv => cv.id === cv2Id);
      if (foundCv2) setCv2(foundCv2);
    }
  }, [cv2Id, cvList]);

  const handleCompare = () => {
    if (!cv1 || !cv2) {
      alert('Lütfen iki CV seçin');
      return;
    }

    if (cv1.id === cv2.id) {
      alert('Aynı CV\'yi karşılaştıramazsınız');
      return;
    }

    setIsComparing(true);
    
    setTimeout(() => {
      const result = compareCVs(cv1, cv2);
      setComparison(result);
      setIsComparing(false);
    }, 800);
  };

  const getComparisonIcon = (type: string) => {
    switch (type) {
      case 'better':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'worse':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'equal':
        return <Minus className="w-4 h-4 text-gray-400" />;
      default:
        return <Minus className="w-4 h-4 text-blue-600" />;
    }
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

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-semibold text-lg flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-indigo-600" />
                  CV Karşılaştırma
                </h1>
                <p className="text-xs text-gray-500">İki CV'yi yan yana karşılaştırın</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* CV Seçim Paneli */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>CV Seçimi</CardTitle>
            <CardDescription>Karşılaştırmak istediğiniz iki CV'yi seçin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* CV 1 */}
              <div>
                <label className="block text-sm font-medium mb-2">CV 1</label>
                <Select value={cv1Id} onValueChange={setCv1Id}>
                  <SelectTrigger>
                    <SelectValue placeholder="CV seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cvList.map((cv) => (
                      <SelectItem key={cv.id} value={cv.id}>
                        {cv.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {cv1 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Güncelleme: {new Date(cv1.updatedAt).toLocaleDateString('tr-TR')}
                  </p>
                )}
              </div>

              {/* Karşılaştır Butonu */}
              <div>
                <Button
                  onClick={handleCompare}
                  disabled={!cv1 || !cv2 || isComparing}
                  className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  size="lg"
                >
                  {isComparing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Karşılaştırılıyor...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Karşılaştır
                    </>
                  )}
                </Button>
              </div>

              {/* CV 2 */}
              <div>
                <label className="block text-sm font-medium mb-2">CV 2</label>
                <Select value={cv2Id} onValueChange={setCv2Id}>
                  <SelectTrigger>
                    <SelectValue placeholder="CV seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cvList.map((cv) => (
                      <SelectItem key={cv.id} value={cv.id}>
                        {cv.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {cv2 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Güncelleme: {new Date(cv2.updatedAt).toLocaleDateString('tr-TR')}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Karşılaştırma Sonuçları */}
        {!comparison ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <GitCompare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Karşılaştırma Bekleniyor
              </h3>
              <p className="text-gray-500">
                İki CV seçip "Karşılaştır" butonuna tıklayın
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Skor Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CV 1 Skor */}
              <Card className={`border-2 ${comparison.winner === 'cv1' ? 'border-green-300 bg-green-50' : ''}`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">{comparison.cv1.title}</h3>
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke={comparison.score.cv1 >= 80 ? '#10b981' : comparison.score.cv1 >= 60 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - comparison.score.cv1 / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${getScoreColor(comparison.score.cv1)}`}>
                          {comparison.score.cv1}
                        </span>
                      </div>
                    </div>
                    {comparison.winner === 'cv1' && (
                      <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                        <Trophy className="w-5 h-5" />
                        Kazanan
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* VS Kartı */}
              <Card className="bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <CardContent className="text-center py-6">
                  <div className="text-6xl font-bold text-indigo-600">VS</div>
                  <p className="text-sm text-gray-600 mt-2">
                    {comparison.winner === 'tie' 
                      ? 'Berabere!' 
                      : `Fark: ${Math.abs(comparison.score.cv1 - comparison.score.cv2)} puan`}
                  </p>
                </CardContent>
              </Card>

              {/* CV 2 Skor */}
              <Card className={`border-2 ${comparison.winner === 'cv2' ? 'border-green-300 bg-green-50' : ''}`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">{comparison.cv2.title}</h3>
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke={comparison.score.cv2 >= 80 ? '#10b981' : comparison.score.cv2 >= 60 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - comparison.score.cv2 / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${getScoreColor(comparison.score.cv2)}`}>
                          {comparison.score.cv2}
                        </span>
                      </div>
                    </div>
                    {comparison.winner === 'cv2' && (
                      <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                        <Trophy className="w-5 h-5" />
                        Kazanan
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detaylı Karşılaştırma Tablosu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Detaylı Karşılaştırma
                </CardTitle>
                <CardDescription>Bölüm bazında metrik karşılaştırması</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Metrik</th>
                        <th className="text-center p-3 font-semibold">{comparison.cv1.title}</th>
                        <th className="text-center p-3 w-12"></th>
                        <th className="text-center p-3 font-semibold">{comparison.cv2.title}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.differences.map((diff, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{diff.field}</td>
                          <td className={`text-center p-3 ${
                            diff.type === 'better' ? 'bg-green-50 font-semibold text-green-700' :
                            diff.type === 'worse' ? 'bg-red-50 text-red-700' : ''
                          }`}>
                            {diff.cv1Value}
                          </td>
                          <td className="text-center p-3">
                            {getComparisonIcon(diff.type)}
                          </td>
                          <td className={`text-center p-3 ${
                            diff.type === 'worse' ? 'bg-green-50 font-semibold text-green-700' :
                            diff.type === 'better' ? 'bg-red-50 text-red-700' : ''
                          }`}>
                            {diff.cv2Value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Güçlü ve Zayıf Yönler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CV 1 Analiz */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{comparison.cv1.title} - Analiz</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Güçlü Yönler */}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-green-700 mb-3">
                      <CheckCircle className="w-4 h-4" />
                      Güçlü Yönler ({comparison.cv1.strengths.length})
                    </h4>
                    {comparison.cv1.strengths.length > 0 ? (
                      <ul className="space-y-2">
                        {comparison.cv1.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Tespit edilemedi</p>
                    )}
                  </div>

                  {/* Zayıf Yönler */}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-red-700 mb-3">
                      <AlertCircle className="w-4 h-4" />
                      İyileştirilebilir Alanlar ({comparison.cv1.weaknesses.length})
                    </h4>
                    {comparison.cv1.weaknesses.length > 0 ? (
                      <ul className="space-y-2">
                        {comparison.cv1.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-red-600 mt-0.5">×</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Tespit edilemedi</p>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => router.push(`/editor/${cv1?.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Bu CV'yi Düzenle
                  </Button>
                </CardContent>
              </Card>

              {/* CV 2 Analiz */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{comparison.cv2.title} - Analiz</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Güçlü Yönler */}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-green-700 mb-3">
                      <CheckCircle className="w-4 h-4" />
                      Güçlü Yönler ({comparison.cv2.strengths.length})
                    </h4>
                    {comparison.cv2.strengths.length > 0 ? (
                      <ul className="space-y-2">
                        {comparison.cv2.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Tespit edilemedi</p>
                    )}
                  </div>

                  {/* Zayıf Yönler */}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-red-700 mb-3">
                      <AlertCircle className="w-4 h-4" />
                      İyileştirilebilir Alanlar ({comparison.cv2.weaknesses.length})
                    </h4>
                    {comparison.cv2.weaknesses.length > 0 ? (
                      <ul className="space-y-2">
                        {comparison.cv2.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-red-600 mt-0.5">×</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Tespit edilemedi</p>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => router.push(`/editor/${cv2?.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Bu CV'yi Düzenle
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Genel Öneriler */}
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Genel İyileştirme Önerileri
                </CardTitle>
                <CardDescription>Her iki CV için öneriler</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {comparison.recommendations.map((rec, idx) => (
                    <Alert key={idx} className="border-blue-200 bg-blue-50">
                      <AlertDescription className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">{idx + 1}.</span>
                        <span>{rec}</span>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}