"use client";
import React, { useState, useEffect } from 'react';
import { useCVStore } from '@/store/cvStore';
import { useApplicationStore } from '@/store/applicationStore';
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
  Target,
  Eye,
  Edit,
  Download,
  Copy,
  Trash2,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap,
  Globe,
  Award,
  Search,
  Building2,
  Loader2,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Taslak', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  applied: { label: 'Başvuruldu', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  screening: { label: 'İnceleniyor', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  interview: { label: 'Mülakat', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  offer: { label: 'Teklif', color: 'text-green-700', bgColor: 'bg-green-100' },
  accepted: { label: 'Kabul', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  rejected: { label: 'Red', color: 'text-red-700', bgColor: 'bg-red-100' },
  withdrawn: { label: 'Geri Çekildi', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Store'lardan veri çek
  const { cvList, createCV } = useCVStore();
  const {
    applications,
    getStatistics,
    getUpcomingInterviews,
    getApplicationsByCV,
  } = useApplicationStore();

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // İstatistikleri hesapla
  const appStats = getStatistics();

  // Portfolio görüntüleme sayısını hesapla (localStorage'dan)
  const portfolioViews = cvList.reduce((sum, cv) => {
    const portfolio = localStorage.getItem(`portfolio-${cv.id}`);
    if (portfolio) {
      const p = JSON.parse(portfolio);
      return sum + (p.viewCount || 0);
    }
    return sum;
  }, 0);

  // CV tamlık hesapla
  const calculateCompleteness = (cv: any): number => {
    let score = 0;

    // Kişisel bilgiler (20 puan)
    if (cv.personalInfo.fullName) score += 5;
    if (cv.personalInfo.email) score += 5;
    if (cv.personalInfo.phone) score += 5;
    if (cv.personalInfo.summary && cv.personalInfo.summary.length > 50) score += 5;

    // Deneyim (30 puan)
    if (cv.experiences.length > 0) score += 15;
    if (cv.experiences.length >= 2) score += 10;
    if (cv.experiences.some((e: any) => e.highlights.length > 0)) score += 5;

    // Eğitim (20 puan)
    if (cv.education.length > 0) score += 15;
    if (cv.education.length >= 2) score += 5;

    // Yetenekler (15 puan)
    if (cv.skills.length >= 3) score += 8;
    if (cv.skills.length >= 5) score += 7;

    // Projeler (10 puan)
    if (cv.projects.length > 0) score += 5;
    if (cv.projects.length >= 2) score += 5;

    // Sertifikalar (5 puan)
    if (cv.certifications.length > 0) score += 5;

    return Math.min(100, score);
  };

  // Stats
  const stats = {
    totalCVs: cvList.length,
    totalApplications: applications.length,
    activeApplications: applications.filter(a => !['rejected', 'withdrawn'].includes(a.status)).length,
    interviews: appStats.byStatus.interview || 0,
    offers: (appStats.byStatus.offer || 0) + (appStats.byStatus.accepted || 0),
    portfolioViews,
  };

  // Son başvurular
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 4);

  // Yaklaşan mülakatlar
  const upcomingInterviews = getUpcomingInterviews().slice(0, 2);

  // Aktiviteler oluştur
  const generateActivities = () => {
    const activities: any[] = [];

    // Son başvurulardan aktivite
    recentApplications.slice(0, 2).forEach(app => {
      if (app.status === 'offer' || app.status === 'accepted') {
        activities.push({
          id: `offer-${app.id}`,
          type: 'offer',
          title: 'Teklif Alındı! 🎉',
          description: `${app.company} - ${app.position}`,
          timestamp: new Date(app.appliedDate),
          icon: '🎉',
        });
      } else if (app.status === 'interview') {
        activities.push({
          id: `interview-${app.id}`,
          type: 'interview',
          title: 'Mülakat Aşamasında',
          description: `${app.company} - ${app.position}`,
          timestamp: new Date(app.appliedDate),
          icon: '💼',
        });
      } else {
        activities.push({
          id: `app-${app.id}`,
          type: 'application',
          title: 'Yeni Başvuru',
          description: `${app.company} - ${app.position}`,
          timestamp: new Date(app.appliedDate),
          icon: '📤',
        });
      }
    });

    // Son güncellenmiş CV'lerden aktivite
    const recentCVs = [...cvList]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 2);

    recentCVs.forEach(cv => {
      activities.push({
        id: `cv-${cv.id}`,
        type: 'cv_updated',
        title: 'CV Güncellendi',
        description: cv.title,
        timestamp: new Date(cv.updatedAt),
        icon: '✏️',
      });
    });

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 4);
  };

  const activities = generateActivities();

  // Filtrelenmiş CV listesi
  const filteredCVs = searchQuery
    ? cvList.filter(cv =>
      cv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cv.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : cvList.slice(0, 3);

  // Handler functions
  const handleCreateCV = () => {
    const newCVId = createCV('Yeni CV');
    window.location.href = `/editor/${newCVId}`;
  };

  const handleDeleteCV = (id: string) => {
    if (confirm('Bu CV\'yi silmek istediğinize emin misiniz?')) {
      useCVStore.getState().deleteCV(id);
    }
  };

  const handleDuplicateCV = (id: string) => {
    useCVStore.getState().duplicateCV(id);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (cvList.length === 0 && applications.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
        <header className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-xl"><span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-blue-800 to-gray-900">
                    CVim
                  </span></h1>
                  <p className="text-xs text-gray-500">Profesyonel CV Yönetimi</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Hoş Geldiniz! 👋</h2>
            <p className="text-gray-600 mb-8">
              Kariyerinize başlamak için ilk CV'nizi oluşturun
            </p>
            <button
              onClick={handleCreateCV}
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-3 mx-auto font-semibold text-lg"
            >
              <Plus className="w-6 h-6" />
              İlk CV'mi Oluştur
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-blue-800 to-gray-900">
                  CVim
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="hidden md:inline">Bildirimler</span>
                </button>
                {upcomingInterviews.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>

              <button
                onClick={handleCreateCV}
                className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 font-medium"
              >
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
          <h2 className="text-3xl font-bold mb-2">Hoş Geldiniz! 👋</h2>
          <p className="text-gray-600">İşte kariyerinize genel bakış</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3 h-3" />
                Aktif
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalCVs}</h3>
            <p className="text-sm text-gray-600">Toplam CV</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-blue-600 flex items-center gap-1 font-medium">
                {stats.activeApplications} aktif
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalApplications}</h3>
            <p className="text-sm text-gray-600">Başvuru</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-purple-600 flex items-center gap-1 font-medium">
                {stats.interviews} mülakat
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.offers}</h3>
            <p className="text-sm text-gray-600">Teklif</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3 h-3" />
                +{Math.round(portfolioViews * 0.15)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{portfolioViews}</h3>
            <p className="text-sm text-gray-600">Portfolio Görüntüleme</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-all hover:border-blue-300 text-left group">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">ATS Optimizasyon</h3>
            <p className="text-sm text-gray-600">CV'nizi ATS sistemlerine optimize edin</p>
            <ArrowRight className="w-4 h-4 text-blue-600 mt-3 group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-all hover:border-purple-300 text-left group">
            <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GitCompare className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">CV Karşılaştırma</h3>
            <p className="text-sm text-gray-600">İki CV'yi yan yana karşılaştırın</p>
            <ArrowRight className="w-4 h-4 text-purple-600 mt-3 group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-all hover:border-green-300 text-left group">
            <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">QR & Portfolio</h3>
            <p className="text-sm text-gray-600">Online portfolio oluşturun</p>
            <ArrowRight className="w-4 h-4 text-green-600 mt-3 group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-all hover:border-indigo-300 text-left group">
            <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">Analitik</h3>
            <p className="text-sm text-gray-600">Başvuru istatistiklerinizi görün</p>
            <ArrowRight className="w-4 h-4 text-indigo-600 mt-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CV'lerim */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">CV'lerim</h2>
                  <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    Tümünü Gör
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="CV ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="divide-y">
                {filteredCVs.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">CV bulunamadı</p>
                  </div>
                ) : (
                  filteredCVs.map((cv) => {
                    const completeness = calculateCompleteness(cv);
                    const cvApplications = getApplicationsByCV(cv.id);

                    return (
                      <div key={cv.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{cv.title}</h3>
                            <p className="text-sm text-gray-600">
                              {cv.settings.templateType} • Güncelleme: {new Date(cv.updatedAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          <div className="relative">
                            <button className="p-2 hover:bg-gray-200 rounded-lg">
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-600">Tamlık</span>
                              <span className="font-semibold text-gray-900">{completeness}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                                style={{ width: `${completeness}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {cvApplications.length} başvuru
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {cvApplications.filter(a => a.interviews?.length > 0).length} mülakat
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1 font-medium"
                            onClick={() => window.location.href = `/editor/${cv.id}`}
                          >
                            <Edit className="w-3 h-3" />
                            Düzenle
                          </button>
                          <button
                            className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1 font-medium"
                            onClick={() => window.location.href = `/export/${cv.id}`}
                          >
                            <Download className="w-3 h-3" />
                            İndir
                          </button>
                          <button
                            className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                            onClick={() => handleDuplicateCV(cv.id)}
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Son Başvurular</h2>
                  <button
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    onClick={() => window.location.href = '/applications'}
                  >
                    Tümünü Gör
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="divide-y">
                {recentApplications.length === 0 ? (
                  <div className="p-12 text-center">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-3">Henüz başvuru yok</p>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      onClick={() => window.location.href = '/applications/new'}
                    >
                      İlk Başvuruyu Ekle
                    </button>
                  </div>
                ) : (
                  recentApplications.map((app) => {
                    const statusConfig = STATUS_CONFIG[app.status];
                    return (
                      <div
                        key={app.id}
                        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/applications/${app.id}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold mb-1">{app.position}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Building2 className="w-3 h-3" />
                              {app.company}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(app.appliedDate).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Son Aktiviteler
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {activities.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Henüz aktivite yok</p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="shrink-0 w-10 h-10 bg-linear-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-lg">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{activity.title}</h4>
                        <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.timestamp).toLocaleString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Yaklaşan Mülakatlar
              </h3>

              {upcomingInterviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600">Yaklaşan mülakat yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingInterviews.map((interview) => {
                    const app = applications.find(a => a.id === interview.applicationId);
                    const today = new Date();
                    const interviewDate = new Date(interview.date);
                    const isToday = interviewDate.toDateString() === today.toDateString();
                    const isTomorrow = new Date(today.getTime() + 86400000).toDateString() === interviewDate.toDateString();

                    return (
                      <div key={interview.id} className="bg-white rounded-lg p-4 border border-purple-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{app?.company || 'Şirket'} - {interview.title}</h4>
                          <span className="text-xs text-purple-600 font-medium">
                            {isToday ? 'Bugün' : isTomorrow ? 'Yarın' : interviewDate.toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{app?.position || 'Pozisyon'}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(interview.date).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {interview.duration && ` - ${interview.duration} dk`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                onClick={() => window.location.href = '/applications'}
              >
                Tüm Mülakatlar
              </button>
            </div>

            {/* Tips */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                Günün İpucu
              </h3>

              <p className="text-sm text-gray-700 mb-4">
                {stats.totalApplications < 5
                  ? "Her hafta en az 3-5 başvuru yapmanız kariyerinize momentum kazandırır!"
                  : stats.offers === 0
                    ? "CV'nizde başarılarınızı sayısal verilerle destekleyin! Örneğin: 'Satışları %30 artırdım'"
                    : stats.interviews > 0 && stats.offers === 0
                      ? "Mülakat sonrası 24 saat içinde teşekkür maili göndermek olumlu izlenim bırakır."
                      : "Harika gidiyorsunuz! LinkedIn profilinizi CV'nizle tutarlı tutmayı unutmayın."}
              </p>

              <button className="text-sm text-green-600 hover:underline font-medium">
                Daha Fazla İpucu →
              </button>
            </div>

            {/* Quick Stats */}
            {appStats.total > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold mb-4">Bu Ay</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Başvuru</span>
                    <span className="font-semibold">{appStats.thisMonth || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mülakat</span>
                    <span className="font-semibold text-purple-600">{appStats.byStatus.interview || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Teklif</span>
                    <span className="font-semibold text-green-600">
                      {(appStats.byStatus.offer || 0) + (appStats.byStatus.accepted || 0)}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Başarı Oranı</span>
                      <span className="font-semibold text-blue-600">{appStats.successRate.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for bell icon
function Bell({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}