import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata = {
  title: "Herbal Communities",
  description:
    "Herbal Communities is a wellness-centered brand focused on natural living, herbal education, and community healing."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-cream">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
