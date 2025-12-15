// lib/ats/analyzer.ts - ATS Analiz Fonksiyonları

import type { CVData } from '@/types/cv';

export interface KeywordAnalysis {
  matched: string[];
  missing: string[];
  matchRate: number;
  totalJobKeywords: number;
  topMissingKeywords: string[];
}

export interface StructureAnalysis {
  sections: {
    contact: boolean;
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
  };
  missing: string[];
  completeness: number;
}

export interface FormatIssue {
  type: 'error' | 'warning' | 'info';
  text: string;
  section?: string;
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionable?: string;
}

export interface ATSAnalysisResult {
  score: number;
  scoreLabel: string;
  keywords: KeywordAnalysis;
  structure: StructureAnalysis;
  formatIssues: FormatIssue[];
  recommendations: Recommendation[];
}

// CV'den metin çıkar
export function extractCVText(cv: CVData): string {
  const parts: string[] = [];

  // Kişisel bilgiler
  if (cv.personalInfo.fullName) parts.push(cv.personalInfo.fullName);
  if (cv.personalInfo.title) parts.push(cv.personalInfo.title);
  if (cv.personalInfo.summary) parts.push(cv.personalInfo.summary);
  if (cv.personalInfo.email) parts.push(cv.personalInfo.email);
  if (cv.personalInfo.phone) parts.push(cv.personalInfo.phone);
  if (cv.personalInfo.location) parts.push(cv.personalInfo.location);

  // Deneyimler
  cv.experiences.forEach((exp) => {
    if (exp.position) parts.push(exp.position);
    if (exp.company) parts.push(exp.company);
    if (exp.description) parts.push(exp.description);
    exp.highlights.forEach(h => parts.push(h));
    if (exp.technologies) exp.technologies.forEach(t => parts.push(t));
  });

  // Eğitim
  cv.education.forEach((edu) => {
    if (edu.degree) parts.push(edu.degree);
    if (edu.school) parts.push(edu.school);
    if (edu.field) parts.push(edu.field);
    if (edu.description) parts.push(edu.description);
  });

  // Yetenekler
  cv.skills.forEach((skill) => {
    if (skill.name) parts.push(skill.name);
  });

  // Projeler
  cv.projects.forEach((project) => {
    if (project.name) parts.push(project.name);
    if (project.description) parts.push(project.description);
    project.technologies.forEach(t => parts.push(t));
    project.highlights.forEach(h => parts.push(h));
  });

  // Sertifikalar
  cv.certifications.forEach((cert) => {
    if (cert.name) parts.push(cert.name);
    if (cert.issuer) parts.push(cert.issuer);
  });

  return parts.join(' ');
}

// Anahtar kelime analizi
export function analyzeKeywords(cvText: string, jobDescription: string): KeywordAnalysis {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    've', 'ile', 'bir', 'bu', 'şu', 'o', 'da', 'de', 'ki', 'mi', 'mu', 'mı', 'mü',
    'için', 'olan', 'olarak', 'her', 'çok', 'daha', 'en', 'gibi', 'is', 'are', 'was',
    'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'can', 'that', 'this', 'these', 'those',
  ]);

  const extractKeywords = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^\w\sğüşıöçĞÜŞİÖÇ]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word));
  };

  const cvKeywords = new Set(extractKeywords(cvText));
  const jobKeywords = extractKeywords(jobDescription);

  // Frekans analizi
  const keywordFreq: Record<string, number> = {};
  jobKeywords.forEach(kw => {
    keywordFreq[kw] = (keywordFreq[kw] || 0) + 1;
  });

  // Benzersiz iş ilanı anahtar kelimeleri
  const uniqueJobKeywords = [...new Set(jobKeywords)];
  
  // Eşleşen ve eksik kelimeler
  const matched = uniqueJobKeywords.filter(kw => cvKeywords.has(kw));
  const missing = uniqueJobKeywords.filter(kw => !cvKeywords.has(kw));

  // En önemli eksik kelimeler (en sık geçenler)
  const topMissing = Object.entries(keywordFreq)
    .filter(([word]) => missing.includes(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);

  return {
    matched,
    missing,
    matchRate: uniqueJobKeywords.length > 0 
      ? (matched.length / uniqueJobKeywords.length) * 100 
      : 0,
    totalJobKeywords: uniqueJobKeywords.length,
    topMissingKeywords: topMissing,
  };
}

// CV yapı analizi
export function analyzeStructure(cv: CVData): StructureAnalysis {
  const sections = {
    contact: !!(cv.personalInfo.email && cv.personalInfo.phone),
    summary: !!cv.personalInfo.summary && cv.personalInfo.summary.length > 50,
    experience: cv.experiences.length > 0,
    education: cv.education.length > 0,
    skills: cv.skills.length > 0,
  };

  const sectionLabels: Record<string, string> = {
    contact: 'İletişim Bilgileri',
    summary: 'Özet/Hakkımda',
    experience: 'İş Deneyimi',
    education: 'Eğitim',
    skills: 'Yetenekler',
  };

  const missing = Object.entries(sections)
    .filter(([_, exists]) => !exists)
    .map(([section]) => sectionLabels[section]);

  const completeness = (Object.values(sections).filter(Boolean).length / Object.keys(sections).length) * 100;

  return {
    sections,
    missing,
    completeness,
  };
}

// Format kontrolü
export function checkFormat(cv: CVData, cvText: string): FormatIssue[] {
  const issues: FormatIssue[] = [];

  // Uzunluk kontrolü
  if (cvText.length < 300) {
    issues.push({ 
      type: 'error', 
      text: 'CV çok kısa görünüyor (minimum 300 karakter önerilir)',
      section: 'Genel'
    });
  }

  if (cvText.length > 5000) {
    issues.push({ 
      type: 'warning', 
      text: 'CV çok uzun (ATS sistemleri için 2-3 sayfa ideal)',
      section: 'Genel'
    });
  }

  // İletişim bilgileri
  if (!cv.personalInfo.email) {
    issues.push({ 
      type: 'error', 
      text: 'E-posta adresi eksik',
      section: 'Kişisel Bilgiler'
    });
  }

  if (!cv.personalInfo.phone) {
    issues.push({ 
      type: 'error', 
      text: 'Telefon numarası eksik',
      section: 'Kişisel Bilgiler'
    });
  }

  // İş deneyimi kontrolü
  if (cv.experiences.length === 0) {
    issues.push({ 
      type: 'error', 
      text: 'En az bir iş deneyimi eklemelisiniz',
      section: 'Deneyim'
    });
  } else {
    // Deneyim detay kontrolü
    const emptyDescriptions = cv.experiences.filter(exp => !exp.description || exp.description.length < 50);
    if (emptyDescriptions.length > 0) {
      issues.push({ 
        type: 'warning', 
        text: `${emptyDescriptions.length} deneyiminizde detaylı açıklama eksik`,
        section: 'Deneyim'
      });
    }

    // Highlights kontrolü
    const noHighlights = cv.experiences.filter(exp => exp.highlights.length === 0);
    if (noHighlights.length > 0) {
      issues.push({ 
        type: 'info', 
        text: 'Deneyimlerinizde başarı maddeleri ekleyin (highlights)',
        section: 'Deneyim'
      });
    }
  }

  // Eğitim kontrolü
  if (cv.education.length === 0) {
    issues.push({ 
      type: 'warning', 
      text: 'En az bir eğitim bilgisi eklemelisiniz',
      section: 'Eğitim'
    });
  }

  // Yetenek kontrolü
  if (cv.skills.length < 5) {
    issues.push({ 
      type: 'warning', 
      text: 'En az 5 yetenek eklemeniz önerilir',
      section: 'Yetenekler'
    });
  }

  // Sayısal veri kontrolü
  const numbers = (cvText.match(/\d+%|\d+\+|\$\d+|\d+ yıl/g) || []).length;
  if (numbers < 3) {
    issues.push({ 
      type: 'info', 
      text: 'Başarılarınızı sayısal verilerle destekleyin (%, +, yıl, vb.)',
      section: 'Genel'
    });
  }

  // Özet uzunluğu
  if (cv.personalInfo.summary.length < 100) {
    issues.push({ 
      type: 'info', 
      text: 'Özet bölümünüz çok kısa, 2-3 cümle ekleyin',
      section: 'Özet'
    });
  }

  return issues;
}

// Genel skor hesaplama
export function calculateScore(
  keywords: KeywordAnalysis,
  structure: StructureAnalysis,
  formatIssues: FormatIssue[]
): number {
  let score = 0;

  // Anahtar kelime eşleşmesi (40 puan)
  score += (keywords.matchRate / 100) * 40;

  // Yapı tamlığı (30 puan)
  score += (structure.completeness / 100) * 30;

  // Format kalitesi (30 puan)
  const errorCount = formatIssues.filter(i => i.type === 'error').length;
  const warningCount = formatIssues.filter(i => i.type === 'warning').length;
  score += Math.max(0, 30 - (errorCount * 10) - (warningCount * 5));

  return Math.round(Math.max(0, Math.min(100, score)));
}

// Skor etiketi
export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Mükemmel';
  if (score >= 60) return 'İyi';
  if (score >= 40) return 'Orta';
  return 'Geliştirilmeli';
}

// İyileştirme önerileri
export function generateRecommendations(
  keywords: KeywordAnalysis,
  structure: StructureAnalysis,
  formatIssues: FormatIssue[]
): Recommendation[] {
  const recs: Recommendation[] = [];

  // Kritik hatalar (high priority)
  const errors = formatIssues.filter(i => i.type === 'error');
  if (errors.length > 0) {
    recs.push({
      priority: 'high',
      title: 'Kritik Eksiklikler',
      description: `${errors.length} kritik eksiklik var: ${errors.map(e => e.text).join(', ')}`,
      actionable: 'Editöre dön ve eksik bilgileri tamamla',
    });
  }

  // Anahtar kelime optimizasyonu
  if (keywords.matchRate < 50) {
    recs.push({
      priority: 'high',
      title: 'Anahtar Kelime Optimizasyonu Gerekli',
      description: `İş ilanındaki anahtar kelimelerin sadece %${keywords.matchRate.toFixed(0)}'sini kullanıyorsunuz. ATS sistemleri için minimum %50 eşleşme önerilir.`,
      actionable: `Şu kelimeleri CV'nize ekleyin: ${keywords.topMissingKeywords.slice(0, 5).join(', ')}`,
    });
  } else if (keywords.matchRate < 70) {
    recs.push({
      priority: 'medium',
      title: 'Anahtar Kelime Eşleşmesi İyileştirilebilir',
      description: `%${keywords.matchRate.toFixed(0)} eşleşme var, ancak %70'in üzerine çıkarsanız daha iyi sonuç alırsınız.`,
      actionable: `Önerilen kelimeler: ${keywords.topMissingKeywords.slice(0, 5).join(', ')}`,
    });
  }

  // Yapı eksiklikleri
  if (structure.missing.length > 0) {
    recs.push({
      priority: 'high',
      title: 'Eksik CV Bölümleri',
      description: `Şu bölümler eksik veya yetersiz: ${structure.missing.join(', ')}`,
      actionable: 'Bu bölümleri ekleyin veya detaylandırın',
    });
  }

  // Deneyim optimizasyonu
  const expWarnings = formatIssues.filter(i => i.section === 'Deneyim');
  if (expWarnings.length > 0) {
    recs.push({
      priority: 'medium',
      title: 'İş Deneyimi Detaylandırma',
      description: 'İş deneyimleriniz daha detaylı olmalı',
      actionable: 'Her pozisyon için en az 3-4 başarı maddesi ekleyin',
    });
  }

  // Sayısal veri eksikliği
  if (formatIssues.some(i => i.text.includes('sayısal'))) {
    recs.push({
      priority: 'low',
      title: 'Ölçülebilir Başarılar Ekleyin',
      description: 'Başarılarınızı sayılarla ifade edin (%, artış, azalma, vb.)',
      actionable: 'Örnek: "Satışları %25 artırdım", "5 kişilik ekip yönettim"',
    });
  }

  // Yetenek sayısı
  if (formatIssues.some(i => i.section === 'Yetenekler')) {
    recs.push({
      priority: 'low',
      title: 'Daha Fazla Yetenek Ekleyin',
      description: 'ATS sistemleri için en az 8-10 yetenek önerilir',
      actionable: 'İş ilanındaki teknik gereksinimleri yetenek olarak ekleyin',
    });
  }

  return recs;
}

// Ana analiz fonksiyonu
export function analyzeCV(cv: CVData, jobDescription: string): ATSAnalysisResult {
  const cvText = extractCVText(cv);
  const keywords = analyzeKeywords(cvText, jobDescription);
  const structure = analyzeStructure(cv);
  const formatIssues = checkFormat(cv, cvText);
  const score = calculateScore(keywords, structure, formatIssues);
  const recommendations = generateRecommendations(keywords, structure, formatIssues);

  return {
    score,
    scoreLabel: getScoreLabel(score),
    keywords,
    structure,
    formatIssues,
    recommendations,
  };
}