import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "NSEImports",
  description:
    "Não vendemos roupa. Vendemos o acesso a uma peça que quase ninguém consegue ter — importada direto da filial de origem, conferida, embalada e entregue como peça de coleção.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-onix text-marfim">
        <ToastProvider>
          <Header cartCount={0} />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
