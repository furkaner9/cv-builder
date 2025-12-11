// store/cvStore.ts - Zustand ile global state yönetimi

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CVData, Experience, Education, Skill, Project, Certification, Language } from '@/types/cv';

interface CVStore {
  // State
  currentCV: CVData | null;
  cvList: CVData[];
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;

  // Actions - CV Management
  createCV: (title: string) => string;
  loadCV: (id: string) => void;
  saveCV: () => Promise<void>;
  deleteCV: (id: string) => void;
  duplicateCV: (id: string) => void;
  updateCVTitle: (title: string) => void;

  // Actions - Personal Info
  updatePersonalInfo: (data: Partial<CVData['personalInfo']>) => void;

  // Actions - Experience
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  reorderExperiences: (startIndex: number, endIndex: number) => void;

  // Actions - Education
  addEducation: (education: Education) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;

  // Actions - Skills
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  reorderSkills: (startIndex: number, endIndex: number) => void;

  // Actions - Projects
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;

  // Actions - Certifications
  addCertification: (certification: Certification) => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;

  // Actions - Languages
  addLanguage: (language: Language) => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  deleteLanguage: (id: string) => void;

  // Actions - Settings
  updateSettings: (settings: Partial<CVData['settings']>) => void;

  // Utilities
  reset: () => void;
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const createEmptyCV = (title: string): CVData => ({
  id: generateId(),
  title,
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  settings: {
    templateId: 'modern',
    templateType: 'modern',
    themeColor: '#3B82F6',
    fontSize: 'medium',
    spacing: 'normal',
    showPhoto: true,
    showReferences: false,
    columnsLayout: 2,
    sectionOrder: [
      'personalInfo',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
    ],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
      // Initial State
      currentCV: null,
      cvList: [],
      isLoading: false,
      isSaving: false,
      lastSaved: null,

      // CV Management
      createCV: (title: string) => {
        const newCV = createEmptyCV(title);
        set((state) => ({
          currentCV: newCV,
          cvList: [...state.cvList, newCV],
        }));
        return newCV.id; // ID'yi döndür
      },

      loadCV: (id: string) => {
        const cv = get().cvList.find((c) => c.id === id);
        if (cv) {
          set({ currentCV: cv });
        }
      },

      saveCV: async () => {
        set({ isSaving: true });
        
        // Simulate save delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const currentCV = get().currentCV;
        if (currentCV) {
          set((state) => ({
            cvList: state.cvList.map((cv) =>
              cv.id === currentCV.id
                ? { ...currentCV, updatedAt: new Date() }
                : cv
            ),
            lastSaved: new Date(),
            isSaving: false,
          }));
        }
      },

      deleteCV: (id: string) => {
        set((state) => ({
          cvList: state.cvList.filter((cv) => cv.id !== id),
          currentCV: state.currentCV?.id === id ? null : state.currentCV,
        }));
      },

      duplicateCV: (id: string) => {
        const cv = get().cvList.find((c) => c.id === id);
        if (cv) {
          const duplicated: CVData = {
            ...cv,
            id: generateId(),
            title: `${cv.title} (Kopya)`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            cvList: [...state.cvList, duplicated],
          }));
        }
      },

      updateCVTitle: (title: string) => {
        set((state) => {
          if (!state.currentCV) return state;
          const updated = { ...state.currentCV, title };
          return {
            currentCV: updated,
            cvList: state.cvList.map((cv) =>
              cv.id === updated.id ? updated : cv
            ),
          };
        });
      },

      // Personal Info
      updatePersonalInfo: (data) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              personalInfo: { ...state.currentCV.personalInfo, ...data },
              updatedAt: new Date(),
            },
          };
        });
      },

      // Experience
      addExperience: (experience) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              experiences: [...state.currentCV.experiences, experience],
              updatedAt: new Date(),
            },
          };
        });
      },

      updateExperience: (id, data) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              experiences: state.currentCV.experiences.map((exp) =>
                exp.id === id ? { ...exp, ...data } : exp
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      deleteExperience: (id) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              experiences: state.currentCV.experiences.filter(
                (exp) => exp.id !== id
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      reorderExperiences: (startIndex, endIndex) => {
        set((state) => {
          if (!state.currentCV) return state;
          const result = Array.from(state.currentCV.experiences);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            currentCV: {
              ...state.currentCV,
              experiences: result,
              updatedAt: new Date(),
            },
          };
        });
      },

      // Education
      addEducation: (education) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              education: [...state.currentCV.education, education],
              updatedAt: new Date(),
            },
          };
        });
      },

      updateEducation: (id, data) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              education: state.currentCV.education.map((edu) =>
                edu.id === id ? { ...edu, ...data } : edu
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      deleteEducation: (id) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              education: state.currentCV.education.filter(
                (edu) => edu.id !== id
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      reorderEducation: (startIndex, endIndex) => {
        set((state) => {
          if (!state.currentCV) return state;
          const result = Array.from(state.currentCV.education);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            currentCV: {
              ...state.currentCV,
              education: result,
              updatedAt: new Date(),
            },
          };
        });
      },

      // Skills
      addSkill: (skill) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              skills: [...state.currentCV.skills, skill],
              updatedAt: new Date(),
            },
          };
        });
      },

      updateSkill: (id, data) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              skills: state.currentCV.skills.map((skill) =>
                skill.id === id ? { ...skill, ...data } : skill
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      deleteSkill: (id) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              skills: state.currentCV.skills.filter((skill) => skill.id !== id),
              updatedAt: new Date(),
            },
          };
        });
      },

      reorderSkills: (startIndex, endIndex) => {
        set((state) => {
          if (!state.currentCV) return state;
          const result = Array.from(state.currentCV.skills);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            currentCV: {
              ...state.currentCV,
              skills: result,
              updatedAt: new Date(),
            },
          };
        });
      },

      // Projects
      addProject: (project) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              projects: [...state.currentCV.projects, project],
              updatedAt: new Date(),
            },
          };
        });
      },

      updateProject: (id, data) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              projects: state.currentCV.projects.map((project) =>
                project.id === id ? { ...project, ...data } : project
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      deleteProject: (id) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              projects: state.currentCV.projects.filter(
                (project) => project.id !== id
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      reorderProjects: (startIndex, endIndex) => {
        set((state) => {
          if (!state.currentCV) return state;
          const result = Array.from(state.currentCV.projects);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            currentCV: {
              ...state.currentCV,
              projects: result,
              updatedAt: new Date(),
            },
          };
        });
      },

      // Certifications
      addCertification: (certification) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              certifications: [...state.currentCV.certifications, certification],
              updatedAt: new Date(),
            },
          };
        });
      },

      updateCertification: (id, data) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              certifications: state.currentCV.certifications.map((cert) =>
                cert.id === id ? { ...cert, ...data } : cert
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      deleteCertification: (id) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              certifications: state.currentCV.certifications.filter(
                (cert) => cert.id !== id
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      // Languages
      addLanguage: (language) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              languages: [...state.currentCV.languages, language],
              updatedAt: new Date(),
            },
          };
        });
      },

      updateLanguage: (id, data) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              languages: state.currentCV.languages.map((lang) =>
                lang.id === id ? { ...lang, ...data } : lang
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      deleteLanguage: (id) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              languages: state.currentCV.languages.filter(
                (lang) => lang.id !== id
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      // Settings
      updateSettings: (settings) => {
        set((state) => {
          if (!state.currentCV) return state;
          return {
            currentCV: {
              ...state.currentCV,
              settings: { ...state.currentCV.settings, ...settings },
              updatedAt: new Date(),
            },
          };
        });
      },

      // Utilities
      reset: () => {
        set({
          currentCV: null,
          cvList: [],
          isLoading: false,
          isSaving: false,
          lastSaved: null,
        });
      },

      exportToJSON: () => {
        const currentCV = get().currentCV;
        return currentCV ? JSON.stringify(currentCV, null, 2) : '';
      },

      importFromJSON: (json: string) => {
        try {
          const cv: CVData = JSON.parse(json);
          cv.id = generateId(); // Yeni ID ata
          set((state) => ({
            currentCV: cv,
            cvList: [...state.cvList, cv],
          }));
        } catch (error) {
          console.error('Invalid JSON:', error);
        }
      },
    }),
    {
      name: 'cv-storage',
      partialize: (state) => ({
        cvList: state.cvList,
        currentCV: state.currentCV,
      }),
    }
  )
);