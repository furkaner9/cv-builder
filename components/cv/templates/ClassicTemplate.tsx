"use client";

import type { CVData } from '@/types/cv';

interface TemplateProps {
  cv: CVData;
}

export function ClassicTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;

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
    <div className="bg-white max-w-4xl mx-auto p-12">
      {/* Header - Merkezi */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
          {personalInfo.fullName || 'AD SOYAD'}
        </h1>
        <p className="text-lg text-gray-700 mb-3">
          {personalInfo.title || 'Ünvan'}
        </p>
        <div className="text-sm text-gray-600 space-x-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {/* Özet */}
      {personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-300">
            Özet
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* İş Deneyimi */}
      {experiences.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-1 border-b border-gray-300">
            İş Deneyimi
          </h2>
          {experiences.map((exp, index) => (
            <div key={exp.id} className={index < experiences.length - 1 ? 'mb-5' : ''}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-600 italic">
                  {exp.startDate} - {exp.current ? 'Günümüz' : exp.endDate}
                </span>
              </div>
              <p className="text-gray-700 font-medium mb-1">
                {exp.company}{exp.location && `, ${exp.location}`}
              </p>
              {exp.description && (
                <p className="text-gray-700 text-sm mb-2 italic">{exp.description}</p>
              )}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="list-disc list-outside text-gray-700 text-sm space-y-1 ml-5">
                  {exp.highlights.map((highlight, idx) => (
                    highlight && <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Eğitim */}
      {education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-1 border-b border-gray-300">
            Eğitim
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900">
                  {edu.degree}, {edu.field}
                </h3>
                <span className="text-sm text-gray-600 italic">
                  {edu.startDate} - {edu.current ? 'Günümüz' : edu.endDate}
                </span>
              </div>
              <p className="text-gray-700">
                {edu.school}
                {edu.location && `, ${edu.location}`}
                {edu.gpa && ` • GPA: ${edu.gpa}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Yetenekler */}
      {skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-300">
            Yetenekler
          </h2>
          <div className="text-gray-700">
            {Object.entries(
              skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.name);
                return acc;
              }, {} as Record<string, string[]>)
            ).map(([category, skillNames]) => (
              <p key={category} className="mb-2">
                <span className="font-semibold capitalize">{category}:</span>{' '}
                {skillNames.join(', ')}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Projeler */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-1 border-b border-gray-300">
            Projeler
          </h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="font-bold text-gray-900">{project.name}</h3>
              {project.role && (
                <p className="text-sm text-gray-600 italic">{project.role}</p>
              )}
              <p className="text-gray-700 text-sm">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Teknolojiler:</span>{' '}
                  {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sertifikalar */}
      {certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-300">
            Sertifikalar
          </h2>
          {certifications.map((cert) => (
            <p key={cert.id} className="text-gray-700 mb-2">
              <span className="font-semibold">{cert.name}</span> - {cert.issuer} ({cert.date})
            </p>
          ))}
        </div>
      )}

      {/* Diller */}
      {languages.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-300">
            Diller
          </h2>
          <p className="text-gray-700">
            {languages.map((lang, idx) => (
              <span key={lang.id}>
                {lang.name} ({getProficiencyLabel(lang.proficiency)})
                {idx < languages.length - 1 && ', '}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}