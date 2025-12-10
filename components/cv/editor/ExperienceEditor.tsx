"use client";

import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, Trash2, GripVertical, X } from 'lucide-react';
import type { Experience } from '@/types/cv';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function ExperienceEditor() {
  const { currentCV, addExperience, updateExperience, deleteExperience } = useCVStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!currentCV) return null;

  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: [],
      technologies: [],
    };
    addExperience(newExperience);
    setExpandedId(newExperience.id);
  };

  const handleAddHighlight = (expId: string) => {
    const exp = currentCV.experiences.find((e) => e.id === expId);
    if (exp) {
      updateExperience(expId, {
        highlights: [...exp.highlights, ''],
      });
    }
  };

  const handleUpdateHighlight = (expId: string, index: number, value: string) => {
    const exp = currentCV.experiences.find((e) => e.id === expId);
    if (exp) {
      const newHighlights = [...exp.highlights];
      newHighlights[index] = value;
      updateExperience(expId, { highlights: newHighlights });
    }
  };

  const handleRemoveHighlight = (expId: string, index: number) => {
    const exp = currentCV.experiences.find((e) => e.id === expId);
    if (exp) {
      const newHighlights = exp.highlights.filter((_, i) => i !== index);
      updateExperience(expId, { highlights: newHighlights });
    }
  };

  const handleAddTechnology = (expId: string, tech: string) => {
    const exp = currentCV.experiences.find((e) => e.id === expId);
    if (exp && tech.trim()) {
      updateExperience(expId, {
        technologies: [...(exp.technologies || []), tech.trim()],
      });
    }
  };

  const handleRemoveTechnology = (expId: string, index: number) => {
    const exp = currentCV.experiences.find((e) => e.id === expId);
    if (exp && exp.technologies) {
      const newTech = exp.technologies.filter((_, i) => i !== index);
      updateExperience(expId, { technologies: newTech });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            İş Deneyimi
          </CardTitle>
          <CardDescription>
            Profesyonel iş deneyimlerinizi ekleyin. En son deneyiminizle başlayın.
          </CardDescription>
        </CardHeader>
      </Card>

      {currentCV.experiences.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Henüz deneyim eklenmedi
              </h3>
              <p className="text-gray-600 mb-6">
                İlk iş deneyiminizi ekleyerek başlayın
              </p>
              <Button onClick={handleAddExperience}>
                <Plus className="mr-2 h-4 w-4" />
                İlk Deneyimi Ekle
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {currentCV.experiences.map((exp, index) => (
            <Card key={exp.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        {exp.position || 'Yeni Deneyim'} 
                        {exp.company && ` • ${exp.company}`}
                      </CardTitle>
                      <CardDescription>
                        {exp.startDate && (
                          <>
                            {exp.startDate} - {exp.current ? 'Devam Ediyor' : exp.endDate}
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                    >
                      {expandedId === exp.id ? 'Kapat' : 'Düzenle'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Bu deneyimi silmek istediğinizden emin misiniz?')) {
                          deleteExperience(exp.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedId === exp.id && (
                <CardContent className="space-y-6">
                  {/* Temel Bilgiler */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`company-${exp.id}`}>
                        Şirket Adı <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`company-${exp.id}`}
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        placeholder="ABC Teknoloji"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`position-${exp.id}`}>
                        Pozisyon <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`position-${exp.id}`}
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                        placeholder="Senior Software Engineer"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`location-${exp.id}`}>Konum</Label>
                      <Input
                        id={`location-${exp.id}`}
                        value={exp.location || ''}
                        onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                        placeholder="İstanbul, Türkiye"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Halen çalışıyorum</Label>
                        <Switch
                          checked={exp.current}
                          onCheckedChange={(checked) => {
                            updateExperience(exp.id, {
                              current: checked,
                              endDate: checked ? 'present' : '',
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`startDate-${exp.id}`}>
                        Başlangıç Tarihi <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`startDate-${exp.id}`}
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        placeholder="Ocak 2020"
                      />
                    </div>

                    {!exp.current && (
                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${exp.id}`}>Bitiş Tarihi</Label>
                        <Input
                          id={`endDate-${exp.id}`}
                          value={exp.endDate === 'present' ? '' : exp.endDate}
                          onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                          placeholder="Aralık 2023"
                        />
                      </div>
                    )}
                  </div>

                  {/* Açıklama */}
                  <div className="space-y-2">
                    <Label htmlFor={`description-${exp.id}`}>
                      Genel Açıklama
                    </Label>
                    <Textarea
                      id={`description-${exp.id}`}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                      placeholder="Rolünüzü ve sorumluluklarınızı kısaca açıklayın..."
                      rows={3}
                    />
                  </div>

                  {/* Önemli Başarılar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Önemli Başarılar & Sorumluluklar</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddHighlight(exp.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ekle
                      </Button>
                    </div>
                    
                    {exp.highlights.map((highlight, hIndex) => (
                      <div key={hIndex} className="flex gap-2">
                        <span className="text-gray-400 mt-3">•</span>
                        <Textarea
                          value={highlight}
                          onChange={(e) => handleUpdateHighlight(exp.id, hIndex, e.target.value)}
                          placeholder="Başarılarınızı rakamlarla destekleyin. Örn: Performansı %30 artırdım..."
                          rows={2}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveHighlight(exp.id, hIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {exp.highlights.length === 0 && (
                      <p className="text-sm text-gray-500 italic">
                        Henüz başarı eklenmedi. "Ekle" butonuna tıklayarak başlayın.
                      </p>
                    )}
                  </div>

                  {/* Teknolojiler */}
                  <div className="space-y-3">
                    <Label>Kullanılan Teknolojiler</Label>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies?.map((tech, tIndex) => (
                        <Badge key={tIndex} variant="secondary" className="gap-1">
                          {tech}
                          <button
                            onClick={() => handleRemoveTechnology(exp.id, tIndex)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      <Input
                        placeholder="Teknoloji ekle (Enter ile)"
                        className="w-40"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            handleAddTechnology(exp.id, input.value);
                            input.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          <Button onClick={handleAddExperience} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Deneyim Ekle
          </Button>
        </>
      )}
    </div>
  );
}