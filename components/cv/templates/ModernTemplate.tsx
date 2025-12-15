"use client";

import type { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Star } from 'lucide-react';
import { ensureHexColor } from '@/lib/utils/colors';

interface TemplateProps {
  cv: CVData;
}

export function ModernTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages, settings } = cv;

  // Rengi güvenli hex formatına çevir
  const themeColor = ensureHexColor(settings.themeColor);

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
    <div className="bg-white">
      <div className="grid grid-cols-3 gap-0">
        {/* Sol Sidebar - 1/3 */}
        <div 
          className="col-span-1 p-8 text-white"
          style={{ backgroundColor: themeColor }}
        >
          {/* İletişim */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">
              İletişim
            </h3>
            <div className="space-y-3 text-sm">
              {personalInfo.email && (
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="break-all">{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 shrink-0" />
                  <span className="text-xs">LinkedIn</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 shrink-0" />
                  <span className="text-xs">GitHub</span>
                </div>
              )}
            </div>
          </div>

          {/* Yetenekler */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">
                Yetenekler
              </h3>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="text-sm font-medium mb-1">{skill.name}</div>
                    <div className="flex gap-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-full rounded-full ${
                            i < getStarCount(skill.level)
                              ? 'bg-white'
                              : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diller */}
          {languages.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">
                Diller
              </h3>
              <div className="space-y-2 text-sm">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-xs opacity-75">
                      {getProficiencyLabel(lang.proficiency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sertifikalar */}
          {certifications.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">
                Sertifikalar
              </h3>
              <div className="space-y-3 text-sm">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <div className="font-medium">{cert.name}</div>
                    <div className="text-xs opacity-75">{cert.issuer}</div>
                    <div className="text-xs opacity-75">{cert.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ İçerik - 2/3 */}
        <div className="col-span-2 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ color: themeColor }}
            >
              {personalInfo.fullName || 'Ad Soyad'}
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              {personalInfo.title || 'Ünvan'}
            </p>
          </div>

          {/* Özet */}
          {personalInfo.summary && (
            <div className="mb-8">
              <h2 
                className="text-lg font-bold mb-3 pb-2 border-b-2"
                style={{ 
                  color: themeColor,
                  borderColor: `${themeColor}40`
                }}
              >
                PROFESYONEL ÖZET
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* İş Deneyimi */}
          {experiences.length > 0 && (
            <div className="mb-8">
              <h2 
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ 
                  color: settings.themeColor,
                  borderColor: `${settings.themeColor}40`
                }}
              >
                İŞ DENEYİMİ
              </h2>
              {experiences.map((exp) => (
                <div key={exp.id} className="mb-6">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold" style={{ color: settings.themeColor }}>
                      {exp.position}
                    </h3>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.current ? 'Devam' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium mb-1">{exp.company}</p>
                  {exp.location && (
                    <p className="text-sm text-gray-600 mb-2">{exp.location}</p>
                  )}
                  {exp.description && (
                    <p className="text-gray-700 text-sm mb-2">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                      {exp.highlights.map((highlight, idx) => (
                        highlight && <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
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

          {/* Eğitim */}
          {education.length > 0 && (
            <div className="mb-8">
              <h2 
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ 
                  color: settings.themeColor,
                  borderColor: `${settings.themeColor}40`
                }}
              >
                EĞİTİM
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ color: settings.themeColor }}>
                        {edu.degree} • {edu.field}
                      </h3>
                      <p className="text-gray-800">{edu.school}</p>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                      {edu.startDate} - {edu.current ? 'Devam' : edu.endDate}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projeler */}
          {projects.length > 0 && (
            <div className="mb-8">
              <h2 
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ 
                  color: settings.themeColor,
                  borderColor: `${settings.themeColor}40`
                }}
              >
                PROJELER
              </h2>
              {projects.map((project) => (
                <div key={project.id} className="mb-4">
                  <h3 className="font-bold" style={{ color: settings.themeColor }}>
                    {project.name}
                  </h3>
                  {project.role && (
                    <p className="text-sm text-gray-600 italic">{project.role}</p>
                  )}
                  <p className="text-gray-700 text-sm mt-1">{project.description}</p>
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
        </div>
      </div>
    </div>
  );
}