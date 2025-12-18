"use client";

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Calendar,
  Building2,
  MapPin,
  Clock,
  TrendingUp,
  // BarChart3, // Kullanılmıyor, kaldırılabilir
  Eye,
  Edit,
  // MoreVertical, // Kullanılmıyor, kaldırılabilir
  CheckCircle,
  X,
  Save,
  Trash2,
  Filter, // Filtre ikonu eklendi
  ArrowRight // Yön ikonu eklendi
} from 'lucide-react';

// Mock data types
interface JobApplication {
  id: string;
  cvId: string;
  company: string;
  position: string;
  location: string;
  workMode: 'remote' | 'hybrid' | 'onsite';
  status: 'draft' | 'applied' | 'screening' | 'interview' | 'offer' | 'accepted' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  appliedDate: Date;
  salary?: { min: number; max: number; currency: string };
  interviews: any[];
  notes?: string;
  tags?: string[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
  draft: { label: 'Taslak', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '📝' },
  applied: { label: 'Başvuruldu', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '📤' },
  screening: { label: 'İnceleniyor', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '🔍' },
  interview: { label: 'Mülakat', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '💼' },
  offer: { label: 'Teklif Alındı', color: 'text-green-600', bgColor: 'bg-green-100', icon: '🎉' },
  accepted: { label: 'Kabul Edildi', color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: '✅' },
  rejected: { label: 'Reddedildi', color: 'text-red-600', bgColor: 'bg-red-100', icon: '❌' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Düşük', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  medium: { label: 'Orta', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  high: { label: 'Yüksek', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  urgent: { label: 'Acil', color: 'text-red-600', bgColor: 'bg-red-100' },
};

// Mock data
const initialApplications: JobApplication[] = [
  {
    id: '1',
    cvId: 'cv1',
    company: 'Google',
    position: 'Senior Frontend Developer',
    location: 'İstanbul, TR',
    workMode: 'hybrid',
    status: 'interview',
    priority: 'high',
    appliedDate: new Date('2024-01-15'),
    salary: { min: 80000, max: 120000, currency: 'TRY' },
    interviews: [{ date: new Date('2024-02-01') }],
    tags: ['react', 'typescript'],
  },
  {
    id: '2',
    cvId: 'cv1',
    company: 'Microsoft',
    position: 'Full Stack Engineer',
    location: 'Remote',
    workMode: 'remote',
    status: 'applied',
    priority: 'medium',
    appliedDate: new Date('2024-01-20'),
    interviews: [],
  },
  {
    id: '3',
    cvId: 'cv1',
    company: 'Meta',
    position: 'React Developer',
    location: 'Ankara, TR',
    workMode: 'onsite',
    status: 'screening',
    priority: 'urgent',
    appliedDate: new Date('2024-01-25'),
    interviews: [],
  },
];

// --- Modern Stat Card Component ---
const StatCard = ({ icon: Icon, label, value, colorClass }: any) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${colorClass.replace('text-', 'bg-').replace('600', '100')} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <span className={`text-xs flex items-center gap-1 font-medium ${colorClass.replace('text-', 'bg-').replace('600', '50')} ${colorClass} px-2 py-1 rounded-full`}>
        <TrendingUp className="w-3 h-3" />
        Güncel
      </span>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm text-gray-600 font-medium">{label}</p>
  </div>
);


export default function ApplicationTrackerPage() {
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [newApp, setNewApp] = useState({
    company: '',
    position: '',
    location: '',
    workMode: 'hybrid' as const,
    status: 'draft' as const,
    priority: 'medium' as const,
  });

  // Statistics
  const stats = {
    total: applications.length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    successRate: Math.round((applications.filter(a => ['offer', 'accepted'].includes(a.status)).length / (applications.length || 1)) * 100) || 0, // Sıfıra bölme hatasını önle
  };

  // Filter applications
  const filteredApps = applications.filter(app => {
    const matchesSearch = !searchQuery ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddApplication = () => {
    if (!newApp.company || !newApp.position) return;

    const app: JobApplication = {
      id: Date.now().toString(),
      cvId: 'cv1',
      ...newApp,
      appliedDate: new Date(),
      interviews: [],
    };

    setApplications([...applications, app]);
    setShowNewModal(false);
    setNewApp({ company: '', position: '', location: '', workMode: 'hybrid', status: 'draft', priority: 'medium' });
  };

  const handleDeleteApplication = (id: string) => {
    if (confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) {
      setApplications(applications.filter(a => a.id !== id));
      setSelectedApp(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 font-sans">
      {/* --- Modern Header --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm supports-backdrop-filter:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Başvuru Takip</h1>
                <p className="text-xs text-gray-500 font-medium">{stats.total} toplam başvuru</p>
              </div>
            </div>

            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 font-medium shadow-sm transition-all hover:shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Yeni Başvuru</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* --- Page Title --- */}
        <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Başvurularım 🚀</h2>
            <p className="text-gray-600">Kariyer yolculuğunuzdaki tüm adımları buradan yönetin.</p>
        </div>

        {/* --- Modern Statistics --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={Briefcase} label="Toplam Başvuru" value={stats.total} colorClass="text-blue-600" />
            <StatCard icon={Calendar} label="Mülakat" value={stats.interview} colorClass="text-purple-600" />
            <StatCard icon={CheckCircle} label="Teklif" value={stats.offer} colorClass="text-green-600" />
            <StatCard icon={TrendingUp} label="Başarı Oranı" value={`%${stats.successRate}`} colorClass="text-emerald-600" />
        </div>

        {/* --- Modern Search and Filters --- */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Şirket veya pozisyon ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-sm"
              />
            </div>

            <div className="relative min-w-[200px]">
                 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-sm appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: '2.5rem' }}
                >
                  <option value="all">Tüm Durumlar</option>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </select>
            </div>
          </div>
        </div>

        {/* --- Applications Grid --- */}
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center border border-gray-100 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'Sonuç Bulunamadı' : 'Henüz Başvuru Yok'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              {searchQuery || statusFilter !== 'all'
                ? 'Arama kriterlerinize uygun bir başvuru bulunamadı. Filtreleri temizlemeyi deneyin.'
                : 'Kariyer yolculuğunuza başlamak için ilk iş başvurunuzu ekleyin.'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => setShowNewModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm hover:shadow transition-all active:scale-95 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Yeni Başvuru Ekle
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => {
              const statusConfig = STATUS_CONFIG[app.status];
              const priorityConfig = PRIORITY_CONFIG[app.priority];

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer group"
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{app.position}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1 font-medium">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          {app.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color} border border-current/10 flex items-center gap-1`}>
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${priorityConfig.bgColor} ${priorityConfig.color} border border-current/10`}>
                        {priorityConfig.label}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-sm text-gray-600">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">
                          {app.location} • {app.workMode === 'remote' ? '🏠 Uzaktan' : app.workMode === 'hybrid' ? '🔄 Hibrit' : '🏢 Ofis'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Başvuru: {new Date(app.appliedDate).toLocaleDateString('tr-TR')}</span>
                      </div>

                      {app.interviews.length > 0 && (
                        <div className="flex items-center gap-2.5 text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-md w-fit">
                          <Clock className="w-4 h-4" />
                          <span>{app.interviews.length} mülakat planlandı</span>
                        </div>
                      )}

                      {app.salary && (
                        <div className="flex items-center gap-2.5 text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md w-fit">
                           <span className="text-lg">💰</span>
                          <span>{app.salary.min.toLocaleString()} - {app.salary.max.toLocaleString()} {app.salary.currency}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                      <button className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 font-medium text-gray-700 transition-all active:scale-95 bg-white shadow-xs">
                        <Eye className="w-4 h-4" />
                        Detay
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 font-medium text-gray-700 transition-all active:scale-95 bg-white shadow-xs">
                        <Edit className="w-4 h-4" />
                        Düzenle
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- Modern New Application Modal --- */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Yeni Başvuru Ekle
              </h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Şirket Adı *</label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                        type="text"
                        value={newApp.company}
                        onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Örn: Google, Trendyol"
                        />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pozisyon *</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                        type="text"
                        value={newApp.position}
                        onChange={(e) => setNewApp({ ...newApp, position: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Örn: Senior Frontend Developer"
                        />
                    </div>
                  </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasyon</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                    type="text"
                    value={newApp.location}
                    onChange={(e) => setNewApp({ ...newApp, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Örn: İstanbul, Hibrit"
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Çalışma Modu</label>
                  <select
                    value={newApp.workMode}
                    onChange={(e) => setNewApp({ ...newApp, workMode: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.75rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: '2.5rem' }}
                  >
                    <option value="remote">🏠 Uzaktan (Remote)</option>
                    <option value="hybrid">🔄 Hibrit</option>
                    <option value="onsite">🏢 Ofis (On-site)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Öncelik</label>
                  <select
                    value={newApp.priority}
                    onChange={(e) => setNewApp({ ...newApp, priority: e.target.value as any })}
                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                     style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.75rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: '2.5rem' }}
                  >
                    <option value="low">🟢 Düşük</option>
                    <option value="medium">🔵 Orta</option>
                    <option value="high">🟠 Yüksek</option>
                    <option value="urgent">🔴 Acil</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleAddApplication}
                disabled={!newApp.company || !newApp.position}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm transition-all active:scale-95"
              >
                <Save className="w-5 h-5" />
                Başvuruyu Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modern Application Detail Modal --- */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
              <div className='flex items-center gap-4'>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                   </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedApp.position}</h2>
                    <p className="text-gray-600 font-medium">{selectedApp.company}</p>
                  </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex flex-wrap gap-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${STATUS_CONFIG[selectedApp.status].bgColor} ${STATUS_CONFIG[selectedApp.status].color} border border-current/10 flex items-center gap-2`}>
                  <span className="text-xl">{STATUS_CONFIG[selectedApp.status].icon}</span> {STATUS_CONFIG[selectedApp.status].label}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${PRIORITY_CONFIG[selectedApp.priority].bgColor} ${PRIORITY_CONFIG[selectedApp.priority].color} border border-current/10`}>
                  Öncelik: {PRIORITY_CONFIG[selectedApp.priority].label}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                   <div className="p-2 bg-gray-100 rounded-lg"><MapPin className="w-5 h-5 text-gray-600" /></div>
                   <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Lokasyon</p>
                      <p className="font-semibold text-gray-900">{selectedApp.location}</p>
                   </div>
                </div>
                 <div className="flex items-start gap-3">
                   <div className="p-2 bg-gray-100 rounded-lg"><Briefcase className="w-5 h-5 text-gray-600" /></div>
                   <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Çalışma Modu</p>
                      <p className="font-semibold text-gray-900 capitalize">{selectedApp.workMode === 'remote' ? '🏠 Uzaktan' : selectedApp.workMode === 'hybrid' ? '🔄 Hibrit' : '🏢 Ofis'}</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <div className="p-2 bg-gray-100 rounded-lg"><Calendar className="w-5 h-5 text-gray-600" /></div>
                   <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Başvuru Tarihi</p>
                      <p className="font-semibold text-gray-900">{new Date(selectedApp.appliedDate).toLocaleDateString('tr-TR')}</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <div className="p-2 bg-purple-100 rounded-lg"><Clock className="w-5 h-5 text-purple-600" /></div>
                   <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Mülakat Süreci</p>
                      <p className="font-semibold text-purple-700">{selectedApp.interviews.length > 0 ? `${selectedApp.interviews.length} mülakat planlandı` : 'Henüz mülakat yok'}</p>
                   </div>
                </div>
              </div>

              {selectedApp.salary && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
                   <div className="p-3 bg-green-100 rounded-full">
                      <span className="text-2xl">💰</span>
                   </div>
                   <div>
                      <p className="text-sm text-green-700 font-medium mb-1">Maaş Beklentisi / Aralığı</p>
                      <p className="text-xl font-bold text-green-800">
                         {selectedApp.salary.min.toLocaleString()} - {selectedApp.salary.max.toLocaleString()} {selectedApp.salary.currency}
                      </p>
                   </div>
                </div>
              )}

              {selectedApp.tags && selectedApp.tags.length > 0 && (
                  <div>
                     <p className="text-sm text-gray-500 font-medium mb-3 flex items-center gap-2"><Filter className="w-4 h-4"/> Etiketler</p>
                     <div className="flex flex-wrap gap-2">
                        {selectedApp.tags.map((tag, index) => (
                           <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">#{tag}</span>
                        ))}
                     </div>
                  </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between gap-4 rounded-b-2xl">
              <button
                onClick={() => handleDeleteApplication(selectedApp.id)}
                className="px-4 py-3 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Başvuruyu Sil
              </button>
              <button
                onClick={() => alert('Düzenleme ekranı yakında eklenecek!')}
                 className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 font-medium shadow-xs transition-all"
              >
                 <Edit className="w-5 h-5"/> Düzenle
              </button>
              <button
                onClick={() => setSelectedApp(null)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium shadow-sm transition-all active:scale-95"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}