"use client";

import { useCVStore } from '@/store/cvStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages as LanguagesIcon, Plus, Trash2 } from 'lucide-react';
import type { Language, LanguageProficiency } from '@/types/cv';

const generateId = () => Math.random().toString(36).substr(2, 9);

const proficiencyLabels: Record<LanguageProficiency, string> = {
  basic: 'Temel',
  conversational: 'Günlük Konuşma',
  professional: 'Profesyonel',
  native: 'Ana Dil',
};

export function LanguagesEditor() {
  const { currentCV, addLanguage, updateLanguage, deleteLanguage } = useCVStore();

  if (!currentCV) return null;

  const handleAddLanguage = () => {
    const newLang: Language = {
      id: generateId(),
      name: '',
      proficiency: 'conversational',
    };
    addLanguage(newLang);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LanguagesIcon className="h-5 w-5" />
            Diller
          </CardTitle>
          <CardDescription>
            Bildiğiniz dilleri ve seviyenizi ekleyin
          </CardDescription>
        </CardHeader>
      </Card>

      {currentCV.languages.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <LanguagesIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Henüz dil eklenmedi
              </h3>
              <p className="text-gray-600 mb-6">
                İlk dilinizi ekleyerek başlayın
              </p>
              <Button onClick={handleAddLanguage}>
                <Plus className="mr-2 h-4 w-4" />
                Dil Ekle
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {currentCV.languages.map((lang) => (
                  <div key={lang.id} className="flex items-end gap-3">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`lang-name-${lang.id}`}>Dil</Label>
                      <Input
                        id={`lang-name-${lang.id}`}
                        value={lang.name}
                        onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                        placeholder="İngilizce, Almanca, Fransızca..."
                      />
                    </div>

                    <div className="w-48 space-y-2">
                      <Label htmlFor={`lang-proficiency-${lang.id}`}>Seviye</Label>
                      <Select
                        value={lang.proficiency}
                        onValueChange={(value) =>
                          updateLanguage(lang.id, { proficiency: value as LanguageProficiency })
                        }
                      >
                        <SelectTrigger id={`lang-proficiency-${lang.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(proficiencyLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Bu dili silmek istediğinizden emin misiniz?')) {
                          deleteLanguage(lang.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleAddLanguage} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Dil Ekle
          </Button>
        </>
      )}

      {/* Yardımcı Bilgi */}
      {currentCV.languages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💡 İpuçları
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Seviyenizi dürüstçe belirtin</li>
            <li>İş ilanındaki dil gereksinimlerine dikkat edin</li>
            <li>Sertifikalarınız varsa (TOEFL, IELTS vb.) sertifikalar bölümüne ekleyin</li>
            <li>Ana dilinizi mutlaka belirtin</li>
          </ul>
        </div>
      )}
    </div>
  );
}