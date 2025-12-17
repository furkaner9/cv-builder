// types/portfolio.ts - Online Portfolio & QR Kod Tipleri

export interface OnlinePortfolio {
  id: string;
  cvId: string;
  slug: string; // Benzersiz URL slug'ı (örn: "ahmet-yilmaz-cv")
  isPublic: boolean;
  isActive: boolean;
  
  // Görünüm ayarları
  showQRCode: boolean;
  qrCodePosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'header' | 'footer';
  qrCodeSize: 'small' | 'medium' | 'large';
  qrCodeStyle: 'square' | 'dots' | 'rounded';
  
  // Özelleştirme
  customDomain?: string;
  theme: 'light' | 'dark' | 'auto';
  showViewCount: boolean;
  allowDownload: boolean;
  passwordProtected: boolean;
  password?: string;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: string;
  
  // Analytics
  viewCount: number;
  uniqueVisitors: number;
  lastViewedAt?: Date;
  downloadCount: number;
  
  // Sosyal paylaşım
  shareableLinks: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    whatsapp?: string;
  };
  
  // Timestamp
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // Opsiyonel: Portfolio'nun otomatik kapanma tarihi
}

export interface PortfolioView {
  id: string;
  portfolioId: string;
  viewerIp?: string;
  viewerLocation?: string;
  viewerDevice?: string;
  viewerBrowser?: string;
  referrer?: string;
  viewedAt: Date;
  duration?: number; // Saniye cinsinden görüntüleme süresi
}

export interface QRCodeOptions {
  data: string; // URL
  size: number; // Pixel cinsinden
  margin: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  
  // Stil
  foregroundColor: string;
  backgroundColor: string;
  
  // Logo
  logoImage?: string;
  logoSize?: number;
  logoBackgroundColor?: string;
  
  // Şekil
  dotsType: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
  cornersSquareType: 'square' | 'dot' | 'extra-rounded';
  cornersDotType: 'square' | 'dot';
}

export interface PortfolioSettings {
  // Görünüm
  layout: 'modern' | 'classic' | 'minimal';
  showHeader: boolean;
  showFooter: boolean;
  showSocialLinks: boolean;
  
  // Bölümler
  sections: {
    personalInfo: boolean;
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    certifications: boolean;
    languages: boolean;
  };
  
  // Etkileşim
  enableComments: boolean;
  enableContactForm: boolean;
  showPrintButton: boolean;
  showShareButtons: boolean;
  
  // Güvenlik
  requirePassword: boolean;
  allowIndexing: boolean; // SEO için
  trackAnalytics: boolean;
}

// Helper: Portfolio URL oluştur
export function generatePortfolioUrl(slug: string, customDomain?: string): string {
  if (customDomain) {
    return `https://${customDomain}`;
  }
  return `${window.location.origin}/portfolio/${slug}`;
}

// Helper: Slug oluştur (isimden)
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

// Helper: QR kod veri boyutunu hesapla
export function calculateQRSize(position: QRCodeOptions['dotsType'], size: 'small' | 'medium' | 'large'): number {
  const sizes = {
    small: 80,
    medium: 120,
    large: 160,
  };
  return sizes[size];
}

// Helper: Paylaşım linkleri oluştur
export function generateShareLinks(portfolioUrl: string, title: string) {
  const encodedUrl = encodeURIComponent(portfolioUrl);
  const encodedTitle = encodeURIComponent(title);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };
}

// Default portfolio ayarları
export const DEFAULT_PORTFOLIO_SETTINGS: PortfolioSettings = {
  layout: 'modern',
  showHeader: true,
  showFooter: true,
  showSocialLinks: true,
  sections: {
    personalInfo: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
  },
  enableComments: false,
  enableContactForm: true,
  showPrintButton: true,
  showShareButtons: true,
  requirePassword: false,
  allowIndexing: true,
  trackAnalytics: true,
};

// Default QR kod ayarları
export const DEFAULT_QR_OPTIONS: Partial<QRCodeOptions> = {
  size: 120,
  margin: 4,
  errorCorrectionLevel: 'M',
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  dotsType: 'rounded',
  cornersSquareType: 'extra-rounded',
  cornersDotType: 'dot',
};