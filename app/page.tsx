"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCVStore } from '@/store/cvStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, FileText, Trash2, Copy, Download, Eye, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function HomePage() {
  const router = useRouter();
  const { cvList, createCV, deleteCV, duplicateCV, loadCV } = useCVStore();
  const [newCVTitle, setNewCVTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateCV = () => {
    if (newCVTitle.trim()) {
      const newCVId = createCV(newCVTitle);
      setNewCVTitle('');
      setIsDialogOpen(false);
      
      // Yeni CV'yi düzenlemek için yönlendir
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
    if (confirm('Bu CV\'yi silmek istediğinizden emin misiniz?')) {
      deleteCV(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CV Builder Pro</h1>
              <p className="text-gray-600 mt-1">Profesyonel CV'nizi dakikalar içinde oluşturun</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-5 w-5" />
                  Yeni CV Oluştur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni CV Oluştur</DialogTitle>
                  <DialogDescription>
                    CV'nize bir başlık verin. Daha sonra düzenleyebilirsiniz.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cvTitle">CV Başlığı</Label>
                    <Input
                      id="cvTitle"
                      placeholder="Örn: Yazılım Geliştirici CV"
                      value={newCVTitle}
                      onChange={(e) => setNewCVTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateCV();
                        }
                      }}
                      autoFocus
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button onClick={handleCreateCV} disabled={!newCVTitle.trim()}>
                    Oluştur
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {cvList.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              <FileText className="mx-auto h-24 w-24 text-gray-400 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Henüz CV'niz yok
              </h2>
              <p className="text-gray-600 mb-8">
                İlk CV'nizi oluşturarak başlayın. AI destekli araçlarımız ile dakikalar içinde profesyonel bir CV hazırlayabilirsiniz.
              </p>
              <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-5 w-5" />
                İlk CV'mi Oluştur
              </Button>
            </div>
          </div>
        ) : (
          // CV List
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">CV'lerim</h2>
              <p className="text-gray-600 mt-1">
                {cvList.length} adet CV'niz bulunuyor
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvList.map((cv) => (
                <Card key={cv.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="line-clamp-1">{cv.title}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDuplicateCV(cv.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteCV(cv.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(cv.updatedAt), 'dd MMM yyyy, HH:mm', { locale: tr })}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Template:</span>
                        <span className="font-medium capitalize">{cv.settings.templateType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deneyim:</span>
                        <span className="font-medium">{cv.experiences.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Eğitim:</span>
                        <span className="font-medium">{cv.education.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Yetenek:</span>
                        <span className="font-medium">{cv.skills.length}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Tamamlanma</span>
                        <span>
                          {Math.round(
                            ((cv.personalInfo.fullName ? 1 : 0) +
                              (cv.experiences.length > 0 ? 1 : 0) +
                              (cv.education.length > 0 ? 1 : 0) +
                              (cv.skills.length > 0 ? 1 : 0)) /
                              4 *
                              100
                          )}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.round(
                              ((cv.personalInfo.fullName ? 1 : 0) +
                                (cv.experiences.length > 0 ? 1 : 0) +
                                (cv.education.length > 0 ? 1 : 0) +
                                (cv.skills.length > 0 ? 1 : 0)) /
                                4 *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditCV(cv.id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Düzenle
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        loadCV(cv.id);
                        router.push(`/preview/${cv.id}`);
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      İndir
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">CV Builder Pro</h3>
              <p className="text-sm text-gray-600">
                AI destekli profesyonel CV oluşturma platformu
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Özellikler</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>5+ Profesyonel Şablon</li>
                <li>AI İçerik Önerileri</li>
                <li>PDF ve DOCX Export</li>
                <li>ATS Optimizasyonu</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Destek</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Kullanım Kılavuzu</li>
                <li>SSS</li>
                <li>İletişim</li>
                <li>Geri Bildirim</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            © 2024 CV Builder Pro. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}