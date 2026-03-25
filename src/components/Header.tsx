import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useRouter } from '../lib/router';

interface HeaderProps {
  onOpenArte?: () => void;
  onOpenSobre?: () => void;
}

export function Header({ onOpenArte, onOpenSobre }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);
  const { navigate } = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Residences', id: 'suites' },
    { label: 'Experiencias', id: 'espacios' },
    { label: 'Servicios', id: 'servicios' },
  ];

  const navItemsRight = [
    { label: 'Ubicación', id: 'ubicacion' },
    { label: 'Contacto', id: 'booking' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-dark/95 backdrop-blur-md' : 'bg-gradient-to-b from-dark/60 to-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 h-20">
          <div className="flex items-center gap-6">
            <button onClick={() => scrollToSection('hero')} className="flex items-center">
              <img src="/LOGOS-07.png" alt="Kubik Living" className="h-7 md:h-8 w-auto object-contain" />
            </button>

            <div className="relative" ref={cityRef}>
              <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="hidden md:flex items-center gap-1 text-xs tracking-widest text-white-cream/50 hover:text-white-cream transition-colors uppercase"
              >
                <span>Bogotá D.C.</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${isCityOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCityOpen && (
                <div className="absolute top-full left-0 mt-3 bg-dark/98 backdrop-blur-md border border-white-cream/10 min-w-[180px] py-2">
                  <button
                    onClick={() => { navigate('/'); setIsCityOpen(false); }}
                    className="w-full text-left px-5 py-3 text-xs tracking-widest text-white-cream/80 hover:text-white-cream hover:bg-white-cream/5 transition-colors uppercase"
                  >
                    Kubik 8i8
                  </button>
                  <div className="px-5 py-3 flex items-center justify-between gap-4">
                    <span className="text-xs tracking-widest text-white-cream/25 uppercase">Kubik 9i3</span>
                    <span className="text-[9px] tracking-widest text-muted-green/60 uppercase border border-muted-green/30 px-2 py-0.5">
                      Coming Soon
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-xs tracking-widest text-white-cream/60 hover:text-white-cream transition-colors uppercase"
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => { onOpenArte?.(); setIsMobileMenuOpen(false); }}
              className="text-xs tracking-widest text-white-cream/60 hover:text-white-cream transition-colors uppercase"
            >
              Arte
            </button>

            {navItemsRight.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-xs tracking-widest text-white-cream/60 hover:text-white-cream transition-colors uppercase"
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => { onOpenSobre?.(); setIsMobileMenuOpen(false); }}
              className="text-xs tracking-widest text-white-cream/60 hover:text-white-cream transition-colors uppercase"
            >
              Sobre Kubik
            </button>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white-cream"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 bottom-0 z-40 bg-dark/98 backdrop-blur-lg md:hidden overflow-y-auto">
          <nav className="flex flex-col items-center justify-center min-h-full gap-6 py-12">
            {[...navItems, ...navItemsRight].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-xl text-white-cream/80 hover:text-white-cream transition-colors uppercase tracking-wide"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onOpenArte?.(); setIsMobileMenuOpen(false); }}
              className="text-xl text-white-cream/80 hover:text-white-cream transition-colors uppercase tracking-wide"
            >
              Arte
            </button>
            <button
              onClick={() => { onOpenSobre?.(); setIsMobileMenuOpen(false); }}
              className="text-xl text-white-cream/80 hover:text-white-cream transition-colors uppercase tracking-wide"
            >
              Sobre Kubik
            </button>
            <div className="mt-4 pt-4 border-t border-white-cream/10 w-32 text-center">
              <p className="text-xs tracking-widest text-white-cream/30 uppercase mb-3">Ciudad</p>
              <button
                onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                className="block w-full text-sm text-white-cream/70 py-2 uppercase tracking-wide hover:text-white-cream transition-colors"
              >
                Kubik 8i8
              </button>
              <div className="flex items-center justify-between px-0 py-2">
                <span className="text-sm text-white-cream/25 uppercase tracking-wide">Kubik 9i3</span>
                <span className="text-[9px] tracking-widest text-muted-green/60 uppercase border border-muted-green/30 px-2 py-0.5">Soon</span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
