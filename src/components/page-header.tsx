export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold text-leaf-700">{title}</h1>
      {subtitle && <p className="text-brand-700 mt-2">{subtitle}</p>}
    </div>
  );
}
