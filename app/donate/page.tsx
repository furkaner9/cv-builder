"use client";
import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  Heart,
  Coffee,
  Star,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Wallet,
  Sparkles,
  Users,
  TrendingUp,
  Gift,
  Award,
  Zap,
} from 'lucide-react';

const DONATION_AMOUNTS = [
  { amount: 10, label: '☕ Bir Kahve', description: 'Küçük bir destek' },
  { amount: 25, label: '🍕 Bir Öğün', description: 'Güzel bir destek' },
  { amount: 50, label: '💪 Güçlü Destek', description: 'Çok teşekkürler!' },
  { amount: 100, label: '🌟 Harika Destek', description: 'İnanılmazsınız!' },
];

const SUPPORTERS = [
  { name: 'Ahmet Y.', amount: 50, date: '2 gün önce', message: 'Harika bir proje!' },
  { name: 'Ayşe K.', amount: 25, date: '5 gün önce', message: 'Başarılar dilerim 💪' },
  { name: 'Mehmet S.', amount: 100, date: '1 hafta önce', message: 'Çok işime yarıyor, teşekkürler!' },
  { name: 'Zeynep A.', amount: 30, date: '1 hafta önce', message: 'Devam edin!' },
  { name: 'Can B.', amount: 75, date: '2 hafta önce', message: 'Mükemmel bir platform 🎉' },
];

const STATS = {
  totalDonations: 1247,
  totalAmount: 18650,
  supporters: 342,
  thisMonth: 2340,
};

export default function DonatePage() {
  const { user } = useAuthStore();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'papara' | 'crypto'>('card');
  const [showSuccess, setShowSuccess] = useState(false);

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handleDonate = () => {
    if (!finalAmount || finalAmount < 5) {
      alert('Minimum bağış tutarı 5 TL\'dir');
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedAmount(50);
        setCustomAmount('');
        setMessage('');
      }, 3000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-24 h-24 bg-linear-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Çok Teşekkür Ederiz! 🎉</h1>
          <p className="text-xl text-gray-600 mb-6">
            {finalAmount} TL bağışınız için minnettarız
          </p>
          <p className="text-gray-600 mb-8">
            Desteğiniz sayesinde<span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-blue-800 to-gray-900">
              CVim
            </span>daha da geliştirmeye devam edebileceğiz!
          </p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700"
          >
            Dashboard'a Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Geri Dön</span>
            </button>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <span className="font-semibold">Bağış Yap</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-pink-500 to-purple-500 rounded-full mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              CVGenius'u Destekleyin
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Tamamen ücretsiz olan CVGenius'u geliştirmeye devam edebilmemiz için
              desteğinize ihtiyacımız var 💝
            </p>
            <p className="text-lg text-gray-700 font-medium">
              Bağışınızla neler yapacağız:
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Yeni Özellikler</h3>
              <p className="text-gray-600 text-sm">
                AI destekli CV analizi, otomatik çeviri, ve daha fazla template
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-green-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Performans</h3>
              <p className="text-gray-600 text-sm">
                Daha hızlı yükleme, daha iyi sunucular ve kesintisiz hizmet
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Topluluk</h3>
              <p className="text-gray-600 text-sm">
                Webinar'lar, kariyer rehberleri ve iş fırsatları platformu
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Donation Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Bağış Tutarı Seçin</h2>

                {/* Preset Amounts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {DONATION_AMOUNTS.map((item) => (
                    <button
                      key={item.amount}
                      onClick={() => {
                        setSelectedAmount(item.amount);
                        setCustomAmount('');
                      }}
                      className={`p-4 border-2 rounded-xl text-left transition-all hover:scale-105 ${selectedAmount === item.amount && !customAmount
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                        }`}
                    >
                      <div className="text-2xl font-bold mb-1">{item.amount} TL</div>
                      <div className="text-sm font-medium mb-1">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Veya Özel Tutar
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      placeholder="Özel tutar girin..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                      min="5"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      TL
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum bağış: 5 TL</p>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj (Opsiyonel)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Bir mesaj bırakın..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 resize-none"
                  />
                </div>

                {/* Anonymous */}
                <label className="flex items-center gap-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">
                    Bağışımı anonim olarak yap
                  </span>
                </label>

                {/* Payment Methods */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ödeme Yöntemi
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                        }`}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="text-sm font-medium">Kredi Kartı</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('papara')}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${paymentMethod === 'papara'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                        }`}
                    >
                      <Wallet className="w-6 h-6" />
                      <span className="text-sm font-medium">Papara</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('crypto')}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${paymentMethod === 'crypto'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                        }`}
                    >
                      <span className="text-2xl">₿</span>
                      <span className="text-sm font-medium">Crypto</span>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleDonate}
                  disabled={!finalAmount || finalAmount < 5}
                  className="w-full py-4 bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <Heart className="w-6 h-6" />
                  {finalAmount ? `${finalAmount} TL Bağış Yap` : 'Tutar Seçin'}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  🔒 Güvenli ödeme • Anında onay • İstediğiniz zaman iptal
                </p>
              </div>
            </div>

            {/* Stats & Supporters */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Bağış İstatistikleri
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Toplam Bağış</span>
                      <span className="font-bold text-green-600">{STATS.totalAmount.toLocaleString()} TL</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '75%' }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Hedef: 25,000 TL</p>
                  </div>

                  <div className="flex justify-between items-center py-3 border-t">
                    <span className="text-sm text-gray-600">Destekçi Sayısı</span>
                    <span className="font-bold">{STATS.supporters}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-t">
                    <span className="text-sm text-gray-600">Bu Ay</span>
                    <span className="font-bold text-blue-600">{STATS.thisMonth.toLocaleString()} TL</span>
                  </div>
                </div>
              </div>

              {/* Recent Supporters */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Son Destekçiler
                </h3>

                <div className="space-y-4">
                  {SUPPORTERS.slice(0, 5).map((supporter, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                        {supporter.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{supporter.name}</span>
                          <span className="text-sm font-bold text-green-600">{supporter.amount} TL</span>
                        </div>
                        {supporter.message && (
                          <p className="text-xs text-gray-600 mb-1">"{supporter.message}"</p>
                        )}
                        <p className="text-xs text-gray-400">{supporter.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-lg">Teşekkür Hediyesi</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  50 TL ve üzeri bağışlarda:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Destekçi rozeti</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Erken erişim özellikleri</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Özel teşekkür mesajı</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Sıkça Sorulan Sorular</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Bağışım ne için kullanılacak?</h3>
                <p className="text-sm text-gray-600">
                  Bağışlar sunucu maliyetleri, yeni özellikler ve platform iyileştirmeleri için kullanılır.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Minimum tutar var mı?</h3>
                <p className="text-sm text-gray-600">
                  Minimum 5 TL bağış yapabilirsiniz. Üst limit yoktur.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bağışı geri alabilir miyim?</h3>
                <p className="text-sm text-gray-600">
                  Bağışlar geri alınamaz, ancak yanlışlık durumunda destek ekibimizle iletişime geçebilirsiniz.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Zorunlu mu?</h3>
                <p className="text-sm text-gray-600">
                  Hayır! CVGenius tamamen ücretsizdir. Bağış tamamen isteğe bağlıdır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}