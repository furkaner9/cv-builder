"use client";

import type { CVData } from '@/types/cv';
import { ensureHexColor } from '@/lib/utils/colors';

interface TemplateProps {
  cv: CVData;
}

export function MinimalTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages, settings } = cv;

  const themeColor = ensureHexColor(cv.settings.themeColor);

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
    <div className="bg-white max-w-4xl mx-auto p-16">
      {/* Header - Minimal */}
      <div className="mb-16">
        <h1 className="text-5xl font-light text-gray-900 mb-3">
          {personalInfo.fullName || 'Ad Soyad'}
        </h1>
        <p 
          className="text-xl font-light mb-6"
          style={{ color: settings.themeColor }}
        >
          {personalInfo.title || 'Ünvan'}
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Özet */}
      {personalInfo.summary && (
        <div className="mb-16">
          <p className="text-gray-700 leading-loose text-lg font-light">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* İş Deneyimi */}
      {experiences.length > 0 && (
        <div className="mb-16">
          <h2 
            className="text-xs uppercase tracking-widest mb-8 font-medium"
            style={{ color: settings.themeColor }}
          >
            Experience
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-12">
              <div className="grid grid-cols-4 gap-8">
                <div className="col-span-1">
                  <p className="text-sm text-gray-500 font-light">
                    {exp.startDate}
                    <br />
                    {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
                <div className="col-span-3">
                  <h3 className="text-xl font-light text-gray-900 mb-1">
                    {exp.position}
                  </h3>
                  <p className="text-gray-600 mb-3">{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-700 font-light mb-3 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-2 text-gray-700 font-light">
                      {exp.highlights.map((highlight, idx) => (
                        highlight && (
                          <li key={idx} className="pl-4 border-l-2" style={{ borderColor: `${settings.themeColor}40` }}>
                            {highlight}
                          </li>
                        )
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Eğitim */}
      {education.length > 0 && (
        <div className="mb-16">
          <h2 
            className="text-xs uppercase tracking-widest mb-8 font-medium"
            style={{ color: settings.themeColor }}
          >
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-8">
              <div className="grid grid-cols-4 gap-8">
                <div className="col-span-1">
                  <p className="text-sm text-gray-500 font-light">
                    {edu.startDate}
                    <br />
                    {edu.current ? 'Present' : edu.endDate}
                  </p>
                </div>
                <div className="col-span-3">
                  <h3 className="text-xl font-light text-gray-900 mb-1">
                    {edu.degree}
                  </h3>
                  <p className="text-gray-600 mb-1">{edu.school}</p>
                  <p className="text-gray-600 font-light">{edu.field}</p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-500 mt-2">GPA: {edu.gpa}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Yetenekler */}
      {skills.length > 0 && (
        <div className="mb-16">
          <h2 
            className="text-xs uppercase tracking-widest mb-8 font-medium"
            style={{ color: settings.themeColor }}
          >
            Skills
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div key={skill.id}>
                <p className="text-gray-700 font-light">{skill.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projeler */}
      {projects.length > 0 && (
        <div className="mb-16">
          <h2 
            className="text-xs uppercase tracking-widest mb-8 font-medium"
            style={{ color: settings.themeColor }}
          >
            Projects
          </h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-8">
              <h3 className="text-xl font-light text-gray-900 mb-2">
                {project.name}
              </h3>
              <p className="text-gray-700 font-light leading-relaxed mb-3">
                {project.description}
              </p>
              {project.technologies.length > 0 && (
                <p className="text-sm text-gray-500 font-light">
                  {project.technologies.join(' • ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Alt bilgiler */}
      <div className="grid grid-cols-2 gap-12">
        {/* Sertifikalar */}
        {certifications.length > 0 && (
          <div>
            <h2 
              className="text-xs uppercase tracking-widest mb-6 font-medium"
              style={{ color: settings.themeColor }}
            >
              Certifications
            </h2>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <p className="text-gray-700 font-light">{cert.name}</p>
                  <p className="text-sm text-gray-500 font-light">
                    {cert.issuer} • {cert.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diller */}
        {languages.length > 0 && (
          <div>
            <h2 
              className="text-xs uppercase tracking-widest mb-6 font-medium"
              style={{ color: settings.themeColor }}
            >
              Languages
            </h2>
            <div className="space-y-2">
              {languages.map((lang) => (
                <p key={lang.id} className="text-gray-700 font-light">
                  {lang.name} <span className="text-gray-500">• {getProficiencyLabel(lang.proficiency)}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}