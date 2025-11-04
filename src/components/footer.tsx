export default function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-200 bg-brand-100">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-4 text-leaf-700">
        <p className="text-sm">
          © {new Date().getFullYear()} Herbal Communities. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm">
          <a href="#" className="hover:text-leaf-500">Privacy</a>
          <a href="#" className="hover:text-leaf-500">Terms</a>
          <a href="#" className="hover:text-leaf-500">Contact</a>
        </div>
      </div>
    </footer>
  );
}
