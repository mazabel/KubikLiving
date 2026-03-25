import { useState } from 'react';
import { AuthProvider } from './lib/auth';
import { RouterProvider, useRouter } from './lib/router';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Context } from './components/Context';
import { Suites } from './components/Suites';
import { Espacios } from './components/Espacios';
import { Services } from './components/Services';
import { Location } from './components/Location';
import { Booking } from './components/Booking';
import { Footer } from './components/Footer';
import { ArtGalleryModal } from './components/ArtGalleryModal';
import { SobreKubikModal } from './components/SobreKubikModal';
import { AdminApp } from './admin/AdminApp';

function LandingPage() {
  const [arteOpen, setArteOpen] = useState(false);
  const [sobreOpen, setSobreOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header
        onOpenArte={() => setArteOpen(true)}
        onOpenSobre={() => setSobreOpen(true)}
      />
      <main>
        <Hero />
        <Context />
        <Suites />
        <Espacios />
        <Services />
        <Location />
        <Booking />
      </main>
      <Footer />
      <ArtGalleryModal isOpen={arteOpen} onClose={() => setArteOpen(false)} />
      <SobreKubikModal isOpen={sobreOpen} onClose={() => setSobreOpen(false)} />
    </div>
  );
}

function AppRouter() {
  const { route } = useRouter();
  if (route.startsWith('/admin')) return <AdminApp />;
  return <LandingPage />;
}

function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;
