// lib/export/pdf.ts
import jsPDF from 'jspdf';
import type { CVData } from '@/types/cv';

interface PDFExportOptions {
  fontSize?: number;
  lineHeight?: number;
  margin?: number;
  pageWidth?: number;
  pageHeight?: number;
}

export async function exportToPDF(cv: CVData, options: PDFExportOptions = {}) {
  const {
    fontSize = 10,
    lineHeight = 1.5,
    margin = 20,
    pageWidth = 210,
    pageHeight = 297,
  } = options;

  // A4 boyutunda PDF oluştur
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let yPosition = margin;
  const maxWidth = pageWidth - (margin * 2);
  const lineHeightMM = fontSize * lineHeight * 0.352778; // pt to mm

  // Helper fonksiyonlar
  const checkPageBreak = (requiredSpace: number = 10) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  const addText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal', color: string = '#000000') => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', style);
    
    // Hex color'ı RGB'ye çevir
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    pdf.setTextColor(r, g, b);

    const lines = pdf.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      checkPageBreak();
      pdf.text(line, margin, yPosition);
      yPosition += lineHeightMM * (fontSize / 10);
    });
  };

  const addSpace = (space: number = 5) => {
    yPosition += space;
  };

  const addLine = (color: string = '#CCCCCC') => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    pdf.setDrawColor(r, g, b);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 3;
  };

  const addSectionTitle = (title: string, themeColor: string) => {
    checkPageBreak(15);
    addSpace(5);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    
    const r = parseInt(themeColor.slice(1, 3), 16);
    const g = parseInt(themeColor.slice(3, 5), 16);
    const b = parseInt(themeColor.slice(5, 7), 16);
    pdf.setTextColor(r, g, b);
    
    pdf.text(title, margin, yPosition);
    yPosition += 7;
    addLine(`${themeColor}80`);
    addSpace(2);
  };

  // Header - Ad ve Ünvan
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  const r = parseInt(cv.settings.themeColor.slice(1, 3), 16);
  const g = parseInt(cv.settings.themeColor.slice(3, 5), 16);
  const b = parseInt(cv.settings.themeColor.slice(5, 7), 16);
  pdf.setTextColor(r, g, b);
  pdf.text(cv.personalInfo.fullName || 'Ad Soyad', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(cv.personalInfo.title || 'Ünvan', margin, yPosition);
  yPosition += 8;

  // İletişim Bilgileri
  pdf.setFontSize(9);
  pdf.setTextColor(80, 80, 80);
  const contactInfo: string[] = [];
  if (cv.personalInfo.email) contactInfo.push(`Email: ${cv.personalInfo.email}`);
  if (cv.personalInfo.phone) contactInfo.push(`Tel: ${cv.personalInfo.phone}`);
  if (cv.personalInfo.location) contactInfo.push(`Konum: ${cv.personalInfo.location}`);
  if (cv.personalInfo.linkedin) contactInfo.push(`LinkedIn: ${cv.personalInfo.linkedin}`);
  if (cv.personalInfo.github) contactInfo.push(`GitHub: ${cv.personalInfo.github}`);
  
  contactInfo.forEach(info => {
    pdf.text(info, margin, yPosition);
    yPosition += 4;
  });

  addLine(cv.settings.themeColor);
  addSpace(3);

  // Özet
  if (cv.personalInfo.summary) {
    addSectionTitle('PROFESYONEL ÖZET', cv.settings.themeColor);
    addText(cv.personalInfo.summary, 10, 'normal', '#333333');
    addSpace(5);
  }

  // İş Deneyimi
  if (cv.experiences.length > 0) {
    addSectionTitle('İŞ DENEYİMİ', cv.settings.themeColor);
    
    cv.experiences.forEach((exp, index) => {
      checkPageBreak(20);
      
      // Pozisyon
      addText(exp.position, 12, 'bold', '#000000');
      
      // Şirket
      addText(exp.company, 11, 'normal', '#333333');
      
      // Tarih ve Konum
      const dateLocation = `${exp.startDate} - ${exp.current ? 'Devam Ediyor' : exp.endDate}${exp.location ? ' • ' + exp.location : ''}`;
      addText(dateLocation, 9, 'normal', '#666666');
      addSpace(2);
      
      // Açıklama
      if (exp.description) {
        addText(exp.description, 10, 'normal', '#333333');
        addSpace(2);
      }
      
      // Başarılar
      if (exp.highlights && exp.highlights.length > 0) {
        exp.highlights.forEach(highlight => {
          if (highlight) {
            checkPageBreak(5);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(50, 50, 50);
            
            // Bullet point ekle
            pdf.text('•', margin, yPosition);
            
            const lines = pdf.splitTextToSize(highlight, maxWidth - 5);
            lines.forEach((line: string, i: number) => {
              pdf.text(line, margin + 5, yPosition);
              yPosition += lineHeightMM;
            });
          }
        });
        addSpace(2);
      }
      
      // Teknolojiler
      if (exp.technologies && exp.technologies.length > 0) {
        addText(`Teknolojiler: ${exp.technologies.join(', ')}`, 9, 'normal', '#666666');
        addSpace(2);
      }
      
      if (index < cv.experiences.length - 1) {
        addSpace(5);
      }
    });
    addSpace(5);
  }

  // Eğitim
  if (cv.education.length > 0) {
    addSectionTitle('EĞİTİM', cv.settings.themeColor);
    
    cv.education.forEach((edu, index) => {
      checkPageBreak(15);
      
      // Derece ve Bölüm
      addText(`${edu.degree} • ${edu.field}`, 12, 'bold', '#000000');
      
      // Okul
      addText(edu.school, 11, 'normal', '#333333');
      
      // Tarih ve GPA
      let eduDetails = `${edu.startDate} - ${edu.current ? 'Devam Ediyor' : edu.endDate}`;
      if (edu.location) eduDetails += ` • ${edu.location}`;
      if (edu.gpa) eduDetails += ` • GPA: ${edu.gpa}`;
      addText(eduDetails, 9, 'normal', '#666666');
      
      if (index < cv.education.length - 1) {
        addSpace(5);
      }
    });
    addSpace(5);
  }

  // Yetenekler
  if (cv.skills.length > 0) {
    addSectionTitle('YETENEKLER', cv.settings.themeColor);
    
    // Kategorilere göre grupla
    const groupedSkills: Record<string, typeof cv.skills> = {};
    cv.skills.forEach(skill => {
      if (!groupedSkills[skill.category]) {
        groupedSkills[skill.category] = [];
      }
      groupedSkills[skill.category].push(skill);
    });
    
    Object.entries(groupedSkills).forEach(([category, skills]) => {
      checkPageBreak(10);
      
      const categoryLabels: Record<string, string> = {
        technical: 'Teknik',
        soft: 'Kişisel',
        language: 'Dil',
        tool: 'Araç',
        framework: 'Framework',
      };
      
      addText(categoryLabels[category] || category, 11, 'bold', '#333333');
      const skillNames = skills.map(s => s.name).join(' • ');
      addText(skillNames, 10, 'normal', '#555555');
      addSpace(3);
    });
    addSpace(5);
  }

  // Projeler
  if (cv.projects.length > 0) {
    addSectionTitle('PROJELER', cv.settings.themeColor);
    
    cv.projects.forEach((project, index) => {
      checkPageBreak(15);
      
      // Proje Adı
      addText(project.name, 12, 'bold', '#000000');
      
      // Rol
      if (project.role) {
        addText(project.role, 10, 'normal', '#666666');
      }
      
      // Açıklama
      addText(project.description, 10, 'normal', '#333333');
      
      // URL
      if (project.url) {
        addText(`URL: ${project.url}`, 9, 'normal', '#666666');
      }
      
      // Teknolojiler
      if (project.technologies.length > 0) {
        addText(`Teknolojiler: ${project.technologies.join(', ')}`, 9, 'normal', '#666666');
      }
      
      if (index < cv.projects.length - 1) {
        addSpace(5);
      }
    });
    addSpace(5);
  }

  // Sertifikalar
  if (cv.certifications.length > 0) {
    addSectionTitle('SERTİFİKALAR', cv.settings.themeColor);
    
    cv.certifications.forEach((cert, index) => {
      checkPageBreak(10);
      
      addText(cert.name, 11, 'bold', '#000000');
      let certDetails = cert.issuer;
      if (cert.date) certDetails += ` • ${cert.date}`;
      if (cert.credentialId) certDetails += ` • ID: ${cert.credentialId}`;
      addText(certDetails, 9, 'normal', '#666666');
      
      if (index < cv.certifications.length - 1) {
        addSpace(3);
      }
    });
    addSpace(5);
  }

  // Diller
  if (cv.languages.length > 0) {
    addSectionTitle('DİLLER', cv.settings.themeColor);
    
    const proficiencyLabels: Record<string, string> = {
      basic: 'Temel',
      conversational: 'Günlük Konuşma',
      professional: 'Profesyonel',
      native: 'Ana Dil',
    };
    
    const languageList = cv.languages
      .map(lang => `${lang.name} (${proficiencyLabels[lang.proficiency] || lang.proficiency})`)
      .join(' • ');
    
    addText(languageList, 10, 'normal', '#333333');
  }

  // PDF'i kaydet
  const fileName = `${cv.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
  pdf.save(fileName);
}

// HTML'den PDF oluşturma (alternatif yöntem - daha iyi görsel sonuç)
export async function exportToPDFFromHTML(elementId: string, fileName: string) {
  const html2canvas = (await import('html2canvas')).default;
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
}