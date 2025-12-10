// types/cv.ts - Tüm CV tip tanımları

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  photo?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string | 'present';
  current: boolean;
  description: string;
  highlights: string[];
  technologies?: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  achievements?: string[];
  description?: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillCategory = 'technical' | 'soft' | 'language' | 'tool' | 'framework';

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: SkillCategory;
  yearsOfExperience?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  role?: string;
  url?: string;
  github?: string;
  technologies: string[];
  highlights: string[];
  startDate?: string;
  endDate?: string;
  current: boolean;
  images?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
  description?: string;
}

export type LanguageProficiency = 'basic' | 'conversational' | 'professional' | 'native';

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
  certifications?: string[];
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
  relationship: string;
}

export interface Volunteer {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string | 'present';
  current: boolean;
  description: string;
  achievements?: string[];
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  authors?: string[];
  description?: string;
}

export type TemplateType = 'modern' | 'classic' | 'minimal' | 'creative' | 'executive';

export interface CVSettings {
  templateId: string;
  templateType: TemplateType;
  themeColor: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'relaxed';
  showPhoto: boolean;
  showReferences: boolean;
  columnsLayout: 1 | 2;
  sectionOrder: string[];
  customCSS?: string;
}

export interface CVData {
  id: string;
  userId?: string;
  title: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  references?: Reference[];
  volunteer?: Volunteer[];
  awards?: Award[];
  publications?: Publication[];
  settings: CVSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  description: string;
  thumbnail: string;
  previewUrl?: string;
  isPremium: boolean;
  category: string[];
  bestFor: string[];
  features: string[];
}

export interface CVAnalytics {
  completionScore: number;
  atsScore: number;
  missingFields: string[];
  suggestions: string[];
  keywordDensity: Record<string, number>;
  readabilityScore: number;
}

// Form değerleri için partial tipler
export type PersonalInfoFormData = Partial<PersonalInfo>;
export type ExperienceFormData = Partial<Experience>;
export type EducationFormData = Partial<Education>;
export type SkillFormData = Partial<Skill>;
export type ProjectFormData = Partial<Project>;
export type CertificationFormData = Partial<Certification>;
export type LanguageFormData = Partial<Language>;

// Export için tipler
export type ExportFormat = 'pdf' | 'docx' | 'html' | 'json' | 'txt' | 'png';

export interface ExportOptions {
  format: ExportFormat;
  quality?: 'low' | 'medium' | 'high';
  includeReferences?: boolean;
  watermark?: boolean;
  fileName?: string;
}