"use client";

import type { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Star } from 'lucide-react';

interface CVPreviewProps {
  cv: CVData;
  scale?: number;
}

export function CVPreview({ cv, scale = 1 }: CVPreviewProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages, settings } = cv;

  const spacingClass = {
    compact: 'space-y-2',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
  }[settings.spacing];

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[settings.fontSize];

  const getStarCount = (level: string): number => {
    const levels: Record<string, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
    };
    return levels[level] || 2;
  };

  const getProficiencyLabel = (proficiency: string): string => {
    const labels: Record<string, string> = {
      basic: 'Temel',
      conversational: 'Günlük Konuşma',
      professional: 'Profesyonel',
      native: 'Ana Dil',
    };
    return labels[proficiency] || proficiency;
  };

  return (
    <div
      className={`bg-white ${fontSizeClass}`}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: scale !== 1 ? `${100 / scale}%` : '100%',
      }}
    >
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="border-b-4 pb-6 mb-6" style={{ borderColor: settings.themeColor }}>
          <h1 className="text-4xl font-bold mb-2" style={{ color: settings.themeColor }}>
            {personalInfo.fullName || 'Ad Soyad'}
          </h1>
          <p className="text-2xl text-gray-700 mb-4">{personalInfo.title || 'Ünvan'}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Website
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <Github className="h-4 w-4" />
                GitHub
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 
              className="text-xl font-bold mb-3 pb-2 border-b-2" 
              style={{ 
                color: settings.themeColor,
                borderColor: `${settings.themeColor}40`
              }}
            >
              Profesyonel Özet
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 
              className="text-xl font-bold mb-3 pb-2 border-b-2" 
              style={{ 
                color: settings.themeColor,
                borderColor: `${settings.themeColor}40`
              }}
            >
              İş Deneyimi
            </h2>
            {experiences.map((exp) => (
              <div key={exp.id} className="mb-5">
                <h3 className="text-lg font-semibold" style={{ color: settings.themeColor }}>
                  {exp.position}
                </h3>
                <p className="text-gray-800 font-medium">{exp.company}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {exp.startDate} - {exp.current ? 'Devam Ediyor' : exp.endDate}
                  {exp.location && ` • ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="text-gray-700 mb-2">{exp.description}</p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    {exp.highlights.map((highlight, idx) => (
                      highlight && <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {exp.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded font-medium"
                        style={{ 
                          backgroundColor: `${settings.themeColor}20`, 
                          color: settings.themeColor 
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 
              className="text-xl font-bold mb-3 pb-2 border-b-2" 
              style={{ 
                color: settings.themeColor,
                borderColor: `${settings.themeColor}40`
              }}
            >
              Eğitim
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <h3 className="text-lg font-semibold" style={{ color: settings.themeColor }}>
                  {edu.degree} • {edu.field}
                </h3>
                <p className="text-gray-800 font-medium">{edu.school}</p>
                <p className="text-sm text-gray-600">
                  {edu.startDate} - {edu.current ? 'Devam Ediyor' : edu.endDate}
                  {edu.location && ` • ${edu.location}`}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
                {edu.description && (
                  <p className="text-gray-700 mt-2">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 
              className="text-xl font-bold mb-3 pb-2 border-b-2" 
              style={{ 
                color: settings.themeColor,
                borderColor: `${settings.themeColor}40`
              }}
            >
              Yetenekler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{skill.name}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < getStarCount(skill.level)
                            ? 'fill-current text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 
              className="text-xl font-bold mb-3 pb-2 border-b-2" 
              style={{ 
                color: settings.themeColor,
                borderColor: `${settings.themeColor}40`
              }}
            >
              Projeler
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-4">
                <h3 className="text-lg font-semibold" style={{ color: settings.themeColor }}>
                  {project.name}
                </h3>
                {project.role && (
                  <p className="text-gray-600 text-sm italic">{project.role}</p>
                )}
                <p className="text-gray-700 mt-1">{project.description}</p>
                {project.url && (
                  <p className="text-sm text-gray-600 mt-1">
                    <Globe className="h-3 w-3 inline mr-1" />
                    {project.url}
                  </p>
                )}
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded font-medium"
                        style={{ 
                          backgroundColor: `${settings.themeColor}20`, 
                          color: settings.themeColor 
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 
              className="text-xl font-bold mb-3 pb-2 border-b-2" 
              style={{ 
                color: settings.themeColor,
                borderColor: `${settings.themeColor}40`
              }}
            >
              Sertifikalar
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-3">
                <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                <p className="text-gray-700 text-sm">
                  {cert.issuer} • {cert.date}
                  {cert.credentialId && ` • ID: ${cert.credentialId}`}
                </p>
                {cert.expiryDate && (
                  <p className="text-xs text-gray-600">Geçerlilik: {cert.expiryDate}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className={`mb-6 ${spacingClass}`}>
            <h2 
              className="text-xl font-bold mb-3 pb-2 border-b-2" 
              style={{ 
                color: settings.themeColor,
                borderColor: `${settings.themeColor}40`
              }}
            >
              Diller
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{lang.name}</span>
                  <span 
                    className="text-sm px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: `${settings.themeColor}20`, 
                      color: settings.themeColor 
                    }}
                  >
                    {getProficiencyLabel(lang.proficiency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        {(experiences.length === 0 && education.length === 0 && skills.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">CV içeriğinizi doldurmaya başlayın</p>
            <p className="text-sm mt-2">Soldaki sekmeleri kullanarak bilgilerinizi ekleyin</p>
          </div>
        )}
      </div>
    </div>
  );
}