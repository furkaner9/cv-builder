"use client";

import type { CVData } from '@/types/cv';
import { ModernTemplate } from '@/components/cv/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/cv/templates/ClassicTemplate';
import { MinimalTemplate } from '@/components/cv/templates/MinimalTemplate';
import { CreativeTemplate } from '@/components/cv/templates/CreativeTemplate';

interface CVPreviewProps {
  cv: CVData;
  scale?: number;
}

export function CVPreview({ cv, scale = 1 }: CVPreviewProps) {
  // Template'e göre component seç
  const renderTemplate = () => {
    switch (cv.settings.templateType) {
      case 'modern':
        return <ModernTemplate cv={cv} />;
      case 'classic':
        return <ClassicTemplate cv={cv} />;
      case 'minimal':
        return <MinimalTemplate cv={cv} />;
      case 'creative':
        return <CreativeTemplate cv={cv} />;
      case 'executive':
        return <ClassicTemplate cv={cv} />; // Executive henüz yok, classic kullan
      default:
        return <ModernTemplate cv={cv} />;
    }
  };

  // Eğer scale 1'den farklıysa wrapper ile sar
  if (scale !== 1) {
    return (
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${100 / scale}%`,
        }}
      >
        {renderTemplate()}
      </div>
    );
  }

  // Scale 1 ise direkt render et
  return <>{renderTemplate()}</>;
}