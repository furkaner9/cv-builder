"use client";

import { useCVStore } from '@/store/cvStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Palette, Layout, Type } from 'lucide-react';
import type { TemplateType } from '@/types/cv';

const templateOptions: { value: TemplateType; label: string; description: string }[] = [
  { value: 'modern', label: 'Modern', description: 'İki sütun, renkli sidebar, modern ve dinamik' },
  { value: 'classic', label: 'Klasik', description: 'Tek sütun, geleneksel ve profesyonel' },
  { value: 'minimal', label: 'Minimal', description: 'Sade, temiz çizgiler, bol beyaz alan' },
  { value: 'creative', label: 'Yaratıcı', description: 'Asimetrik, kartlar, cesur ve farklı' },
  { value: 'executive', label: 'Yönetici', description: 'Üst düzey pozisyonlar için premium görünüm' },
];

const colorThemes = [
  { name: 'Mavi', value: '#3B82F6' },
  { name: 'Yeşil', value: '#10B981' },
  { name: 'Mor', value: '#8B5CF6' },
  { name: 'Kırmızı', value: '#EF4444' },
  { name: 'Turuncu', value: '#F59E0B' },
  { name: 'Pembe', value: '#EC4899' },
  { name: 'Lacivert', value: '#1E40AF' },
  { name: 'Gri', value: '#6B7280' },
];

export function SettingsEditor() {
  const { currentCV, updateSettings } = useCVStore();

  if (!currentCV) return null;

  const { settings } = currentCV;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            CV Ayarları
          </CardTitle>
          <CardDescription>
            CV'nizin görünümünü ve düzenini özelleştirin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Seçimi */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Template Seçimi
            </Label>
            
            {/* Template Grid */}
            <div className="grid grid-cols-2 gap-3">
              {templateOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSettings({ templateType: option.value as TemplateType })}
                  className={`relative p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                    settings.templateType === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{option.label}</h3>
                    {settings.templateType === option.value && (
                      <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
            
            <p className="text-xs text-gray-500">
              Seçtiğiniz template sağ taraftaki önizlemede görünecektir
            </p>
          </div>

          {/* Renk Teması */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Renk Teması
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {colorThemes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => updateSettings({ themeColor: theme.value })}
                  className={`relative h-14 rounded-lg transition-all hover:scale-105 ${
                    settings.themeColor === theme.value
                      ? 'ring-2 ring-offset-2 ring-blue-500'
                      : 'border-2 border-gray-200'
                  }`}
                  style={{ backgroundColor: theme.value }}
                  title={theme.name}
                >
                  {settings.themeColor === theme.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <span className="text-gray-800 font-bold">✓</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Başlıklar ve vurgular bu renkle gösterilecek
            </p>
          </div>

          {/* Font Boyutu */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Yazı Boyutu
            </Label>
            <Select
              value={settings.fontSize}
              onValueChange={(value: 'small' | 'medium' | 'large') =>
                updateSettings({ fontSize: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">
                  <div>
                    <div className="font-medium">Küçük</div>
                    <div className="text-xs text-gray-500">Daha fazla içerik sığar</div>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div>
                    <div className="font-medium">Orta</div>
                    <div className="text-xs text-gray-500">Dengeli görünüm</div>
                  </div>
                </SelectItem>
                <SelectItem value="large">
                  <div>
                    <div className="font-medium">Büyük</div>
                    <div className="text-xs text-gray-500">Daha okunaklı</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Spacing */}
          <div className="space-y-3">
            <Label>Boşluk Ayarı</Label>
            <Select
              value={settings.spacing}
              onValueChange={(value: 'compact' | 'normal' | 'relaxed') =>
                updateSettings({ spacing: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">
                  <div>
                    <div className="font-medium">Kompakt</div>
                    <div className="text-xs text-gray-500">Minimum boşluk</div>
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div>
                    <div className="font-medium">Normal</div>
                    <div className="text-xs text-gray-500">Dengeli görünüm</div>
                  </div>
                </SelectItem>
                <SelectItem value="relaxed">
                  <div>
                    <div className="font-medium">Rahat</div>
                    <div className="text-xs text-gray-500">Bol boşluk</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sütun Sayısı */}
          <div className="space-y-3">
            <Label>Düzen</Label>
            <Select
              value={settings.columnsLayout.toString()}
              onValueChange={(value) =>
                updateSettings({ columnsLayout: parseInt(value) as 1 | 2 })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <div>
                    <div className="font-medium">Tek Sütun</div>
                    <div className="text-xs text-gray-500">Klasik düzen</div>
                  </div>
                </SelectItem>
                <SelectItem value="2">
                  <div>
                    <div className="font-medium">İki Sütun</div>
                    <div className="text-xs text-gray-500">Modern görünüm</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Görünüm Ayarları */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-sm">Görünüm Ayarları</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showPhoto">Fotoğraf Göster</Label>
                <p className="text-xs text-gray-500">CV'nizde profil fotoğrafı göster</p>
              </div>
              <Switch
                id="showPhoto"
                checked={settings.showPhoto}
                onCheckedChange={(checked) => updateSettings({ showPhoto: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showReferences">Referansları Göster</Label>
                <p className="text-xs text-gray-500">Referans kişilerini CV'de göster</p>
              </div>
              <Switch
                id="showReferences"
                checked={settings.showReferences}
                onCheckedChange={(checked) => updateSettings({ showReferences: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Önizleme Bilgisi */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-amber-900 mb-2">
          👁️ Önizleme
        </h4>
        <p className="text-sm text-amber-800">
          Yaptığınız değişiklikleri sağ taraftaki önizleme panelinden veya tam ekran önizlemeden görebilirsiniz.
        </p>
      </div>
    </div>
  );
}