import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { VariableProximity } from './VariableProximity';

interface HeroContent {
  title: string;
  content: string;
  subtitle: string;
  badge: string;
  city: string;
  cta_primary: string;
  cta_secondary: string;
  image_url: string;
}

const defaults: HeroContent = {
  title: 'FLUXING\nHOME',
  content: 'Residencias urbanas amuebladas en Bogotá.\nArquitectura, privacidad y permanencia flexible.',
  subtitle: 'Residencias Urbanas',
  badge: '8i8',
  city: 'Bogotá',
  cta_primary: 'Explorar Suites',
  cta_secondary: 'Book Now',
  image_url: '/Image_202602182333.jpeg',
};

export function Hero() {
  const [c, setC] = useState<HeroContent>(defaults);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase.from('site_content').select('*').eq('key', 'hero').maybeSingle().then(({ data }) => {
      if (!data) return;
      const j = (data.content_json ?? {}) as Record<string, string>;
      setC({
        title: data.title ?? defaults.title,
        content: data.content ?? defaults.content,
        subtitle: j.subtitle ?? defaults.subtitle,
        badge: j.badge ?? defaults.badge,
        city: j.city ?? defaults.city,
        cta_primary: j.cta_primary ?? defaults.cta_primary,
        cta_secondary: j.cta_secondary ?? defaults.cta_secondary,
        image_url: j.image_url ?? defaults.image_url,
      });
    });
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" ref={sectionRef} className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={c.image_url}
          alt="Luxury apartment interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-20 px-6 md:px-14 max-w-7xl mx-auto w-full">
        <div className="max-w-5xl">
          <div className="flex items-center gap-3 mb-5 text-xs tracking-[0.2em] text-white/50 uppercase">
            <span className="w-8 h-px bg-white/30" />
            <span>{c.subtitle}</span>
            <span className="text-white/30">—</span>
            <span>{c.city}</span>
          </div>

          <h1 className="hero-title text-white mb-6">
            <VariableProximity
              label={c.title}
              fromFontVariationSettings="'wght' 900, 'opsz' 14"
              toFontVariationSettings="'wght' 100, 'opsz' 32"
              containerRef={sectionRef}
              radius={300}
              falloff="gaussian"
            />
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-12">
            <p className="text-white/70 text-sm md:text-base max-w-xs leading-relaxed font-light whitespace-pre-line">
              {c.content}
            </p>
            <div className="flex flex-row gap-3">
              <button onClick={() => scrollToSection('suites')} className="btn-outline">
                {c.cta_primary}
              </button>
              <button onClick={() => scrollToSection('booking')} className="btn-outline">
                {c.cta_secondary}
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
