// types/application.ts - Başvuru Takip Sistemi Tipleri

export type ApplicationStatus = 
  | 'draft'          // Taslak - Henüz gönderilmedi
  | 'applied'        // Başvuru yapıldı
  | 'screening'      // İnceleniyor
  | 'interview'      // Mülakat aşamasında
  | 'offer'          // Teklif alındı
  | 'accepted'       // Kabul edildi
  | 'rejected'       // Reddedildi
  | 'withdrawn';     // Geri çekildi

export type ApplicationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'hr' | 'final';

export interface JobApplication {
  id: string;
  cvId: string;
  cvTitle: string;
  
  // Şirket ve Pozisyon Bilgileri
  company: string;
  position: string;
  department?: string;
  location?: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  workMode: 'remote' | 'hybrid' | 'onsite';
  
  // Başvuru Bilgileri
  status: ApplicationStatus;
  priority: ApplicationPriority;
  appliedDate: Date;
  deadline?: Date;
  
  // İletişim
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  
  // Bağlantılar
  jobPostingUrl?: string;
  companyWebsite?: string;
  applicationPortalUrl?: string;
  
  // Maaş & Avantajlar
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  benefits?: string[];
  
  // Başvuru Detayları
  coverLetterUsed: boolean;
  coverLetterId?: string;
  source: 'linkedin' | 'indeed' | 'company-website' | 'referral' | 'recruiter' | 'other';
  referralName?: string;
  
  // Notlar ve Dökümanlar
  notes?: string;
  tags?: string[];
  attachments?: ApplicationAttachment[];
  
  // Timeline ve İstatistikler
  activities: ApplicationActivity[];
  interviews: Interview[];
  responseTime?: number; // Gün cinsinden yanıt süresi
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
}

export interface ApplicationActivity {
  id: string;
  applicationId: string;
  type: 'status_change' | 'note' | 'email' | 'call' | 'interview' | 'offer' | 'reminder';
  title: string;
  description?: string;
  oldStatus?: ApplicationStatus;
  newStatus?: ApplicationStatus;
  createdAt: Date;
  createdBy?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  type: InterviewType;
  title: string;
  date: Date;
  duration?: number; // Dakika cinsinden
  location?: string;
  meetingUrl?: string;
  interviewers?: string[];
  notes?: string;
  feedback?: string;
  result?: 'passed' | 'failed' | 'pending';
  completed: boolean;
  createdAt: Date;
}

export interface ApplicationAttachment {
  id: string;
  name: string;
  type: 'cv' | 'cover-letter' | 'portfolio' | 'certificate' | 'other';
  url?: string;
  size?: number;
  uploadedAt: Date;
}

export interface ApplicationReminder {
  id: string;
  applicationId: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  notifyBefore?: number; // Kaç gün önce hatırlatma
  createdAt: Date;
}

export interface ApplicationStatistics {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  byPriority: Record<ApplicationPriority, number>;
  averageResponseTime: number;
  successRate: number; // (offer + accepted) / total
  interviewConversionRate: number; // interview / applied
  thisMonth: number;
  thisWeek: number;
}

// Status'lara göre renk ve label
export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}> = {
  draft: {
    label: 'Taslak',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: '📝',
  },
  applied: {
    label: 'Başvuruldu',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: '📤',
  },
  screening: {
    label: 'İnceleniyor',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: '🔍',
  },
  interview: {
    label: 'Mülakat',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: '💼',
  },
  offer: {
    label: 'Teklif Alındı',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: '🎉',
  },
  accepted: {
    label: 'Kabul Edildi',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    icon: '✅',
  },
  rejected: {
    label: 'Reddedildi',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: '❌',
  },
  withdrawn: {
    label: 'Geri Çekildi',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: '↩️',
  },
};

// Priority renkleri
export const PRIORITY_CONFIG: Record<ApplicationPriority, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  low: {
    label: 'Düşük',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  medium: {
    label: 'Orta',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  high: {
    label: 'Yüksek',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  urgent: {
    label: 'Acil',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

// Interview type labels
export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  phone: 'Telefon Görüşmesi',
  video: 'Video Görüşmesi',
  onsite: 'Yüz Yüze',
  technical: 'Teknik Mülakat',
  hr: 'İK Görüşmesi',
  final: 'Final Mülakatı',
};

// Helper: Yeni başvuru oluştur
export function createEmptyApplication(cvId: string, cvTitle: string): JobApplication {
  return {
    id: `app-${Date.now()}`,
    cvId,
    cvTitle,
    company: '',
    position: '',
    jobType: 'full-time',
    workMode: 'hybrid',
    status: 'draft',
    priority: 'medium',
    appliedDate: new Date(),
    salaryCurrency: 'TRY',
    coverLetterUsed: false,
    source: 'company-website',
    activities: [],
    interviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Helper: Status değiştir ve activity oluştur
export function changeApplicationStatus(
  application: JobApplication,
  newStatus: ApplicationStatus
): JobApplication {
  const activity: ApplicationActivity = {
    id: `activity-${Date.now()}`,
    applicationId: application.id,
    type: 'status_change',
    title: `Durum değişti: ${APPLICATION_STATUS_CONFIG[application.status].label} → ${APPLICATION_STATUS_CONFIG[newStatus].label}`,
    oldStatus: application.status,
    newStatus: newStatus,
    createdAt: new Date(),
  };

  return {
    ...application,
    status: newStatus,
    activities: [...application.activities, activity],
    updatedAt: new Date(),
  };
}

// Helper: İstatistik hesapla
export function calculateStatistics(applications: JobApplication[]): ApplicationStatistics {
  const total = applications.length;
  
  const byStatus = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<ApplicationStatus, number>);

  const byPriority = applications.reduce((acc, app) => {
    acc[app.priority] = (acc[app.priority] || 0) + 1;
    return acc;
  }, {} as Record<ApplicationPriority, number>);

  const responseTimes = applications
    .filter(app => app.responseTime)
    .map(app => app.responseTime!);
  const averageResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;

  const successCount = (byStatus.offer || 0) + (byStatus.accepted || 0);
  const successRate = total > 0 ? (successCount / total) * 100 : 0;

  const interviewCount = byStatus.interview || 0;
  const appliedCount = byStatus.applied || 0;
  const interviewConversionRate = appliedCount > 0
    ? (interviewCount / appliedCount) * 100
    : 0;

  const now = new Date();
  const thisMonth = applications.filter(app => {
    const appDate = new Date(app.appliedDate);
    return appDate.getMonth() === now.getMonth() && 
           appDate.getFullYear() === now.getFullYear();
  }).length;

  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeek = applications.filter(app => 
    new Date(app.appliedDate) >= oneWeekAgo
  ).length;

  return {
    total,
    byStatus,
    byPriority,
    averageResponseTime,
    successRate,
    interviewConversionRate,
    thisMonth,
    thisWeek,
  };
}