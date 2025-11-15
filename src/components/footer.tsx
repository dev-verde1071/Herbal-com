export default function Footer() {
  return (
    <footer className="border-t border-brand-200 bg-brand-100 mt-16 py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 text-leaf-700 text-sm">
        <p>© {new Date().getFullYear()} Herbal Communities. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-leaf-600">Privacy</a>
          <a href="#" className="hover:text-leaf-600">Terms</a>
          <a href="#" className="hover:text-leaf-600">Contact</a>
        </div>
      </div>
    </footer>
  );
}
