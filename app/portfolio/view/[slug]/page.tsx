"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Download,
  Eye,
  Lock,
  Share2,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe as GlobeIcon,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  FileText,
  Languages,
} from 'lucide-react';
import type { CVData } from '@/types/cv';
import type { OnlinePortfolio } from '@/types/portfolio';

export default function PublicPortfolioPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [portfolio, setPortfolio] = useState<OnlinePortfolio | null>(null);
  const [cv, setCV] = useState<CVData | null>(null);
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Portfolio ve CV verilerini yükle (gerçek uygulamada API'den gelir)
    // Şimdilik demo için localStorage'dan alalım
    const allCVs = JSON.parse(localStorage.getItem('cv-storage') || '{"cvList":[]}');

    // Tüm portfolio'ları tara
    let foundPortfolio: OnlinePortfolio | null = null;
    let foundCV: CVData | null = null;

    allCVs.cvList.forEach((cvItem: CVData) => {
      const portfolioData = localStorage.getItem(`portfolio-${cvItem.id}`);
      if (portfolioData) {
        const p: OnlinePortfolio = JSON.parse(portfolioData);
        if (p.slug === slug) {
          foundPortfolio = p;
          foundCV = cvItem;
        }
      }
    });

    if (foundPortfolio && foundCV) {
      setPortfolio(foundPortfolio);

      // Şifre koruması kontrolü
      if (!(foundPortfolio as OnlinePortfolio).passwordProtected) {
        setCV(foundCV);
        setIsUnlocked(true);
        incrementViewCount(foundPortfolio);
      }
    }
  }, [slug]);

  const incrementViewCount = (p: OnlinePortfolio) => {
    // View count artır
    const updated = {
      ...p,
      viewCount: p.viewCount + 1,
      uniqueVisitors: p.uniqueVisitors + 1,
      lastViewedAt: new Date(),
    };
    localStorage.setItem(`portfolio-${p.cvId}`, JSON.stringify(updated));
  };

  const handlePasswordSubmit = () => {
    if (!portfolio) return;

    if (password === portfolio.password) {
      setIsUnlocked(true);
      setError('');

      // CV'yi yükle
      const allCVs = JSON.parse(localStorage.getItem('cv-storage') || '{"cvList":[]}');
      const foundCV = allCVs.cvList.find((c: CVData) => c.id === portfolio.cvId);
      if (foundCV) {
        setCV(foundCV);
        incrementViewCount(portfolio);
      }
    } else {
      setError('Yanlış şifre');
    }
  };

  const handleDownload = () => {
    if (!portfolio) return;

    // Download count artır
    const updated = {
      ...portfolio,
      downloadCount: portfolio.downloadCount + 1,
    };
    localStorage.setItem(`portfolio-${portfolio.cvId}`, JSON.stringify(updated));

    // PDF indirme işlemi (gerçek uygulamada)
    alert('PDF indirme özelliği yakında eklenecek');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: cv?.personalInfo.fullName || 'CV',
          text: 'CV\'mi görüntüleyin',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  // Loading
  if (!portfolio) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Portfolio yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Portfolio kapalı
  if (!portfolio.isActive) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Portfolio Erişime Kapalı</h2>
            <p className="text-gray-600">
              Bu portfolio şu anda görüntülenemiyor.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Şifre korumalı ve henüz açılmamış
  if (portfolio.passwordProtected && !isUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-purple-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <Lock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Şifre Korumalı Portfolio</h2>
              <p className="text-gray-600">
                Bu portfolio'yu görüntülemek için şifre gerekiyor
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Şifre girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              <Button
                onClick={handlePasswordSubmit}
                className="w-full"
              >
                Devam Et
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CV görüntüleme
  if (!cv) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">CV bulunamadı</p>
      </div>
    );
  }

  const isDark = portfolio.theme === 'dark' ||
    (portfolio.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-50 shadow-sm`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              {portfolio.showViewCount && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{portfolio.viewCount}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Paylaş
              </Button>

              {portfolio.allowDownload && (
                <Button
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  İndir
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8 pb-8 border-b">
              <h1 className="text-4xl font-bold mb-2">{cv.personalInfo.fullName}</h1>
              <p className="text-xl text-gray-600 mb-4">{cv.personalInfo.title}</p>

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                {cv.personalInfo.email && (
                  <a href={`mailto:${cv.personalInfo.email}`} className="flex items-center gap-2 hover:text-blue-600">
                    <Mail className="w-4 h-4" />
                    {cv.personalInfo.email}
                  </a>
                )}
                {cv.personalInfo.phone && (
                  <a href={`tel:${cv.personalInfo.phone}`} className="flex items-center gap-2 hover:text-blue-600">
                    <Phone className="w-4 h-4" />
                    {cv.personalInfo.phone}
                  </a>
                )}
                {cv.personalInfo.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {cv.personalInfo.location}
                  </span>
                )}
              </div>

              <div className="flex justify-center gap-3 mt-4">
                {cv.personalInfo.linkedin && (
                  <a href={cv.personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </a>
                )}
                {cv.personalInfo.github && (
                  <a href={cv.personalInfo.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <Github className="w-4 h-4" />
                    </Button>
                  </a>
                )}
                {cv.personalInfo.website && (
                  <a href={cv.personalInfo.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <GlobeIcon className="w-4 h-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Summary */}
            {cv.personalInfo.summary && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Hakkımda
                </h2>
                <p className="text-gray-600 leading-relaxed">{cv.personalInfo.summary}</p>
              </div>
            )}

            {/* Experience */}
            {cv.experiences.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  İş Deneyimi
                </h2>
                <div className="space-y-6">
                  {cv.experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-8 border-l-2 border-blue-600">
                      <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-[9px] top-0"></div>
                      <h3 className="text-xl font-semibold">{exp.position}</h3>
                      <p className="text-gray-600 mb-2">{exp.company}</p>
                      <p className="text-sm text-gray-500 mb-3">
                        {exp.startDate} - {exp.current ? 'Devam Ediyor' : exp.endDate}
                      </p>
                      {exp.description && (
                        <p className="text-gray-700 mb-3">{exp.description}</p>
                      )}
                      {exp.highlights.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {exp.highlights.map((h, idx) => (
                            <li key={idx}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cv.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Eğitim
                </h2>
                <div className="space-y-4">
                  {cv.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="text-xl font-semibold">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.school}</p>
                      <p className="text-sm text-gray-500">
                        {edu.startDate} - {edu.current ? 'Devam Ediyor' : edu.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {cv.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Yetenekler
                </h2>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {cv.projects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Projeler
                </h2>
                <div className="space-y-4">
                  {cv.projects.map((project) => (
                    <div key={project.id}>
                      <h3 className="text-xl font-semibold">{project.name}</h3>
                      <p className="text-gray-700 mb-2">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-gray-200 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {cv.languages.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Diller
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {cv.languages.map((lang) => (
                    <div key={lang.id}>
                      <span className="font-semibold">{lang.name}:</span> {lang.proficiency}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Bu portfolio <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-blue-800 to-gray-900">
            CVim
          </span> ile oluşturuldu</p>
        </div>
      </div>
    </div>
  );
}