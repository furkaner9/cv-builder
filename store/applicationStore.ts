// store/applicationStore.ts - Başvuru Takip State Management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  JobApplication, 
  ApplicationStatus, 
  ApplicationActivity,
  Interview,
  ApplicationStatistics,
} from '@/types/application';
import { 
  createEmptyApplication, 
  changeApplicationStatus,
  calculateStatistics,
} from '@/types/application';

interface ApplicationStore {
  // State
  applications: JobApplication[];
  currentApplication: JobApplication | null;
  
  // Actions - Application Management
  createApplication: (cvId: string, cvTitle: string) => string;
  loadApplication: (id: string) => void;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;
  duplicateApplication: (id: string) => void;
  
  // Actions - Status Management
  updateStatus: (id: string, status: ApplicationStatus) => void;
  
  // Actions - Activities
  addActivity: (applicationId: string, activity: Omit<ApplicationActivity, 'id' | 'applicationId' | 'createdAt'>) => void;
  
  // Actions - Interviews
  addInterview: (applicationId: string, interview: Omit<Interview, 'id' | 'applicationId' | 'createdAt'>) => void;
  updateInterview: (applicationId: string, interviewId: string, updates: Partial<Interview>) => void;
  deleteInterview: (applicationId: string, interviewId: string) => void;
  
  // Queries
  getApplicationById: (id: string) => JobApplication | undefined;
  getApplicationsByCV: (cvId: string) => JobApplication[];
  getApplicationsByStatus: (status: ApplicationStatus) => JobApplication[];
  getApplicationsByCompany: (company: string) => JobApplication[];
  getUpcomingInterviews: () => Interview[];
  getStatistics: () => ApplicationStatistics;
  
  // Filters & Search
  searchApplications: (query: string) => JobApplication[];
  filterApplications: (filters: ApplicationFilters) => JobApplication[];
  
  // Utilities
  archiveApplication: (id: string) => void;
  unarchiveApplication: (id: string) => void;
}

interface ApplicationFilters {
  status?: ApplicationStatus[];
  priority?: string[];
  companies?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  hasInterview?: boolean;
  archived?: boolean;
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      // Initial State
      applications: [],
      currentApplication: null,

      // Create new application
      createApplication: (cvId: string, cvTitle: string) => {
        const newApp = createEmptyApplication(cvId, cvTitle);
        set((state) => ({
          applications: [...state.applications, newApp],
          currentApplication: newApp,
        }));
        return newApp.id;
      },

      // Load application
      loadApplication: (id: string) => {
        const app = get().applications.find((a) => a.id === id);
        if (app) {
          set({ currentApplication: app });
        }
      },

      // Update application
      updateApplication: (id: string, updates: Partial<JobApplication>) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, ...updates, updatedAt: new Date() }
              : app
          ),
          currentApplication:
            state.currentApplication?.id === id
              ? { ...state.currentApplication, ...updates, updatedAt: new Date() }
              : state.currentApplication,
        }));
      },

      // Delete application
      deleteApplication: (id: string) => {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
          currentApplication:
            state.currentApplication?.id === id ? null : state.currentApplication,
        }));
      },

      // Duplicate application
      duplicateApplication: (id: string) => {
        const app = get().applications.find((a) => a.id === id);
        if (app) {
          const duplicated: JobApplication = {
            ...app,
            id: `app-${Date.now()}`,
            status: 'draft',
            appliedDate: new Date(),
            activities: [],
            interviews: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            applications: [...state.applications, duplicated],
          }));
        }
      },

      // Update status
      updateStatus: (id: string, status: ApplicationStatus) => {
        const app = get().applications.find((a) => a.id === id);
        if (app) {
          const updated = changeApplicationStatus(app, status);
          set((state) => ({
            applications: state.applications.map((a) =>
              a.id === id ? updated : a
            ),
            currentApplication:
              state.currentApplication?.id === id ? updated : state.currentApplication,
          }));
        }
      },

      // Add activity
      addActivity: (applicationId: string, activity) => {
        const newActivity: ApplicationActivity = {
          ...activity,
          id: `activity-${Date.now()}`,
          applicationId,
          createdAt: new Date(),
        };

        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId
              ? {
                  ...app,
                  activities: [...app.activities, newActivity],
                  updatedAt: new Date(),
                }
              : app
          ),
        }));
      },

      // Add interview
      addInterview: (applicationId: string, interview) => {
        const newInterview: Interview = {
          ...interview,
          id: `interview-${Date.now()}`,
          applicationId,
          createdAt: new Date(),
        };

        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId
              ? {
                  ...app,
                  interviews: [...app.interviews, newInterview],
                  updatedAt: new Date(),
                }
              : app
          ),
        }));
      },

      // Update interview
      updateInterview: (applicationId: string, interviewId: string, updates) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId
              ? {
                  ...app,
                  interviews: app.interviews.map((interview) =>
                    interview.id === interviewId
                      ? { ...interview, ...updates }
                      : interview
                  ),
                  updatedAt: new Date(),
                }
              : app
          ),
        }));
      },

      // Delete interview
      deleteInterview: (applicationId: string, interviewId: string) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId
              ? {
                  ...app,
                  interviews: app.interviews.filter((i) => i.id !== interviewId),
                  updatedAt: new Date(),
                }
              : app
          ),
        }));
      },

      // Get application by ID
      getApplicationById: (id: string) => {
        return get().applications.find((app) => app.id === id);
      },

      // Get applications by CV
      getApplicationsByCV: (cvId: string) => {
        return get().applications.filter((app) => app.cvId === cvId);
      },

      // Get applications by status
      getApplicationsByStatus: (status: ApplicationStatus) => {
        return get().applications.filter((app) => app.status === status);
      },

      // Get applications by company
      getApplicationsByCompany: (company: string) => {
        return get().applications.filter(
          (app) => app.company.toLowerCase() === company.toLowerCase()
        );
      },

      // Get upcoming interviews
      getUpcomingInterviews: () => {
        const now = new Date();
        const allInterviews: Interview[] = [];

        get().applications.forEach((app) => {
          app.interviews
            .filter((interview) => !interview.completed && new Date(interview.date) >= now)
            .forEach((interview) => allInterviews.push(interview));
        });

        return allInterviews.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      },

      // Get statistics
      getStatistics: () => {
        return calculateStatistics(get().applications);
      },

      // Search applications
      searchApplications: (query: string) => {
        const lowerQuery = query.toLowerCase();
        return get().applications.filter(
          (app) =>
            app.company.toLowerCase().includes(lowerQuery) ||
            app.position.toLowerCase().includes(lowerQuery) ||
            app.notes?.toLowerCase().includes(lowerQuery) ||
            app.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },

      // Filter applications
      filterApplications: (filters: ApplicationFilters) => {
        let filtered = get().applications;

        if (filters.status && filters.status.length > 0) {
          filtered = filtered.filter((app) => filters.status!.includes(app.status));
        }

        if (filters.priority && filters.priority.length > 0) {
          filtered = filtered.filter((app) => filters.priority!.includes(app.priority));
        }

        if (filters.companies && filters.companies.length > 0) {
          filtered = filtered.filter((app) =>
            filters.companies!.includes(app.company)
          );
        }

        if (filters.dateFrom) {
          filtered = filtered.filter(
            (app) => new Date(app.appliedDate) >= filters.dateFrom!
          );
        }

        if (filters.dateTo) {
          filtered = filtered.filter(
            (app) => new Date(app.appliedDate) <= filters.dateTo!
          );
        }

        if (filters.hasInterview !== undefined) {
          filtered = filtered.filter(
            (app) => (app.interviews.length > 0) === filters.hasInterview
          );
        }

        if (filters.archived !== undefined) {
          filtered = filtered.filter(
            (app) => (app.archivedAt !== undefined) === filters.archived
          );
        }

        return filtered;
      },

      // Archive application
      archiveApplication: (id: string) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, archivedAt: new Date(), updatedAt: new Date() }
              : app
          ),
        }));
      },

      // Unarchive application
      unarchiveApplication: (id: string) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, archivedAt: undefined, updatedAt: new Date() }
              : app
          ),
        }));
      },
    }),
    {
      name: 'application-tracker-storage',
      partialize: (state) => ({
        applications: state.applications,
      }),
    }
  )
);