"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCVStore } from '@/store/cvStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  QrCode,
  Globe,
  Copy,
  Check,
  Eye,
  Download,
  Share2,
  Settings,
  BarChart3,
  Lock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { generateSlug, generatePortfolioUrl, generateShareLinks, type OnlinePortfolio } from '@/types/portfolio';

export default function PortfolioManagerPage() {
  const params = useParams();
  const router = useRouter();
  const cvId = params.id as string;
  
  const { currentCV, loadCV } = useCVStore();
  const [portfolio, setPortfolio] = useState<OnlinePortfolio | null>(null);
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<any>(null);

  useEffect(() => {
    if (cvId) {
      loadCV(cvId);
    }
  }, [cvId, loadCV]);

  // Portfolio'yu yükle veya oluştur
  useEffect(() => {
    if (currentCV) {
      // localStorage'dan portfolio bilgisini al
      const savedPortfolio = localStorage.getItem(`portfolio-${cvId}`);
      
      if (savedPortfolio) {
        setPortfolio(JSON.parse(savedPortfolio));
      } else {
        // Yeni portfolio oluştur
        const newSlug = generateSlug(currentCV.personalInfo.fullName || currentCV.title);
        setSlug(newSlug);
      }
    }
  }, [currentCV, cvId]);

  // QR kod oluştur
  useEffect(() => {
    if (portfolio && qrRef.current) {
      const portfolioUrl = generatePortfolioUrl(portfolio.slug);
      
      if (!qrCodeRef.current) {
        qrCodeRef.current = new QRCodeStyling({
          width: 300,
          height: 300,
          data: portfolioUrl,
          margin: 10,
          qrOptions: {
            errorCorrectionLevel: 'M',
          },
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: 10,
          },
          dotsOptions: {
            color: portfolio.qrCodeStyle === 'dots' ? '#3B82F6' : '#000000',
            type: portfolio.qrCodeStyle === 'rounded' ? 'rounded' : 'square',
          },
          cornersSquareOptions: {
            type: 'extra-rounded',
          },
          cornersDotOptions: {
            type: 'dot',
          },
        });

        qrCodeRef.current.append(qrRef.current);
      } else {
        qrCodeRef.current.update({
          data: portfolioUrl,
        });
      }
    }
  }, [portfolio]);

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

  const handleCreatePortfolio = () => {
    if (!slug.trim()) {
      alert('Lütfen bir URL slug\'ı girin');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const newPortfolio: OnlinePortfolio = {
        id: `portfolio-${Date.now()}`,
        cvId,
        slug: slug.trim(),
        isPublic: true,
        isActive: true,
        showQRCode: true,
        qrCodePosition: 'top-right',
        qrCodeSize: 'medium',
        qrCodeStyle: 'rounded',
        theme: 'light',
        showViewCount: true,
        allowDownload: true,
        passwordProtected: false,
        viewCount: 0,
        uniqueVisitors: 0,
        downloadCount: 0,
        shareableLinks: generateShareLinks(
          generatePortfolioUrl(slug.trim()),
          currentCV.personalInfo.fullName || currentCV.title
        ),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      localStorage.setItem(`portfolio-${cvId}`, JSON.stringify(newPortfolio));
      setPortfolio(newPortfolio);
      setIsGenerating(false);
    }, 1000);
  };

  const handleUpdatePortfolio = (updates: Partial<OnlinePortfolio>) => {
    if (!portfolio) return;

    const updated = {
      ...portfolio,
      ...updates,
      updatedAt: new Date(),
    };

    localStorage.setItem(`portfolio-${cvId}`, JSON.stringify(updated));
    setPortfolio(updated);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({
        name: `${currentCV.personalInfo.fullName}-qr`,
        extension: 'png',
      });
    }
  };

  const portfolioUrl = portfolio ? generatePortfolioUrl(portfolio.slug) : '';

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50">
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
                  <Globe className="w-5 h-5 text-blue-600" />
                  Online Portfolio & QR Kod
                </h1>
                <p className="text-xs text-gray-500">{currentCV.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {portfolio && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => window.open(portfolioUrl, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Önizle
                  </Button>
                  <Button
                    onClick={() => router.push(`/editor/${cvId}`)}
                  >
                    CV'yi Düzenle
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!portfolio ? (
          // Portfolio Oluşturma
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Online Portfolio Oluştur</CardTitle>
                <CardDescription>
                  CV'nizi online paylaşılabilir bir portfolio'ya dönüştürün
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Portfolio Özellikleri
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Paylaşılabilir benzersiz link</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>QR kod ile kolay erişim</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Görüntülenme istatistikleri</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Mobil uyumlu tasarım</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Şifre koruması (opsiyonel)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Label htmlFor="slug">Portfolio URL</Label>
                  <div className="flex gap-2 mt-1.5">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{window.location.origin}/portfolio/</span>
                    </div>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="ahmet-yilmaz"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 URL'niz şu şekilde olacak: {window.location.origin}/portfolio/{slug || 'ornek-slug'}
                  </p>
                </div>

                <Button
                  onClick={handleCreatePortfolio}
                  disabled={!slug.trim() || isGenerating}
                  className="w-full bg-linear-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      Portfolio Oluştur
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Portfolio Yönetimi
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol Panel - Ayarlar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Portfolio Linki</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={portfolioUrl}
                      readOnly
                      className="text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(portfolioUrl)}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(portfolioUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Aç
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyToClipboard(portfolioUrl)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Paylaş
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="settings">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="settings">
                    <Settings className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="qr">
                    <QrCode className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="analytics">
                    <BarChart3 className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>

                {/* Ayarlar Tab */}
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Portfolio Ayarları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Portfolio Aktif</Label>
                        <Switch
                          checked={portfolio.isActive}
                          onCheckedChange={(checked) => 
                            handleUpdatePortfolio({ isActive: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Herkese Açık</Label>
                        <Switch
                          checked={portfolio.isPublic}
                          onCheckedChange={(checked) => 
                            handleUpdatePortfolio({ isPublic: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>İndirmeye İzin Ver</Label>
                        <Switch
                          checked={portfolio.allowDownload}
                          onCheckedChange={(checked) => 
                            handleUpdatePortfolio({ allowDownload: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Görüntülenme Sayısı Göster</Label>
                        <Switch
                          checked={portfolio.showViewCount}
                          onCheckedChange={(checked) => 
                            handleUpdatePortfolio({ showViewCount: checked })
                          }
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-3">
                          <Label>Şifre Koruması</Label>
                          <Switch
                            checked={portfolio.passwordProtected}
                            onCheckedChange={(checked) => 
                              handleUpdatePortfolio({ passwordProtected: checked })
                            }
                          />
                        </div>
                        
                        {portfolio.passwordProtected && (
                          <Input
                            type="password"
                            placeholder="Şifre belirleyin"
                            value={portfolio.password || ''}
                            onChange={(e) => 
                              handleUpdatePortfolio({ password: e.target.value })
                            }
                          />
                        )}
                      </div>

                      <div>
                        <Label>Tema</Label>
                        <Select
                          value={portfolio.theme}
                          onValueChange={(value: any) => 
                            handleUpdatePortfolio({ theme: value })
                          }
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Açık</SelectItem>
                            <SelectItem value="dark">Koyu</SelectItem>
                            <SelectItem value="auto">Otomatik</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* QR Kod Tab */}
                <TabsContent value="qr">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">QR Kod Ayarları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>QR Kod Göster</Label>
                        <Switch
                          checked={portfolio.showQRCode}
                          onCheckedChange={(checked) => 
                            handleUpdatePortfolio({ showQRCode: checked })
                          }
                        />
                      </div>

                      {portfolio.showQRCode && (
                        <>
                          <div>
                            <Label>QR Kod Pozisyonu</Label>
                            <Select
                              value={portfolio.qrCodePosition}
                              onValueChange={(value: any) => 
                                handleUpdatePortfolio({ qrCodePosition: value })
                              }
                            >
                              <SelectTrigger className="mt-1.5">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="top-right">Sağ Üst</SelectItem>
                                <SelectItem value="top-left">Sol Üst</SelectItem>
                                <SelectItem value="bottom-right">Sağ Alt</SelectItem>
                                <SelectItem value="bottom-left">Sol Alt</SelectItem>
                                <SelectItem value="header">Header</SelectItem>
                                <SelectItem value="footer">Footer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>QR Kod Boyutu</Label>
                            <Select
                              value={portfolio.qrCodeSize}
                              onValueChange={(value: any) => 
                                handleUpdatePortfolio({ qrCodeSize: value })
                              }
                            >
                              <SelectTrigger className="mt-1.5">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Küçük (80px)</SelectItem>
                                <SelectItem value="medium">Orta (120px)</SelectItem>
                                <SelectItem value="large">Büyük (160px)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>QR Kod Stili</Label>
                            <Select
                              value={portfolio.qrCodeStyle}
                              onValueChange={(value: any) => 
                                handleUpdatePortfolio({ qrCodeStyle: value })
                              }
                            >
                              <SelectTrigger className="mt-1.5">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="square">Kare</SelectItem>
                                <SelectItem value="dots">Noktalar</SelectItem>
                                <SelectItem value="rounded">Yuvarlatılmış</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">İstatistikler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600">
                            {portfolio.viewCount}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Görüntülenme
                          </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">
                            {portfolio.uniqueVisitors}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Ziyaretçi
                          </div>
                        </div>
                      </div>

                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600">
                          {portfolio.downloadCount}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          İndirme
                        </div>
                      </div>

                      {portfolio.lastViewedAt && (
                        <div className="text-sm text-gray-600 text-center pt-4 border-t">
                          Son görüntülenme:{' '}
                          {new Date(portfolio.lastViewedAt).toLocaleString('tr-TR')}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sağ Panel - QR Kod & Paylaşım */}
            <div className="lg:col-span-2 space-y-6">
              {/* QR Kod */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    QR Kod
                  </CardTitle>
                  <CardDescription>
                    Portfolio'nuzu QR kod ile paylaşın
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div 
                      ref={qrRef}
                      className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4"
                    />
                    <Button onClick={handleDownloadQR}>
                      <Download className="w-4 h-4 mr-2" />
                      QR Kodu İndir
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sosyal Paylaşım */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-green-600" />
                    Sosyal Medyada Paylaş
                  </CardTitle>
                  <CardDescription>
                    Portfolio'nuzu sosyal medyada paylaşın
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => window.open(portfolio.shareableLinks.linkedin, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        in
                      </div>
                      LinkedIn
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => window.open(portfolio.shareableLinks.facebook, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                        f
                      </div>
                      Facebook
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => window.open(portfolio.shareableLinks.twitter, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <div className="w-5 h-5 bg-sky-500 rounded flex items-center justify-center text-white text-xs font-bold">
                        𝕏
                      </div>
                      Twitter
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => window.open(portfolio.shareableLinks.whatsapp, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                        W
                      </div>
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bilgi */}
              <Alert className="border-blue-200 bg-blue-50">
                <Globe className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>Portfolio Linkiniz Hazır!</strong>
                  <br />
                  Portfolio'nuzu CV'nize eklemek için QR kodunu indirip PDF'e yerleştirin veya linki paylaşın.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}