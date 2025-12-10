// components/cv/editor/SettingsEditor.tsx
"use client";

import { useCVStore } from '@/store/cvStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Palette } from 'lucide-react';
import type { TemplateType } from '@/types/cv';

const templateOptions: { value: TemplateType; label: string }[] = [
  { value: 'modern', label: 'Modern' },
  { value: 'classic', label: 'Klasik' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'creative', label: 'Yaratıcı' },
  { value: 'executive', label: 'Yönetici' },
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
            CV'nizin görünümünü özelleştirin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Seçimi */}
          <div className="space-y-2">
            <Label>Template</Label>
            <Select
              value={settings.templateType}
              onValueChange={(value) => updateSettings({ templateType: value as TemplateType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  className={`relative h-12 rounded-lg transition-all ${
                    settings.themeColor === theme.value
                      ? 'ring-2 ring-offset-2 ring-blue-500'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: theme.value }}
                >
                  <span className="sr-only">{theme.name}</span>
                  {settings.themeColor === theme.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Font Boyutu */}
          <div className="space-y-2">
            <Label>Yazı Boyutu</Label>
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
                <SelectItem value="small">Küçük</SelectItem>
                <SelectItem value="medium">Orta</SelectItem>
                <SelectItem value="large">Büyük</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Spacing */}
          <div className="space-y-2">
            <Label>Boşluk</Label>
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
                <SelectItem value="compact">Kompakt</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="relaxed">Rahat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sütun Sayısı */}
          <div className="space-y-2">
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
                <SelectItem value="1">Tek Sütun</SelectItem>
                <SelectItem value="2">İki Sütun</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fotoğraf Göster */}
          <div className="flex items-center justify-between">
            <Label>Fotoğraf Göster</Label>
            <Switch
              checked={settings.showPhoto}
              onCheckedChange={(checked) => updateSettings({ showPhoto: checked })}
            />
          </div>

          {/* Referanslar Göster */}
          <div className="flex items-center justify-between">
            <Label>Referansları Göster</Label>
            <Switch
              checked={settings.showReferences}
              onCheckedChange={(checked) => updateSettings({ showReferences: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// components/cv/preview/CVPreview.tsx
"use client";

import type { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface CVPreviewProps {
  cv: CVData;
  scale?: number;
}

export function CVPreview({ cv, scale = 1 }: CVPreviewProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages, settings } = cv;

  const spacingClass = {
    compact: 'space-y-2',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
  }[settings.spacing];

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[settings.fontSize];

  return (
    <div
      className={`bg-white ${fontSizeClass}`}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: scale !== 1 ? `${100 / scale}%` : '100%',
      }}
    >
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="border-b-4 pb-6 mb-6" style={{ borderColor: settings.themeColor }}>
          <h1 className="text-4xl font-bold mb-2" style={{ color: settings.themeColor }}>
            {personalInfo.fullName}
          </h1>
          <p className="text-2xl text-gray-700 mb-4">{personalInfo.title}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <Github className="h-4 w-4" />
                GitHub
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 className="text-xl font-bold mb-3" style={{ color: settings.themeColor }}>
              Özet
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 className="text-xl font-bold mb-3" style={{ color: settings.themeColor }}>
              İş Deneyimi
            </h2>
            {experiences.map((exp) => (
              <div key={exp.id} className="mb-4">
                <h3 className="text-lg font-semibold">{exp.position}</h3>
                <p className="text-gray-700 font-medium">{exp.company}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {exp.startDate} - {exp.current ? 'Devam Ediyor' : exp.endDate}
                  {exp.location && ` • ${exp.location}`}
                </p>
                {exp.description && <p className="text-gray-700 mb-2">{exp.description}</p>}
                {exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {exp.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exp.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: `${settings.themeColor}20`, color: settings.themeColor }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 className="text-xl font-bold mb-3" style={{ color: settings.themeColor }}>
              Eğitim
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <h3 className="text-lg font-semibold">{edu.degree} • {edu.field}</h3>
                <p className="text-gray-700">{edu.school}</p>
                <p className="text-sm text-gray-600">
                  {edu.startDate} - {edu.current ? 'Devam Ediyor' : edu.endDate}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 className="text-xl font-bold mb-3" style={{ color: settings.themeColor }}>
              Yetenekler
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ backgroundColor: `${settings.themeColor}20`, color: settings.themeColor }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 className="text-xl font-bold mb-3" style={{ color: settings.themeColor }}>
              Projeler
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-4">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-gray-700">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: `${settings.themeColor}20`, color: settings.themeColor }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 className="text-xl font-bold mb-3" style={{ color: settings.themeColor }}>
              Sertifikalar
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <h3 className="font-semibold">{cert.name}</h3>
                <p className="text-gray-700 text-sm">
                  {cert.issuer} • {cert.date}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 className="text-xl font-bold mb-3" style={{ color: settings.themeColor }}>
              Diller
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-gray-600 text-sm">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}