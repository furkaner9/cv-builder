"use client";

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Briefcase,
  QrCode,
  GitCompare,
  Sparkles,
  BarChart3,
  Clock,
  TrendingUp,
  Calendar,
  // Target, // Kullanılmıyor, kaldırılabilir
  Eye,
  Edit,
  Download,
  Copy,
  // Trash2, // Kullanılmıyor, kaldırılabilir
  MoreVertical,
  CheckCircle,
  // AlertCircle, // Kullanılmıyor, kaldırılabilir
  ArrowRight,
  Zap,
  // Globe, // Kullanılmıyor, kaldırılabilir
  Award,
  // Users, // Kullanılmıyor, kaldırılabilir
  Search,
  // Filter, // Kullanılmıyor, kaldırılabilir
  Building2,
  Bell, // Lucide-react'tan gelen Bell ikonu
} from 'lucide-react';

// --- Mock Data Types ---
interface CV {
  id: string;
  title: string;
  lastUpdated: Date;
  templateType: string;
  completeness: number;
  applicationCount: number;
  viewCount: number;
}

interface Application {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  appliedDate: Date;
  cvId: string;
}

interface Activity {
  id: string;
  type: 'cv_created' | 'cv_updated' | 'application' | 'interview' | 'offer';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
}

// --- Mock Data ---
const mockCVs: CV[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer CV',
    lastUpdated: new Date('2024-01-20'),
    templateType: 'Modern',
    completeness: 95,
    applicationCount: 8,
    viewCount: 145,
  },
  {
    id: '2',
    title: 'Full Stack Developer CV',
    lastUpdated: new Date('2024-01-18'),
    templateType: 'Minimal',
    completeness: 87,
    applicationCount: 5,
    viewCount: 98,
  },
  {
    id: '3',
    title: 'React Developer CV',
    lastUpdated: new Date('2024-01-15'),
    templateType: 'Creative',
    completeness: 72,
    applicationCount: 3,
    viewCount: 56,
  },
  {
    id: '4',
    title: 'Backend (Node.js) CV',
    lastUpdated: new Date('2024-01-10'),
    templateType: 'Professional',
    completeness: 60,
    applicationCount: 1,
    viewCount: 20,
  },
];

const mockApplications: Application[] = [
  {
    id: '1',
    company: 'Google',
    position: 'Senior Frontend Developer',
    status: 'interview',
    appliedDate: new Date('2024-01-19'),
    cvId: '1',
  },
  {
    id: '2',
    company: 'Microsoft',
    position: 'Full Stack Engineer',
    status: 'screening',
    appliedDate: new Date('2024-01-18'),
    cvId: '1',
  },
  {
    id: '3',
    company: 'Meta',
    position: 'React Developer',
    status: 'applied',
    appliedDate: new Date('2024-01-17'),
    cvId: '2',
  },
  {
    id: '4',
    company: 'Amazon',
    position: 'Frontend Developer',
    status: 'offer',
    appliedDate: new Date('2024-01-15'),
    cvId: '1',
  },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'offer',
    title: 'Teklif Alındı! 🎉',
    description: 'Amazon - Frontend Developer pozisyonu için teklif aldınız',
    timestamp: new Date('2024-01-20T14:30:00'),
    icon: '🎉',
  },
  {
    id: '2',
    type: 'interview',
    title: 'Mülakat Planlandı',
    description: 'Google ile 25 Ocak, 14:00 video görüşmesi',
    timestamp: new Date('2024-01-19T10:15:00'),
    icon: '📅',
  },
  {
    id: '3',
    type: 'application',
    title: 'Yeni Başvuru',
    description: 'Meta - React Developer pozisyonuna başvurdunuz',
    timestamp: new Date('2024-01-17T16:45:00'),
    icon: '📤',
  },
  {
    id: '4',
    type: 'cv_updated',
    title: 'CV Güncellendi',
    description: 'Senior Frontend Developer CV - Yeni proje eklendi',
    timestamp: new Date('2024-01-16T09:20:00'),
    icon: '✏️',
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  applied: { label: 'Başvuruldu', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  screening: { label: 'İnceleniyor', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  interview: { label: 'Mülakat', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  offer: { label: 'Teklif', color: 'text-green-700', bgColor: 'bg-green-100' },
  rejected: { label: 'Red', color: 'text-red-700', bgColor: 'bg-red-100' },
};

// --- Main Dashboard Component ---
export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedCV, setSelectedCV] = useState<CV | null>(null); // Şimdilik kullanılmıyor

  // İstatistikleri hesapla
  const stats = {
    totalCVs: mockCVs.length,
    totalApplications: mockApplications.length,
    activeApplications: mockApplications.filter(a => !['rejected'].includes(a.status)).length,
    interviews: mockApplications.filter(a => a.status === 'interview').length,
    offers: mockApplications.filter(a => a.status === 'offer').length,
    portfolioViews: mockCVs.reduce((sum, cv) => sum + cv.viewCount, 0),
  };

  // CV Arama Filtrelemesi
  const filteredCVs = mockCVs.filter(cv =>
    cv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">CVGenius</h1>
                <p className="text-xs text-gray-500">Profesyonel CV Yönetimi</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="hidden md:inline">Bildirimler</span>
                </button>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </div>

              <button className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 font-medium shadow-sm transition-all hover:shadow-md active:scale-95">
                <Plus className="w-4 h-4" />
                Yeni CV
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Hoş Geldiniz! 👋</h2>
          <p className="text-gray-600">İşte kariyerinize genel bakış</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +2 bu ay
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalCVs}</h3>
            <p className="text-sm text-gray-600 font-medium">Toplam CV</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +5 bu hafta
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalApplications}</h3>
            <p className="text-sm text-gray-600 font-medium">Başvuru</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-blue-600 flex items-center gap-1 font-medium bg-blue-50 px-2 py-1 rounded-full">
                {stats.interviews} mülakat
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.offers}</h3>
            <p className="text-sm text-gray-600 font-medium">Teklif</p>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +24%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.portfolioViews}</h3>
            <p className="text-sm text-gray-600 font-medium">Portfolio Görüntüleme</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all hover:border-blue-300 text-left group">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold mb-1 text-gray-900">ATS Optimizasyon</h3>
            <p className="text-xs text-gray-600">CV'nizi ATS sistemlerine optimize edin</p>
          </button>

          <button className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all hover:border-purple-300 text-left group">
            <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <GitCompare className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold mb-1 text-gray-900">CV Karşılaştırma</h3>
            <p className="text-xs text-gray-600">İki CV'yi yan yana karşılaştırın</p>
          </button>

          <button className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all hover:border-green-300 text-left group">
            <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold mb-1 text-gray-900">QR & Portfolio</h3>
            <p className="text-xs text-gray-600">Online portfolio oluşturun</p>
          </button>

          <button className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all hover:border-indigo-300 text-left group">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold mb-1 text-gray-900">Analitik</h3>
            <p className="text-xs text-gray-600">Başvuru istatistiklerinizi görün</p>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (Left - 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* CV'lerim */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">CV'lerim</h2>
                  <p className="text-sm text-gray-500">Tüm özgeçmişleriniz tek bir yerde</p>
                </div>
                
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="CV ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-xs"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredCVs.length > 0 ? (
                  filteredCVs.map((cv) => (
                  <div
                    key={cv.id}
                    className="p-6 hover:bg-blue-50/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">{cv.title}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">{cv.templateType}</span>
                           • Güncelleme: {new Date(cv.lastUpdated).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-gray-600 font-medium">Doluluk Oranı</span>
                          <span className="font-bold text-blue-700">{cv.completeness}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${cv.completeness}%` }}
                          />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-gray-600 mb-5">
                      <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                        <Briefcase className="w-3.5 h-3.5" />
                        <b>{cv.applicationCount}</b> başvuru
                      </span>
                      <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md">
                        <Eye className="w-3.5 h-3.5" />
                        <b>{cv.viewCount}</b> görüntüleme
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-2 font-medium text-gray-700 transition-all active:scale-95 bg-white shadow-xs">
                        <Edit className="w-4 h-4" />
                        Düzenle
                      </button>
                      <button className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-2 font-medium text-gray-700 transition-all active:scale-95 bg-white shadow-xs">
                        <Download className="w-4 h-4" />
                        İndir
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 text-gray-600 transition-all active:scale-95 bg-white shadow-xs tooltip" title="Kopyala">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        Aradığınız kriterlere uygun CV bulunamadı.
                    </div>
                )}
              </div>
              {filteredCVs.length > 0 && (
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto transition-colors">
                      Tüm CV'leri Gör
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
              )}
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-xl font-semibold text-gray-900">Son Başvurular</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors">
                  Tümünü Gör
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {mockApplications.slice(0, 4).map((app) => {
                  const statusConfig = STATUS_CONFIG[app.status];
                  return (
                    <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{app.position}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            {app.company}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color} border border-current/10`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        Başvuru: {new Date(app.appliedDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Column (Right - 1/3) */}
          <div className="space-y-8">
            {/* Activity Feed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                  <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  Son Aktiviteler
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {mockActivities.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4 relative">
                    {/* Dikey çizgi */}
                    {index !== mockActivities.length - 1 && (
                        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-100 -z-10 h-full"></div>
                    )}

                    <div className="shrink-0 w-10 h-10 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-lg shadow-xs z-10">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h4 className="font-semibold text-sm mb-1 text-gray-900">{activity.title}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{activity.description}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.timestamp).toLocaleString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100/50 p-6 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-purple-900">
                <Calendar className="w-5 h-5 text-purple-600" />
                Yaklaşan Mülakatlar
              </h3>

              <div className="space-y-3">
                <div className="bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-purple-100 shadow-xs hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-gray-900">Google - Video Mülakat</h4>
                    <span className="text-xs text-white bg-purple-600 px-2 py-0.5 rounded-full font-medium">Bugün</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 font-medium">Senior Frontend Developer</p>
                  <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg w-fit font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    14:00 - 15:00
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-purple-100 shadow-xs hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-gray-900">Microsoft - Teknik Mülakat</h4>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full font-medium">Yarın</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 font-medium">Full Stack Engineer</p>
                  <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg w-fit font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    10:00 - 11:30
                  </div>
                </div>
              </div>

              <button className="w-full mt-5 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-sm font-medium transition-colors shadow-sm hover:shadow active:scale-95">
                Tüm Mülakat Takvimi
              </button>
            </div>

            {/* Tips */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100/50 p-6 shadow-sm relative overflow-hidden">
              {/* Dekoratif arka plan ikonu */}
              <Award className="absolute -bottom-6 -right-6 w-24 h-24 text-green-600/10 rotate-12" />
              
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-green-900 relative z-10">
                <Award className="w-5 h-5 text-green-600 fill-green-100" />
                Günün İpucu
              </h3>

              <p className="text-sm text-green-800 mb-4 leading-relaxed relative z-10 font-medium">
                "CV'nizde başarılarınızı sadece listelemek yerine sayısal verilerle destekleyin. Örneğin: 'Satışları artırdım' yerine '<span className="font-bold text-green-700">Satışları %30 artırdım</span>' yazmak çok daha etkilidir."
              </p>

              <button className="text-sm text-green-700 hover:text-green-800 hover:underline font-semibold flex items-center gap-1 relative z-10 transition-colors">
                Daha Fazla Kariyer İpucu
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}