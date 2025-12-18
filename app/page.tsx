"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCVStore } from '@/store/cvStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  FileText,
  Trash2,
  Copy,
  Download,
  Edit3,
  Calendar,
  GitCompare,
  Search,
  MoreVertical,
  Sparkles,
  // Wand2, // Kullanılmıyor
  Rocket,
  Github,
  Twitter,
  Linkedin,
  Mail,
  FileBadge2,
  ChevronRight,
  Star,
  LayoutDashboard, // Dashboard ikonu
  Briefcase // Başvurular ikonu
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function HomePage() {
  const router = useRouter();
  const { cvList, createCV, deleteCV, duplicateCV, loadCV } = useCVStore();
  const [newCVTitle, setNewCVTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCVs = cvList.filter(cv =>
    cv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCV = () => {
    if (newCVTitle.trim()) {
      const newCVId = createCV(newCVTitle);
      setNewCVTitle('');
      setIsDialogOpen(false);
      router.push(`/editor/${newCVId}`);
    }
  };

  const handleEditCV = (id: string) => {
    loadCV(id);
    router.push(`/editor/${id}`);
  };

  const handleDuplicateCV = (id: string) => {
    duplicateCV(id);
  };

  const handleDeleteCV = (id: string) => {
    if (confirm('Bu CV\'yi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      deleteCV(id);
    }
  };

  const calculateProgress = (cv: any) => {
    return Math.round(
      ((cv.personalInfo.fullName ? 1 : 0) +
        (cv.experiences.length > 0 ? 1 : 0) +
        (cv.education.length > 0 ? 1 : 0) +
        (cv.skills.length > 0 ? 1 : 0)) /
      4 * 100
    );
  };

  const CreateCVDialog = ({ triggerBtn }: { triggerBtn: React.ReactNode }) => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {triggerBtn}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-8">
        <DialogHeader>
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto text-blue-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl text-center font-bold">Yeni CV Oluştur</DialogTitle>
          <DialogDescription className="text-center">
            Harika bir kariyer için ilk adımı atın. CV'nize akılda kalıcı bir isim verin.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="space-y-3">
            <Label htmlFor="cvTitle" className="text-sm font-semibold text-gray-700">CV Başlığı</Label>
            <Input
              id="cvTitle"
              placeholder="Örn: Senior Frontend Geliştirici 2024"
              value={newCVTitle}
              onChange={(e) => setNewCVTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCV()}
              className="h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-12 px-6 border-gray-300">Vazgeç</Button>
          <Button onClick={handleCreateCV} disabled={!newCVTitle.trim()} className="h-12 px-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md">
            Oluştur ve Başla <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const Logo = ({ className = "" }) => (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="bg-linear-to-br from-blue-600 via-indigo-600 to-purple-500 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
        <FileBadge2 className="h-6 w-6 text-white" />
      </div>
      <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-blue-800 to-gray-900">
        CVim
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* YENİ CANLI ARKA PLAN */}
      <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-3xl opacity-60 mix-blend-multiply animation-blob"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/40 blur-3xl opacity-50 mix-blend-multiply animation-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[45%] h-[45%] rounded-full bg-indigo-200/40 blur-3xl opacity-40 mix-blend-multiply animation-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div> {/* Opsiyonel: Hafif bir noise/grid dokusu */}
      </div>

      {/* Header - Glassmorphism */}
      <header className="sticky top-0 z-40 w-full border-b border-white/40 bg-white/70 backdrop-blur-xl supports-backdrop-filter:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="cursor-pointer group" onClick={() => router.push('/')}>
            <Logo className="group-hover:scale-105 transition-transform duration-300" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/compare')}
              className="hidden md:flex text-gray-700 font-medium hover:text-blue-700 hover:bg-blue-50/80"
            >
              <GitCompare className="w-4 h-4 mr-2" />
              Karşılaştır
            </Button>

            {/* YENİ: Dashboard ve Başvurular Butonları */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')} // Dashboard sayfası rotası
              className="hidden sm:flex text-gray-700 font-medium hover:text-blue-700 hover:bg-blue-50/80"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/applications')} // Başvurular sayfası rotası
              className="hidden sm:flex text-gray-700 font-medium hover:text-blue-700 hover:bg-blue-50/80"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Başvurularım
            </Button>

            <div className="hidden sm:block ml-1">
              <CreateCVDialog
                triggerBtn={
                  <Button size="sm" className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5">
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Oluştur
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </header>

      {/* YENİLENMİŞ HERO SECTION - 2 Sütunlu ve Daha Dolu */}
      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 overflow-visible">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Sol Taraf - Metin */}
            <div className="text-center lg:text-left relative z-10">
              <Badge variant="secondary" className="mb-8 px-4 py-2 text-sm font-semibold bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100 rounded-full shadow-sm inline-flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                Yapay Zeka Destekli CV Oluşturucu
              </Badge>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
                Hayalinizdeki işe <br />
                <span className="relative whitespace-nowrap">
                  <span className="relative z-10 bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">CVim</span>
                  <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-200/60 -z-10" preserveAspectRatio="none">
                    <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.157-8.753 1.383-22.056 2.32-60.057 4.229-115.532 17.594-164.793 31.03-6.943 1.901-7.596 2.339-6.559 4.366.945 1.844 4.169 3.253 8.415 3.655 1.25.119 2.884-.123 4.035-.603 1.15-.48 5.24-1.92 9.087-3.2 55.79-18.514 112.52-31.12 176.163-37.407 25.151-2.487 48.52-2.858 80.346-1.428 4.531.204 13.49.852 19.926 1.44 29.997 2.732 57.931 7.889 90.367 16.82 8.246 2.276 15.537 4.175 16.208 4.222 2.092.151 4.71-1.024 5.367-2.383.531-1.095.552-1.237.22-3.262-.57-3.452-5.218-7.492-11.87-10.318-8.713-3.694-25.497-8.856-39.246-11.987-24.014-5.455-57.431-10.028-94.141-12.86-12.629-.975-32.344-1.588-41.585-1.315z"></path>
                  </svg>
                </span> ile başvurun.
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                Profesyonel şablonlar, akıllı içerik önerileri ve modern tasarım araçlarıyla dakikalar içinde dikkat çekici bir CV hazırlayın.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-5">
                <CreateCVDialog
                  triggerBtn={
                    <Button size="lg" className="h-14 px-10 text-lg bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold shadow-xl shadow-blue-600/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-600/40 transition-all group rounded-full">
                      <Rocket className="mr-2 h-6 w-6 group-hover:animate-bounce" />
                      Ücretsiz Başla
                    </Button>
                  }
                />
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="h-14 px-8 text-lg border-2 border-gray-300 text-gray-700 font-semibold hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300 rounded-full transition-all"
                >
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard'a Git
                </Button>
              </div>
            </div>

            {/* Sağ Taraf - Görsel Placeholder (Boşluğu doldurmak için) */}
            <div className="hidden lg:block relative z-10 perspective-1000">
              <div className="relative w-full h-[500px] bg-linear-to-tr from-blue-100 to-indigo-50 rounded-4xl border-4 border-white/80 shadow-2xl shadow-blue-900/10 transform -rotate-y-12 rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-all duration-700 ease-out p-6 overflow-hidden">
                {/* Buraya gerçek bir ürün ekran görüntüsü veya illüstrasyon gelecek */}
                <div className="absolute inset-0 bg-grid-slate-200/50 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                <div className="h-full w-full bg-white/60 backdrop-blur-md rounded-xl border border-white/80 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <FileText className="h-24 w-24 text-blue-200 mx-auto mb-4 opacity-80" />
                    <p className="text-gray-400 font-medium">CV Önizleme Alanı</p>
                    <Badge className="mt-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 animate-pulse">Canlı Düzenleme</Badge>
                  </div>
                  {/* Dekoratif elementler */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-2xl"></div>
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300/30 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 grow relative z-10">

        {/* Dashboard Search & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              CV'lerim
              <Badge variant="secondary" className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200">
                {cvList.length} Adet
              </Badge>
            </h3>
            <p className="text-gray-500 mt-2 font-medium">Kayıtlı CV'lerinizi buradan yönetin.</p>
          </div>

          {cvList.length > 0 && (
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="CV başlıklarında ara..."
                className="pl-12 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all h-12 text-base shadow-sm rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {cvList.length === 0 ? (
          // Empty State - Daha Canlı
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/60 backdrop-blur-md rounded-3xl border border-dashed border-blue-200/60 shadow-sm p-10">
            <div className="bg-linear-to-tr from-blue-100 to-indigo-100 p-6 rounded-full mb-6 shadow-inner">
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Henüz CV oluşturmadınız
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Profesyonel kariyer yolculuğunuza başlamak için ilk CV'nizi hemen oluşturun.
            </p>
            <CreateCVDialog
              triggerBtn={
                <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all rounded-full">
                  İlk CV'ni Oluştur
                </Button>
              }
            />
          </div>
        ) : (
          // CV LİSTESİ (GRID) - KARTLAR CANLANDIRILDI
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">

            {/* Hızlı Oluştur Kartı - Daha Dikkat Çekici */}
            <button
              onClick={() => setIsDialogOpen(true)}
              className="group flex flex-col items-center justify-center h-full min-h-[280px] rounded-2xl border-2 border-dashed border-blue-300/60 bg-blue-50/40 hover:bg-blue-50/80 hover:border-blue-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-6 backdrop-blur-sm"
            >
              <div className="h-16 w-16 rounded-full bg-white group-hover:bg-blue-600 flex items-center justify-center mb-4 transition-all shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30 border-4 border-blue-100 group-hover:border-transparent">
                <Plus className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-lg font-bold text-blue-700 group-hover:text-blue-800">Yeni CV Oluştur</span>
              <p className="text-sm text-blue-500/80 mt-2 text-center px-4">Dakikalar içinde profesyonel bir başlangıç yapın.</p>
            </button>

            {filteredCVs.map((cv) => {
              const progress = calculateProgress(cv);

              return (
                // CV KARTI - Glassmorphism ve Hover Efektleri
                <Card key={cv.id} className="group relative flex flex-col h-full border-transparent bg-white/70 backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 rounded-2xl overflow-hidden ring-1 ring-gray-100 hover:ring-blue-200/50">
                  {/* Kart Üstü Renkli Çizgi */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                  <CardHeader className="pb-4 pt-6 relative">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="font-medium text-xs bg-blue-50/80 text-blue-700 border-blue-200 capitalize mb-3 px-2.5 py-0.5 rounded-md shadow-sm">
                        {cv.settings.templateType} Şablonu
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100/50 rounded-full">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-gray-100">
                          <DropdownMenuItem onClick={() => handleDuplicateCV(cv.id)} className="font-medium cursor-pointer py-2.5">
                            <Copy className="mr-2 h-4 w-4 text-gray-500" /> Çoğalt
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteCV(cv.id)}
                            className="text-red-600 focus:text-red-700 focus:bg-red-50 font-medium cursor-pointer py-2.5"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <CardTitle className="line-clamp-2 text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {cv.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-sm text-gray-500 mt-2 font-medium">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      {format(new Date(cv.updatedAt), 'd MMMM yyyy', { locale: tr })}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 py-4">
                    <div className="space-y-4">
                      {/* Progress Bar - Daha Belirgin */}
                      <div className="space-y-2 p-4 bg-gray-50/80 rounded-xl border border-gray-100/50 group-hover:bg-blue-50/30 group-hover:border-blue-100/50 transition-colors">
                        <div className="flex justify-between text-sm font-semibold">
                          <span className="text-gray-600">Doluluk Oranı</span>
                          <span className={`font-bold ${progress === 100 ? 'text-green-600' : 'text-blue-600'}`}>%{progress}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${progress === 100 ? 'bg-linear-to-r from-green-400 to-green-600' : 'bg-linear-to-r from-blue-500 to-indigo-600'
                              }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 pb-5 gap-3 border-t border-gray-100 bg-gray-50/40 mt-auto group-hover:bg-white/80 transition-colors">
                    <Button
                      onClick={() => handleEditCV(cv.id)}
                      className="flex-1 h-10 bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-blue-600 hover:text-white hover:border-transparent transition-all shadow-sm hover:shadow-md rounded-lg"
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Düzenle
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-10 w-10 bg-white border-2 border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 shadow-sm rounded-lg transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        loadCV(cv.id);
                        router.push(`/preview/${cv.id}`);
                      }}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER - Daha Temiz ve Modern */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 pt-16 pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            {/* Column 1: Brand & Social - Geniş */}
            <div className="md:col-span-5 space-y-6">
              <Logo />
              <p className="text-base text-gray-600 pr-4 leading-relaxed max-w-md font-medium">
                CVim, yapay zeka destekli araçlarıyla kariyer yolculuğunuzda size hız kazandırır. Profesyonel, dikkat çekici ve ATS uyumlu CV'ler oluşturmak hiç bu kadar kolay olmamıştı.
              </p>
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:text-white hover:bg-blue-600 transition-all">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:text-white hover:bg-blue-400 transition-all">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:text-white hover:bg-blue-700 transition-all">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Links Columns - Daha Kompakt */}
            <div className="md:col-span-2 md:col-start-7">
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Ürün</h4>
              <ul className="space-y-4 text-gray-600 font-medium">
                <li><a href="#" className="hover:text-blue-700 transition-colors flex items-center gap-2">Özellikler</a></li>
                <li><a href="#" className="hover:text-blue-700 transition-colors">Şablonlar</a></li>
                <li><a href="#" className="hover:text-blue-700 transition-colors">Fiyatlandırma</a></li>
                <li><a href="#" className="hover:text-blue-700 transition-colors">Yol Haritası<Badge className="ml-2 bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0">Yeni</Badge></a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Kaynaklar</h4>
              <ul className="space-y-4 text-gray-600 font-medium">
                <li><a href="#" className="hover:text-blue-700 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-700 transition-colors">Kariyer Rehberi</a></li>
                <li><a href="#" className="hover:text-blue-700 transition-colors">Yardım Merkezi</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Şirket</h4>
              <ul className="space-y-4 text-gray-600 font-medium">
                <li><a href="#" className="hover:text-blue-700 transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-blue-700 transition-colors">İletişim</a></li>
                <li><a href="#" className="hover:text-blue-700 transition-colors">Gizlilik</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-500">
            <p>
              © {new Date().getFullYear()} CVim. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-blue-700 transition-colors">Kullanım Koşulları</a>
              <a href="#" className="hover:text-blue-700 transition-colors">Gizlilik Politikası</a>
              <div className="flex items-center gap-2 text-gray-700 font-semibold bg-gray-100 px-3 py-1.5 rounded-full">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>destek@cvim.com</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}