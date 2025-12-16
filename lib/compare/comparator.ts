// lib/compare/comparator.ts - CV Karşılaştırma Fonksiyonları

import type { CVData } from '@/types/cv';

export interface ComparisonMetrics {
  experienceCount: number;
  educationCount: number;
  skillsCount: number;
  projectsCount: number;
  certificationsCount: number;
  languagesCount: number;
  totalWords: number;
  hasPhoto: boolean;
  hasSummary: boolean;
  summaryLength: number;
  contactComplete: boolean;
}

export interface SectionComparison {
  field: string;
  cv1Value: any;
  cv2Value: any;
  isDifferent: boolean;
  type: 'better' | 'worse' | 'equal' | 'different';
}

export interface CVComparison {
  cv1: {
    title: string;
    metrics: ComparisonMetrics;
    strengths: string[];
    weaknesses: string[];
  };
  cv2: {
    title: string;
    metrics: ComparisonMetrics;
    strengths: string[];
    weaknesses: string[];
  };
  differences: SectionComparison[];
  recommendations: string[];
  winner: 'cv1' | 'cv2' | 'tie';
  score: {
    cv1: number;
    cv2: number;
  };
}

// CV metriklerini hesapla
export function calculateMetrics(cv: CVData): ComparisonMetrics {
  const totalWords = [
    cv.personalInfo.summary,
    ...cv.experiences.map(e => e.description),
    ...cv.education.map(e => e.description || ''),
    ...cv.projects.map(p => p.description),
  ].join(' ').split(/\s+/).filter(w => w.length > 0).length;

  return {
    experienceCount: cv.experiences.length,
    educationCount: cv.education.length,
    skillsCount: cv.skills.length,
    projectsCount: cv.projects.length,
    certificationsCount: cv.certifications.length,
    languagesCount: cv.languages.length,
    totalWords,
    hasPhoto: !!cv.personalInfo.photo,
    hasSummary: cv.personalInfo.summary.length > 50,
    summaryLength: cv.personalInfo.summary.length,
    contactComplete: !!(
      cv.personalInfo.email &&
      cv.personalInfo.phone &&
      cv.personalInfo.location
    ),
  };
}

// İki metrİk karşılaştır
function compareMetrics(m1: ComparisonMetrics, m2: ComparisonMetrics): SectionComparison[] {
  const comparisons: SectionComparison[] = [];

  const numericFields = [
    { key: 'experienceCount', label: 'İş Deneyimi Sayısı' },
    { key: 'educationCount', label: 'Eğitim Sayısı' },
    { key: 'skillsCount', label: 'Yetenek Sayısı' },
    { key: 'projectsCount', label: 'Proje Sayısı' },
    { key: 'certificationsCount', label: 'Sertifika Sayısı' },
    { key: 'languagesCount', label: 'Dil Sayısı' },
    { key: 'totalWords', label: 'Toplam Kelime' },
    { key: 'summaryLength', label: 'Özet Uzunluğu' },
  ];

  numericFields.forEach(({ key, label }) => {
    const v1 = (m1 as any)[key];
    const v2 = (m2 as any)[key];
    
    comparisons.push({
      field: label,
      cv1Value: v1,
      cv2Value: v2,
      isDifferent: v1 !== v2,
      type: v1 > v2 ? 'better' : v1 < v2 ? 'worse' : 'equal',
    });
  });

  // Boolean alanlar
  comparisons.push({
    field: 'Fotoğraf',
    cv1Value: m1.hasPhoto ? 'Var' : 'Yok',
    cv2Value: m2.hasPhoto ? 'Var' : 'Yok',
    isDifferent: m1.hasPhoto !== m2.hasPhoto,
    type: m1.hasPhoto === m2.hasPhoto ? 'equal' : 'different',
  });

  comparisons.push({
    field: 'Özet Bölümü',
    cv1Value: m1.hasSummary ? 'Var' : 'Yok',
    cv2Value: m2.hasSummary ? 'Var' : 'Yok',
    isDifferent: m1.hasSummary !== m2.hasSummary,
    type: m1.hasSummary === m2.hasSummary ? 'equal' : 'different',
  });

  comparisons.push({
    field: 'İletişim Bilgileri',
    cv1Value: m1.contactComplete ? 'Tam' : 'Eksik',
    cv2Value: m2.contactComplete ? 'Tam' : 'Eksik',
    isDifferent: m1.contactComplete !== m2.contactComplete,
    type: m1.contactComplete === m2.contactComplete ? 'equal' : 'different',
  });

  return comparisons;
}

// Güçlü yönleri tespit et
function identifyStrengths(cv: CVData, metrics: ComparisonMetrics): string[] {
  const strengths: string[] = [];

  if (metrics.experienceCount >= 3) {
    strengths.push('Zengin iş deneyimi');
  }

  if (metrics.skillsCount >= 10) {
    strengths.push('Geniş yetenek havuzu');
  }

  if (metrics.projectsCount >= 3) {
    strengths.push('Güçlü proje portföyü');
  }

  if (metrics.certificationsCount >= 2) {
    strengths.push('Profesyonel sertifikalar');
  }

  if (metrics.summaryLength >= 150) {
    strengths.push('Detaylı özet bölümü');
  }

  if (metrics.contactComplete) {
    strengths.push('Eksiksiz iletişim bilgileri');
  }

  if (cv.personalInfo.linkedin || cv.personalInfo.github) {
    strengths.push('Sosyal profil bağlantıları');
  }

  // Deneyim detayı kontrolü
  const detailedExperiences = cv.experiences.filter(
    e => e.description.length > 100 && e.highlights.length > 2
  );
  if (detailedExperiences.length >= 2) {
    strengths.push('Detaylı iş tanımları');
  }

  // Teknoloji kullanımı
  const techExperiences = cv.experiences.filter(
    e => e.technologies && e.technologies.length > 0
  );
  if (techExperiences.length >= 2) {
    strengths.push('Teknoloji stack belirtilmiş');
  }

  return strengths;
}

// Zayıf yönleri tespit et
function identifyWeaknesses(cv: CVData, metrics: ComparisonMetrics): string[] {
  const weaknesses: string[] = [];

  if (metrics.experienceCount === 0) {
    weaknesses.push('İş deneyimi yok');
  } else if (metrics.experienceCount < 2) {
    weaknesses.push('Sınırlı iş deneyimi');
  }

  if (metrics.skillsCount < 5) {
    weaknesses.push('Az sayıda yetenek');
  }

  if (metrics.projectsCount === 0) {
    weaknesses.push('Proje eksikliği');
  }

  if (!metrics.hasSummary) {
    weaknesses.push('Özet bölümü yok');
  } else if (metrics.summaryLength < 100) {
    weaknesses.push('Özet çok kısa');
  }

  if (!metrics.contactComplete) {
    weaknesses.push('Eksik iletişim bilgileri');
  }

  if (!cv.personalInfo.linkedin && !cv.personalInfo.github) {
    weaknesses.push('Sosyal profil bağlantısı yok');
  }

  if (metrics.certificationsCount === 0) {
    weaknesses.push('Sertifika yok');
  }

  if (metrics.languagesCount === 0) {
    weaknesses.push('Dil bilgisi belirtilmemiş');
  }

  // Deneyim kalitesi
  const weakExperiences = cv.experiences.filter(
    e => e.description.length < 50 || e.highlights.length === 0
  );
  if (weakExperiences.length > 0) {
    weaknesses.push('Bazı deneyimler yetersiz detaylı');
  }

  return weaknesses;
}

// CV skoru hesapla
function calculateCVScore(cv: CVData, metrics: ComparisonMetrics): number {
  let score = 0;

  // İş deneyimi (25 puan)
  score += Math.min(25, metrics.experienceCount * 8);

  // Eğitim (15 puan)
  score += Math.min(15, metrics.educationCount * 7.5);

  // Yetenekler (20 puan)
  score += Math.min(20, metrics.skillsCount * 2);

  // Projeler (15 puan)
  score += Math.min(15, metrics.projectsCount * 5);

  // Sertifikalar (10 puan)
  score += Math.min(10, metrics.certificationsCount * 5);

  // Özet (5 puan)
  if (metrics.hasSummary) {
    score += Math.min(5, metrics.summaryLength / 30);
  }

  // İletişim bilgileri (5 puan)
  if (metrics.contactComplete) score += 5;

  // Sosyal profiller (5 puan)
  if (cv.personalInfo.linkedin) score += 2.5;
  if (cv.personalInfo.github) score += 2.5;

  return Math.round(Math.min(100, score));
}

// Öneriler üret
function generateRecommendations(
  cv1: CVData,
  cv2: CVData,
  metrics1: ComparisonMetrics,
  metrics2: ComparisonMetrics
): string[] {
  const recommendations: string[] = [];

  // Deneyim karşılaştırması
  if (metrics1.experienceCount > metrics2.experienceCount) {
    recommendations.push(`CV2'ye daha fazla iş deneyimi ekleyin (${metrics1.experienceCount - metrics2.experienceCount} eksik)`);
  } else if (metrics2.experienceCount > metrics1.experienceCount) {
    recommendations.push(`CV1'e daha fazla iş deneyimi ekleyin (${metrics2.experienceCount - metrics1.experienceCount} eksik)`);
  }

  // Yetenek karşılaştırması
  if (Math.abs(metrics1.skillsCount - metrics2.skillsCount) >= 5) {
    const lower = metrics1.skillsCount < metrics2.skillsCount ? 'CV1' : 'CV2';
    const diff = Math.abs(metrics1.skillsCount - metrics2.skillsCount);
    recommendations.push(`${lower}'de daha fazla yetenek ekleyin (${diff} eksik)`);
  }

  // Proje karşılaştırması
  if (metrics1.projectsCount === 0 && metrics2.projectsCount > 0) {
    recommendations.push('CV1\'e projeler ekleyin');
  } else if (metrics2.projectsCount === 0 && metrics1.projectsCount > 0) {
    recommendations.push('CV2\'ye projeler ekleyin');
  }

  // Özet kontrolü
  if (!metrics1.hasSummary && metrics2.hasSummary) {
    recommendations.push('CV1\'e özet bölümü ekleyin');
  } else if (!metrics2.hasSummary && metrics1.hasSummary) {
    recommendations.push('CV2\'ye özet bölümü ekleyin');
  }

  // Sertifika karşılaştırması
  if (metrics1.certificationsCount > metrics2.certificationsCount + 1) {
    recommendations.push('CV2\'ye sertifikalar ekleyin');
  } else if (metrics2.certificationsCount > metrics1.certificationsCount + 1) {
    recommendations.push('CV1\'e sertifikalar ekleyin');
  }

  // Genel öneriler
  if (metrics1.totalWords < 500) {
    recommendations.push('CV1\'i daha detaylı hale getirin');
  }
  if (metrics2.totalWords < 500) {
    recommendations.push('CV2\'yi daha detaylı hale getirin');
  }

  return recommendations.length > 0 
    ? recommendations 
    : ['Her iki CV de dengeli görünüyor, küçük iyileştirmelerle devam edin'];
}

// Ana karşılaştırma fonksiyonu
export function compareCVs(cv1: CVData, cv2: CVData): CVComparison {
  const metrics1 = calculateMetrics(cv1);
  const metrics2 = calculateMetrics(cv2);

  const score1 = calculateCVScore(cv1, metrics1);
  const score2 = calculateCVScore(cv2, metrics2);

  const differences = compareMetrics(metrics1, metrics2);

  const strengths1 = identifyStrengths(cv1, metrics1);
  const weaknesses1 = identifyWeaknesses(cv1, metrics1);

  const strengths2 = identifyStrengths(cv2, metrics2);
  const weaknesses2 = identifyWeaknesses(cv2, metrics2);

  const recommendations = generateRecommendations(cv1, cv2, metrics1, metrics2);

  const winner = score1 > score2 ? 'cv1' : score2 > score1 ? 'cv2' : 'tie';

  return {
    cv1: {
      title: cv1.title,
      metrics: metrics1,
      strengths: strengths1,
      weaknesses: weaknesses1,
    },
    cv2: {
      title: cv2.title,
      metrics: metrics2,
      strengths: strengths2,
      weaknesses: weaknesses2,
    },
    differences,
    recommendations,
    winner,
    score: {
      cv1: score1,
      cv2: score2,
    },
  };
}

// Yüzdesel fark hesapla
export function calculatePercentageDiff(value1: number, value2: number): number {
  if (value2 === 0) return value1 > 0 ? 100 : 0;
  return Math.round(((value1 - value2) / value2) * 100);
}