import { useAuth } from '../lib/auth';
import { useRouter } from '../lib/router';
import { Login } from './Login';
import { AdminLayout } from './Layout';
import { Dashboard } from './pages/Dashboard';
import { HeroEditor } from './pages/HeroEditor';
import { ContextEditor } from './pages/ContextEditor';
import { LocationEditor } from './pages/LocationEditor';
import { FooterEditor } from './pages/FooterEditor';
import { SuitesManager } from './pages/SuitesManager';
import { SpacesManager } from './pages/SpacesManager';
import { ServicesManager } from './pages/ServicesManager';
import { GalleryManager } from './pages/GalleryManager';
import { ArtGalleryManager } from './pages/ArtGalleryManager';
import { SobreKubikEditor } from './pages/SobreKubikEditor';
import { BookingEditor } from './pages/BookingEditor';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { navigate } = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#6b7c5c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/admin/login');
    return null;
  }

  return <>{children}</>;
}

export function AdminApp() {
  const { route } = useRouter();

  if (route === '/admin/login') return <Login />;

  const renderPage = () => {
    if (route === '/admin') return <Dashboard />;
    if (route === '/admin/hero') return <HeroEditor />;
    if (route === '/admin/context') return <ContextEditor />;
    if (route === '/admin/location') return <LocationEditor />;
    if (route === '/admin/footer') return <FooterEditor />;
    if (route === '/admin/suites') return <SuitesManager />;
    if (route === '/admin/spaces') return <SpacesManager />;
    if (route === '/admin/services') return <ServicesManager />;
    if (route === '/admin/gallery') return <GalleryManager />;
    if (route === '/admin/art') return <ArtGalleryManager />;
    if (route === '/admin/sobre') return <SobreKubikEditor />;
    if (route === '/admin/booking') return <BookingEditor />;
    return <Dashboard />;
  };

  return (
    <ProtectedRoute>
      <AdminLayout>{renderPage()}</AdminLayout>
    </ProtectedRoute>
  );
}
