"use client";

import type { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Star } from 'lucide-react';

interface TemplateProps {
  cv: CVData;
}

export function CreativeTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages, settings } = cv;

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
    <div className="bg-gray-50">
      {/* Asimetrik Header */}
      <div 
        className="relative h-48 overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${settings.themeColor} 0%, ${settings.themeColor}dd 100%)`
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>
        <div className="relative h-full flex items-end p-8">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-2">
              {personalInfo.fullName || 'Ad Soyad'}
            </h1>
            <p className="text-2xl font-light">
              {personalInfo.title || 'Ünvan'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 -mt-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Sol Kolon */}
          <div className="col-span-1 space-y-6">
            {/* İletişim Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 
                className="text-sm font-bold uppercase tracking-wider mb-4"
                style={{ color: settings.themeColor }}
              >
                İletişim
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                {personalInfo.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5" style={{ color: settings.themeColor }} />
                    <span className="break-all">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" style={{ color: settings.themeColor }} />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" style={{ color: settings.themeColor }} />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Yetenekler Card */}
            {skills.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 
                  className="text-sm font-bold uppercase tracking-wider mb-4"
                  style={{ color: settings.themeColor }}
                >
                  Yetenekler
                </h3>
                <div className="space-y-4">
                  {skills.slice(0, 8).map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{skill.name}</span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-2 flex-1 rounded-full"
                            style={{
                              backgroundColor: i < getStarCount(skill.level)
                                ? settings.themeColor
                                : '#e5e7eb'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diller Card */}
            {languages.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 
                  className="text-sm font-bold uppercase tracking-wider mb-4"
                  style={{ color: settings.themeColor }}
                >
                  Diller
                </h3>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: settings.themeColor }}
                      />
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-gray-500"> • {getProficiencyLabel(lang.proficiency)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sağ Kolon */}
          <div className="col-span-2 space-y-6">
            {/* Özet Card */}
            {personalInfo.summary && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 
                  className="text-lg font-bold uppercase tracking-wider mb-4"
                  style={{ color: settings.themeColor }}
                >
                  Hakkımda
                </h2>
                <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
              </div>
            )}

            {/* İş Deneyimi */}
            {experiences.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 
                  className="text-lg font-bold uppercase tracking-wider mb-6"
                  style={{ color: settings.themeColor }}
                >
                  İş Deneyimi
                </h2>
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="relative pl-6">
                      <div 
                        className="absolute left-0 top-2 w-3 h-3 rounded-full"
                        style={{ backgroundColor: settings.themeColor }}
                      />
                      {index < experiences.length - 1 && (
                        <div 
                          className="absolute left-1.5 top-5 w-0.5 h-full"
                          style={{ backgroundColor: `${settings.themeColor}30` }}
                        />
                      )}
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-900">{exp.position}</h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {exp.startDate} - {exp.current ? 'Devam' : exp.endDate}
                          </span>
                        </div>
                        <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
                        {exp.description && (
                          <p className="text-sm text-gray-600 mb-2">{exp.description}</p>
                        )}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {exp.highlights.map((highlight, idx) => (
                              highlight && <li key={idx}>{highlight}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eğitim */}
            {education.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 
                  className="text-lg font-bold uppercase tracking-wider mb-6"
                  style={{ color: settings.themeColor }}
                >
                  Eğitim
                </h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-gray-900">
                        {edu.degree} • {edu.field}
                      </h3>
                      <p className="text-gray-700">{edu.school}</p>
                      <p className="text-sm text-gray-500">
                        {edu.startDate} - {edu.current ? 'Devam' : edu.endDate}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projeler */}
            {projects.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 
                  className="text-lg font-bold uppercase tracking-wider mb-6"
                  style={{ color: settings.themeColor }}
                >
                  Projeler
                </h2>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id}>
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-3 py-1 rounded-full font-medium"
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
              </div>
            )}

            {/* Sertifikalar */}
            {certifications.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 
                  className="text-lg font-bold uppercase tracking-wider mb-4"
                  style={{ color: settings.themeColor }}
                >
                  Sertifikalar
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <p className="font-medium text-gray-900 text-sm">{cert.name}</p>
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                      <p className="text-xs text-gray-500">{cert.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}