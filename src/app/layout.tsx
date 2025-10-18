import type { Metadata } from "next";
import Header from "@/components/UI/Header/Header";
import Footer from "@/components/UI/Footer/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bicho Capiba - Adoção de Pets e Doações",
  description:
    "Plataforma que conecta pessoas que desejam adotar cães e gatos com ONGs de proteção animal. Encontre seu novo melhor amigo, faça doações e ajude a transformar vidas. Sistema de busca inteligente, alertas personalizados e processo de adoção seguro.",
  keywords: [
    "adoção de pets",
    "cães para adoção",
    "gatos para adoção",
    "ONGs",
    "doação para animais",
    "proteção animal",
    "adotar cachorro",
    "adotar gato",
    "resgate animal",
    "animais abandonados",
    "castração",
    "vacinação",
    "cuidados veterinários",
    "abrigo de animais",
    "pets resgatados",
    "adoção responsável",
    "voluntariado animal",
    "lar temporário",
    "feira de adoção",
    "amor incondicional",
  ],
  authors: [{ name: "Equipe Bicho Capiba" }],
  creator: "Bicho Capiba",
  publisher: "Bicho Capiba",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://bichocapiba.trackr.fm"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Bicho Capiba - Adoção de Pets e Doações",
    description:
      "Conectamos pessoas que desejam adotar com ONGs de proteção animal. Encontre cães e gatos para adoção e ajude a transformar vidas através de doações.",
    url: "https://bichocapiba.trackr.fm",
    siteName: "Bicho Capiba",
    images: [
      {
        url: "/images/BichoCapibaLogo.png",
        width: 1200,
        height: 288,
        alt: "Bicho Capiba - Adoção de Pets e Doações",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bicho Capiba - Adoção de Pets e Doações",
    description:
      "Conectamos pessoas que desejam adotar com ONGs de proteção animal. Encontre seu novo melhor amigo!",
    images: ["/images/BichoCapibaBlackLogo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AuthProvider>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
