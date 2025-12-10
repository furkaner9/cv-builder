"use client";

import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import type { Education } from '@/types/cv';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function EducationEditor() {
  const { currentCV, addEducation, updateEducation, deleteEducation } = useCVStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!currentCV) return null;

  const handleAddEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      school: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      achievements: [],
    };
    addEducation(newEducation);
    setExpandedId(newEducation.id);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Eğitim
          </CardTitle>
          <CardDescription>
            Eğitim geçmişinizi ekleyin. En son eğitiminizle başlayın.
          </CardDescription>
        </CardHeader>
      </Card>

      {currentCV.education.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Henüz eğitim eklenmedi
              </h3>
              <p className="text-gray-600 mb-6">
                İlk eğitim bilginizi ekleyerek başlayın
              </p>
              <Button onClick={handleAddEducation}>
                <Plus className="mr-2 h-4 w-4" />
                İlk Eğitimi Ekle
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {currentCV.education.map((edu) => (
            <Card key={edu.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {edu.degree || 'Yeni Eğitim'} {edu.field && `• ${edu.field}`}
                    </CardTitle>
                    <CardDescription>
                      {edu.school}
                      {edu.startDate && (
                        <> • {edu.startDate} - {edu.current ? 'Devam Ediyor' : edu.endDate}</>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
                    >
                      {expandedId === edu.id ? 'Kapat' : 'Düzenle'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Bu eğitimi silmek istediğinizden emin misiniz?')) {
                          deleteEducation(edu.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedId === edu.id && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`school-${edu.id}`}>
                        Okul/Üniversite <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`school-${edu.id}`}
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                        placeholder="İstanbul Teknik Üniversitesi"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`degree-${edu.id}`}>
                        Derece <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`degree-${edu.id}`}
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder="Lisans"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`field-${edu.id}`}>
                        Bölüm <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`field-${edu.id}`}
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                        placeholder="Bilgisayar Mühendisliği"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`location-${edu.id}`}>Konum</Label>
                      <Input
                        id={`location-${edu.id}`}
                        value={edu.location || ''}
                        onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                        placeholder="İstanbul, Türkiye"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`gpa-${edu.id}`}>GPA / Not Ortalaması</Label>
                      <Input
                        id={`gpa-${edu.id}`}
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                        placeholder="3.45/4.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`startDate-${edu.id}`}>
                        Başlangıç Yılı <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`startDate-${edu.id}`}
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                        placeholder="2015"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Halen okuyorum</Label>
                        <Switch
                          checked={edu.current}
                          onCheckedChange={(checked) => {
                            updateEducation(edu.id, {
                              current: checked,
                              endDate: checked ? '' : edu.endDate,
                            });
                          }}
                        />
                      </div>
                    </div>

                    {!edu.current && (
                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${edu.id}`}>Mezuniyet Yılı</Label>
                        <Input
                          id={`endDate-${edu.id}`}
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                          placeholder="2019"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          <Button onClick={handleAddEducation} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Eğitim Ekle
          </Button>
        </>
      )}
    </div>
  );
}