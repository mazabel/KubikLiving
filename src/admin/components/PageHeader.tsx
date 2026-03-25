interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 pb-6 border-b border-white/10">
      <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{title}</h1>
      {description && <p className="text-sm text-white/40">{description}</p>}
    </div>
  );
}
