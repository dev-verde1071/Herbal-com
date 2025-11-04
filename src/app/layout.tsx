import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata = {
  title: "Herbal Communities",
  description: "Natural wellness, herbs, and retreats for holistic health.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand-50 text-leaf-800">
        <Header />
        <main className="min-h-screen pt-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
