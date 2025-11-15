import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata = {
  title: "Herbal Communities",
  description:
    "Herbal Communities — Natural remedies, tours, and retreats for holistic wellness.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand-50 text-leaf-900 font-sans">
        <Header />
        <main className="min-h-screen py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
