import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CV Builder Pro",
  description: "Professional CV Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Tüm uygulamayı ClerkProvider ile sarmalıyoruz
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Üst Kısım (Header): Giriş butonu burada görünecek */}
          <header className="flex justify-end items-center p-4 gap-4 h-16 border-b">
            {/* Kullanıcı giriş YAPMAMIŞSA bunları göster */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium hover:underline px-4">
                  Giriş Yap
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-blue-600 text-white rounded-full font-medium text-sm px-5 py-2 hover:bg-blue-700 transition">
                  Kayıt Ol
                </button>
              </SignUpButton>
            </SignedOut>

            {/* Kullanıcı giriş YAPMIŞSA bunları göster */}
            <SignedIn>
              <UserButton showName />
            </SignedIn>
          </header>

          {/* Sayfa İçeriği */}
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}