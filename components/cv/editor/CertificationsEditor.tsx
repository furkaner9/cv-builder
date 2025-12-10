"use client";

import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Award, Plus, Trash2 } from 'lucide-react';
import type { Certification } from '@/types/cv';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function CertificationsEditor() {
  const { currentCV, addCertification, updateCertification, deleteCertification } = useCVStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!currentCV) return null;

  const handleAddCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    };
    addCertification(newCert);
    setExpandedId(newCert.id);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Sertifikalar
          </CardTitle>
          <CardDescription>
            Profesyonel sertifikalarınızı ekleyin
          </CardDescription>
        </CardHeader>
      </Card>

      {currentCV.certifications.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Henüz sertifika eklenmedi
              </h3>
              <Button onClick={handleAddCertification}>
                <Plus className="mr-2 h-4 w-4" />
                Sertifika Ekle
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {currentCV.certifications.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {cert.name || 'Yeni Sertifika'}
                    </CardTitle>
                    <CardDescription>
                      {cert.issuer} {cert.date && `• ${cert.date}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
                    >
                      {expandedId === cert.id ? 'Kapat' : 'Düzenle'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Bu sertifikayı silmek istediğinizden emin misiniz?')) {
                          deleteCertification(cert.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedId === cert.id && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`name-${cert.id}`}>
                        Sertifika Adı <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`name-${cert.id}`}
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                        placeholder="AWS Certified Solutions Architect"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`issuer-${cert.id}`}>
                        Veren Kurum <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`issuer-${cert.id}`}
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                        placeholder="Amazon Web Services"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`date-${cert.id}`}>Alınma Tarihi</Label>
                      <Input
                        id={`date-${cert.id}`}
                        value={cert.date}
                        onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                        placeholder="Ocak 2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`credentialId-${cert.id}`}>Sertifika ID</Label>
                      <Input
                        id={`credentialId-${cert.id}`}
                        value={cert.credentialId || ''}
                        onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                        placeholder="ABC123XYZ"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`expiryDate-${cert.id}`}>Geçerlilik Tarihi</Label>
                      <Input
                        id={`expiryDate-${cert.id}`}
                        value={cert.expiryDate || ''}
                        onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                        placeholder="Ocak 2027"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`url-${cert.id}`}>Sertifika URL'si</Label>
                      <Input
                        id={`url-${cert.id}`}
                        type="url"
                        value={cert.url || ''}
                        onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                        placeholder="https://credentials.example.com/..."
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          <Button onClick={handleAddCertification} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Sertifika Ekle
          </Button>
        </>
      )}
    </div>
  );
}