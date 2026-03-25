import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FooterContent {
  title: string;
  content: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  copyright: string;
}

const footerDefaults: FooterContent = {
  title: 'KubikLiving 8i8',
  content: 'Residencias urbanas diseñadas con precisión europea en el corazón de Bogotá.',
  email: 'info@kubikliving.com',
  phone: '+57 1 300 123 4567',
  address: 'Bogotá, Colombia',
  instagram: '#',
  facebook: '#',
  linkedin: '#',
  copyright: '© 2024 KubikLiving 8i8. All rights reserved.',
};

export function Footer() {
  const [c, setC] = useState<FooterContent>(footerDefaults);

  useEffect(() => {
    supabase.from('site_content').select('*').eq('key', 'footer').maybeSingle().then(({ data }) => {
      if (!data) return;
      const j = (data.content_json ?? {}) as Record<string, string>;
      setC({
        title: data.title ?? footerDefaults.title,
        content: data.content ?? footerDefaults.content,
        email: j.email ?? footerDefaults.email,
        phone: j.phone ?? footerDefaults.phone,
        address: j.address ?? footerDefaults.address,
        instagram: j.instagram ?? footerDefaults.instagram,
        facebook: j.facebook ?? footerDefaults.facebook,
        linkedin: j.linkedin ?? footerDefaults.linkedin,
        copyright: j.copyright ?? footerDefaults.copyright,
      });
    });
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-black py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <img
              src="/LOGOS-08.png"
              alt="Kubik Living"
              className="h-24 w-auto object-contain mb-4"
            />
            <p className="text-sm text-white-cream/60 leading-relaxed">
              {c.content}
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-widest text-muted-green uppercase mb-4 font-sans">
              Navegación
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Apartamentos', id: 'suites' },
                { label: 'Espacios', id: 'espacios' },
                { label: 'Servicios', id: 'servicios' },
                { label: 'Ubicación', id: 'ubicacion' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-sm text-white-cream/70 hover:text-white-cream transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest text-muted-green uppercase mb-4 font-sans">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-muted-green/60 flex-shrink-0 mt-0.5" />
                <a href={`mailto:${c.email}`} className="text-sm text-white-cream/70 hover:text-white-cream transition-colors">
                  {c.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-muted-green/60 flex-shrink-0 mt-0.5" />
                <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="text-sm text-white-cream/70 hover:text-white-cream transition-colors">
                  {c.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-green/60 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white-cream/70">{c.address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest text-muted-green uppercase mb-4 font-sans">
              Síguenos
            </h4>
            <div className="flex gap-4">
              <a href={c.instagram} className="w-10 h-10 flex items-center justify-center border border-white-cream/20 hover:border-muted-green hover:bg-muted-green/10 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5 text-white-cream/70" />
              </a>
              <a href={c.facebook} className="w-10 h-10 flex items-center justify-center border border-white-cream/20 hover:border-muted-green hover:bg-muted-green/10 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5 text-white-cream/70" />
              </a>
              <a href={c.linkedin} className="w-10 h-10 flex items-center justify-center border border-white-cream/20 hover:border-muted-green hover:bg-muted-green/10 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5 text-white-cream/70" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white-cream/50">
            {c.copyright}
          </p>
          <div className="flex gap-6">
            <button className="text-xs text-white-cream/50 hover:text-white-cream transition-colors">
              Política de Privacidad
            </button>
            <button className="text-xs text-white-cream/50 hover:text-white-cream transition-colors">
              Términos y Condiciones
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
