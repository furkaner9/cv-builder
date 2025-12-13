"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCVStore } from '@/store/cvStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Eye, 
  Download, 
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Award,
  Languages,
  Settings,
  Sparkles
} from 'lucide-react';
import { PersonalInfoEditor } from '@/components/cv/editor/PersonalInfoEditor';
import { ExperienceEditor } from '@/components/cv/editor/ExperienceEditor';
import { EducationEditor } from '@/components/cv/editor/EducationEditor';
import { SkillsEditor } from '@/components/cv/editor/SkillsEditor';
import { ProjectsEditor } from '@/components/cv/editor/ProjectsEditor';
import { CertificationsEditor } from '@/components/cv/editor/CertificationsEditor';
import { LanguagesEditor } from '@/components/cv/editor/LanguagesEditor';
import { SettingsEditor } from '@/components/cv/editor/SettingsEditor';
import { CVPreview } from '@/components/cv/preview/CVPreview';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const cvId = params.id as string;
  
  const { currentCV, loadCV, saveCV, isSaving, lastSaved } = useCVStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (cvId) {
      loadCV(cvId);
    }
  }, [cvId, loadCV]);

  useEffect(() => {
    // Auto-save her 30 saniyede
    const interval = setInterval(() => {
      if (currentCV) {
        saveCV();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentCV, saveCV]);

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

  const handleSave = async () => {
    await saveCV();
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleExport = () => {
    router.push(`/export/${cvId}`);
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
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-semibold text-lg">{currentCV.title}</h1>
                {lastSaved && (
                  <p className="text-xs text-gray-500">
                    Son kaydedilme: {new Date(lastSaved).toLocaleTimeString('tr-TR')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
              <Button
                variant="outline"
                onClick={handlePreview}
              >
                <Eye className="mr-2 h-4 w-4" />
                Önizle
              </Button>
              <Button
                onClick={handleExport}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="mr-2 h-4 w-4" />
                İndir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full mb-6">
                <TabsTrigger value="personal" className="flex flex-col items-center gap-1 py-3">
                  <User className="h-4 w-4" />
                  <span className="text-xs">Kişisel</span>
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex flex-col items-center gap-1 py-3">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-xs">Deneyim</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex flex-col items-center gap-1 py-3">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-xs">Eğitim</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex flex-col items-center gap-1 py-3">
                  <Code className="h-4 w-4" />
                  <span className="text-xs">Yetenek</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex flex-col items-center gap-1 py-3">
                  <FolderGit2 className="h-4 w-4" />
                  <span className="text-xs">Proje</span>
                </TabsTrigger>
                <TabsTrigger value="certifications" className="flex flex-col items-center gap-1 py-3">
                  <Award className="h-4 w-4" />
                  <span className="text-xs">Sertifika</span>
                </TabsTrigger>
                <TabsTrigger value="languages" className="flex flex-col items-center gap-1 py-3">
                  <Languages className="h-4 w-4" />
                  <span className="text-xs">Dil</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex flex-col items-center gap-1 py-3">
                  <Settings className="h-4 w-4" />
                  <span className="text-xs">Ayarlar</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <PersonalInfoEditor />
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                <ExperienceEditor />
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                <EducationEditor />
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <SkillsEditor />
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <ProjectsEditor />
              </TabsContent>

              <TabsContent value="certifications" className="space-y-6">
                <CertificationsEditor />
              </TabsContent>

              <TabsContent value="languages" className="space-y-6">
                <LanguagesEditor />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <SettingsEditor />
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                  <h3 className="font-semibold text-sm">Canlı Önizleme</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePreview}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Tam Ekran
                  </Button>
                </div>
                
                {/* Preview Container */}
                <div className="relative bg-gray-100 overflow-auto" style={{ height: '600px' }}>
                  <div className="absolute inset-0 flex items-start justify-center p-4">
                    <div 
                      className="bg-white shadow-lg origin-top"
                      style={{ 
                        transform: 'scale(0.35)',
                        width: '210mm',
                        minHeight: '297mm'
                      }}
                    >
                      <CVPreview cv={currentCV} scale={1} />
                    </div>
                  </div>
                </div>

                {/* Template Quick Selector */}
                <div className="p-4 border-t bg-gray-50">
                  <p className="text-xs text-gray-600 mb-2">Hızlı Template Değiştir:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {['modern', 'classic', 'minimal', 'creative'].map((template) => (
                      <button
                        key={template}
                        onClick={() => {
                          const { updateSettings } = useCVStore.getState();
                          updateSettings({ templateType: template as any });
                        }}
                        className={`text-xs py-2 px-1 rounded border transition-all ${
                          currentCV.settings.templateType === template
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {template === 'modern' && '🎨 Modern'}
                        {template === 'classic' && '📄 Klasik'}
                        {template === 'minimal' && '⚪ Minimal'}
                        {template === 'creative' && '🚀 Yaratıcı'}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tamamlanma</span>
                    <span className="font-medium">
                      {Math.round(
                        ((currentCV.personalInfo.fullName ? 1 : 0) +
                          (currentCV.experiences.length > 0 ? 1 : 0) +
                          (currentCV.education.length > 0 ? 1 : 0) +
                          (currentCV.skills.length > 0 ? 1 : 0) +
                          (currentCV.personalInfo.summary ? 1 : 0)) /
                          5 *
                          100
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          ((currentCV.personalInfo.fullName ? 1 : 0) +
                            (currentCV.experiences.length > 0 ? 1 : 0) +
                            (currentCV.education.length > 0 ? 1 : 0) +
                            (currentCV.skills.length > 0 ? 1 : 0) +
                            (currentCV.personalInfo.summary ? 1 : 0)) /
                            5 *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* AI Assistant Teaser */}
                <div className="mt-6 p-3 bg-linear-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        AI Asistan
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        İçeriğinizi iyileştirmek için AI önerilerini kullanın
                      </p>
                      <Button size="sm" variant="outline" className="text-xs">
                        Önerileri Gör
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">CV Önizleme</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview(false)}
              >
                ✕
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-8">
              <CVPreview cv={currentCV} scale={1} />
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Kapat
              </Button>
              <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                PDF İndir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}