import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Pillar {
  icon: string;
  title: string;
  body: string;
}

interface SobreContent {
  section_label: string;
  brand_name: string;
  headline: string;
  intro: string;
  pillars_title: string;
  pillars: Pillar[];
  team_title: string;
  team_body: string;
}

const defaults: SobreContent = {
  section_label: 'SOBRE KUBIK LIVING',
  brand_name: 'Flux Living by Kubik.',
  headline: 'El modelo habitacional que responde a cómo viven y trabajan las personas hoy.',
  intro: 'Flux Living es el estándar que desarrollamos: residencias completamente equipadas, operadas con servicios, diseñadas para múltiples usos y estadías. Un producto que integra flexibilidad espacial, amoblamiento premium y operación consistente en un solo lugar.\n\nKubik 8i8 en el Parque Virrey es la primera expresión de ese modelo en Bogotá.',
  pillars_title: 'Lo que nos define.',
  pillars: [
    {
      icon: '→',
      title: 'Diseño como herramienta.',
      body: 'Cada decisión de diseño en Kubik 8i8 tiene un propósito funcional. La arquitectura flexible no es un recurso estético — es lo que permite que el mismo espacio sirva para un ejecutivo solo o una familia de cuatro.',
    },
    {
      icon: '→',
      title: 'Ready to Live — siempre.',
      body: 'Amoblado integral premium. Llegas con tu maleta. Nada más. Sin listas de pendientes, sin trámites, sin semanas de adaptación.',
    },
    {
      icon: '→',
      title: 'Operación que no se nota.',
      body: 'El mejor servicio es el que no tienes que pedir. En Kubik 8i8, las cosas funcionan antes de que necesites que funcionen.',
    },
    {
      icon: '→',
      title: 'Eficiencia y sofisticación.',
      body: 'No son opuestos. El modelo Flux Living está diseñado para que el activo rinda y el residente viva bien. Los dos al mismo tiempo.',
    },
  ],
  team_title: 'El equipo.',
  team_body: 'Detrás de Kubik hay personas que llevan años operando movilidad corporativa en Bogotá. Conocemos las preguntas antes de que las hagas. Y seguimos prefiriendo resolverlas en persona.',
};

interface SobreKubikModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SobreKubikModal({ isOpen, onClose }: SobreKubikModalProps) {
  const [c, setC] = useState<SobreContent>(defaults);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    supabase.from('site_content').select('*').eq('key', 'sobre').maybeSingle().then(({ data }) => {
      if (!data) return;
      const j = (data.content_json ?? {}) as Record<string, unknown>;
      setC({
        section_label: (j.section_label as string) ?? defaults.section_label,
        brand_name: data.title ?? defaults.brand_name,
        headline: (j.headline as string) ?? defaults.headline,
        intro: data.content ?? defaults.intro,
        pillars_title: (j.pillars_title as string) ?? defaults.pillars_title,
        pillars: ((j.pillars as Pillar[]) ?? []).length > 0 ? (j.pillars as Pillar[]) : defaults.pillars,
        team_title: (j.team_title as string) ?? defaults.team_title,
        team_body: (j.team_body as string) ?? defaults.team_body,
      });
    });
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-light-bg">
      <header className="flex items-center justify-between px-6 md:px-12 h-20 border-b border-dark/10 flex-shrink-0">
        <img src="/LOGOS-02.png" alt="Kubik Living" className="h-7 w-auto object-contain" />
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center border border-dark/15 hover:border-dark/40 text-dark/40 hover:text-dark transition-colors"
        >
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 pb-32">
          <p className="text-xs tracking-widest text-olive/60 uppercase font-sans mb-10">
            {c.section_label}
          </p>

          <div className="mb-20">
            <h1 className="text-4xl md:text-5xl font-display font-semibold uppercase text-dark leading-tight mb-6">
              {c.brand_name}
            </h1>
            <p className="text-lg md:text-xl text-dark/70 font-sans leading-relaxed mb-8 max-w-2xl">
              {c.headline}
            </p>
            <div className="space-y-4">
              {c.intro.split('\n\n').map((para, i) => (
                <p key={i} className="text-base text-warm-gray leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-display font-normal uppercase text-dark mb-10">
              {c.pillars_title}
            </h2>
            <div className="space-y-0 divide-y divide-dark/10">
              {c.pillars.map((pillar, i) => (
                <div key={i} className="py-8 grid md:grid-cols-[1fr_2fr] gap-4 md:gap-12 items-start">
                  <div className="flex items-start gap-3">
                    <span className="text-olive font-mono text-lg leading-none mt-0.5">{pillar.icon}</span>
                    <h3 className="text-base font-sans font-semibold text-dark leading-snug">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-sm text-warm-gray leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-dark/10 pt-14">
            <h2 className="text-2xl md:text-3xl font-display font-normal uppercase text-dark mb-6">
              {c.team_title}
            </h2>
            <p className="text-base text-warm-gray leading-relaxed max-w-2xl">
              {c.team_body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
