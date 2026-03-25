import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from '../../lib/router';
import { PageHeader } from '../components/PageHeader';
import { Bookmark, Layers, Star, FileText } from 'lucide-react';

interface Stats {
  suites: number;
  spaces: number;
  services: number;
  content: number;
}

export function Dashboard() {
  const { navigate } = useRouter();
  const [stats, setStats] = useState<Stats>({ suites: 0, spaces: 0, services: 0, content: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [suites, spaces, services, content] = await Promise.all([
        supabase.from('suites').select('id', { count: 'exact', head: true }),
        supabase.from('spaces').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('site_content').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        suites: suites.count ?? 0,
        spaces: spaces.count ?? 0,
        services: services.count ?? 0,
        content: content.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Suites', value: stats.suites, icon: <Bookmark size={20} />, path: '/admin/suites', color: 'from-[#6b7c5c]/20 to-transparent' },
    { label: 'Espacios', value: stats.spaces, icon: <Layers size={20} />, path: '/admin/spaces', color: 'from-[#4a6b5c]/20 to-transparent' },
    { label: 'Servicios', value: stats.services, icon: <Star size={20} />, path: '/admin/services', color: 'from-[#6b5c4a]/20 to-transparent' },
    { label: 'Secciones de contenido', value: stats.content, icon: <FileText size={20} />, path: '/admin/hero', color: 'from-[#5c4a6b]/20 to-transparent' },
  ];

  const quickLinks = [
    { label: 'Editar Hero', path: '/admin/hero' },
    { label: 'Editar Contexto', path: '/admin/context' },
    { label: 'Editar Ubicación', path: '/admin/location' },
    { label: 'Editar Footer', path: '/admin/footer' },
    { label: 'Gestionar Suites', path: '/admin/suites' },
    { label: 'Gestionar Espacios', path: '/admin/spaces' },
    { label: 'Gestionar Servicios', path: '/admin/services' },
    { label: 'Galería de Imágenes', path: '/admin/gallery' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Administra todo el contenido de tu landing page." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            className={`bg-gradient-to-br ${card.color} bg-[#1a1a1a] border border-white/10 hover:border-white/20 p-6 text-left transition-all group`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#9aad85] group-hover:scale-110 transition-transform">{card.icon}</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-xs text-white/40 tracking-widest uppercase">{card.label}</p>
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-sm text-white/40 tracking-widest uppercase mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="px-4 py-3 bg-[#1a1a1a] border border-white/10 hover:border-[#6b7c5c] hover:bg-[#6b7c5c]/10 text-sm text-white/60 hover:text-white transition-all text-left"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
