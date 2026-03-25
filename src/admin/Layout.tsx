import { ReactNode, useState } from 'react';
import { useAuth } from '../lib/auth';
import { useRouter } from '../lib/router';
import {
  LayoutDashboard, Home, Image, MapPin, Settings, LogOut,
  ChevronLeft, Menu, FileText, Layers, Star, Bookmark, Palette, Info, CalendarDays
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Hero', path: '/admin/hero', icon: <Home size={18} /> },
  { label: 'Contexto', path: '/admin/context', icon: <FileText size={18} /> },
  { label: 'Apartamentos', path: '/admin/suites', icon: <Bookmark size={18} /> },
  { label: 'Espacios', path: '/admin/spaces', icon: <Layers size={18} /> },
  { label: 'Servicios', path: '/admin/services', icon: <Star size={18} /> },
  { label: 'Ubicación', path: '/admin/location', icon: <MapPin size={18} /> },
  { label: 'Footer', path: '/admin/footer', icon: <Settings size={18} /> },
  { label: 'Galería', path: '/admin/gallery', icon: <Image size={18} /> },
  { label: 'Arte', path: '/admin/art', icon: <Palette size={18} /> },
  { label: 'Sobre Kubik', path: '/admin/sobre', icon: <Info size={18} /> },
  { label: 'Reserva', path: '/admin/booking', icon: <CalendarDays size={18} /> },
];

interface LayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const { route, navigate } = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return route === '/admin';
    return route.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className={`flex items-center justify-between px-4 h-16 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        {!collapsed && (
          <span className="text-sm font-bold tracking-wider text-white">
            KUBIK<span className="text-[#6b7c5c]">ADMIN</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-white/40 hover:text-white transition-colors hidden md:block"
        >
          <ChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => { navigate(item.path); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-sm ${
              isActive(item.path)
                ? 'bg-[#6b7c5c]/20 text-[#9aad85]'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="tracking-wide">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-white/10">
        {!collapsed && (
          <p className="text-xs text-white/30 px-3 mb-2 truncate">{user?.email}</p>
        )}
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-colors rounded-sm ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      <aside className={`hidden md:flex flex-col bg-[#141414] border-r border-white/10 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#141414] border-r border-white/10 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-[#141414] border-b border-white/10 flex items-center justify-between px-4 md:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-white/50 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => window.open('/', '_blank')}
              className="text-xs text-white/40 hover:text-white transition-colors tracking-widest uppercase"
            >
              Ver Landing
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
