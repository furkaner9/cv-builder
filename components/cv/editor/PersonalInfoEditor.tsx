"use client";

import { useCVStore } from '@/store/cvStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export function PersonalInfoEditor() {
  const { currentCV, updatePersonalInfo } = useCVStore();

  if (!currentCV) return null;

  const { personalInfo } = currentCV;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Kişisel Bilgiler
        </CardTitle>
        <CardDescription>
          CV'nizde görünecek temel bilgilerinizi girin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Ad Soyad <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={personalInfo.fullName}
              onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
              placeholder="Ahmet Yılmaz"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Ünvan / Pozisyon <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={personalInfo.title}
              onChange={(e) => updatePersonalInfo({ title: e.target.value })}
              placeholder="Senior Yazılım Geliştirici"
              className="w-full"
            />
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
            İletişim Bilgileri
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                E-posta
              </Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                placeholder="ahmet@ornek.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                Telefon
              </Label>
              <Input
                id="phone"
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                placeholder="+90 555 123 45 67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Konum
              </Label>
              <Input
                id="location"
                value={personalInfo.location}
                onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                placeholder="İstanbul, Türkiye"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                Website
              </Label>
              <Input
                id="website"
                type="url"
                value={personalInfo.website || ''}
                onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                placeholder="https://website.com"
              />
            </div>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
            Sosyal Medya
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-sm font-medium flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-gray-500" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                type="url"
                value={personalInfo.linkedin || ''}
                onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/kullanici-adi"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github" className="text-sm font-medium flex items-center gap-2">
                <Github className="h-4 w-4 text-gray-500" />
                GitHub
              </Label>
              <Input
                id="github"
                type="url"
                value={personalInfo.github || ''}
                onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                placeholder="https://github.com/kullanici-adi"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="portfolio" className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                Portfolio
              </Label>
              <Input
                id="portfolio"
                type="url"
                value={personalInfo.portfolio || ''}
                onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
                placeholder="https://portfolio.com"
              />
            </div>
          </div>
        </div>

        {/* Profesyonel Özet */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 flex-1">
              Profesyonel Özet
            </h3>
            <span className="text-xs text-gray-500">
              {personalInfo.summary.length}/500
            </span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-sm font-medium">
              Kendinizi kısaca tanıtın <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="summary"
              value={personalInfo.summary}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  updatePersonalInfo({ summary: e.target.value });
                }
              }}
              placeholder="Örnek: 5+ yıl deneyime sahip, full-stack web geliştirme konusunda uzmanlaşmış yazılım mühendisi. React, Node.js ve cloud teknolojileri ile ölçeklenebilir uygulamalar geliştirme konusunda deneyimli..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              İpucu: Özetinizde temel yetkinliklerinizi, deneyim alanınızı ve kariyer hedeflerinizi vurgulayın.
            </p>
          </div>
        </div>

        {/* Yardımcı Bilgi */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💡 İpuçları
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Profesyonel bir e-posta adresi kullanın</li>
            <li>LinkedIn profilinizi güncel tutun</li>
            <li>Özetinizi pozisyona göre özelleştirin</li>
            <li>Ölçülebilir başarılarınızı vurgulayın</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}