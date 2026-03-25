import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Suite } from '../types';
import { SuiteCard } from './SuiteCard';

interface SuitesHeader {
  section_label: string;
  heading: string;
  subheading: string;
  tagline_left: string;
  tagline_right: string;
}

const defaultHeader: SuitesHeader = {
  section_label: '',
  heading: 'Apartamentos y Residencias',
  subheading: 'Doce espacios diferentes. Un solo edificio.\nTodos diseñados bajo el modelo Flux Living. Amoblado Integral Premium — listos para habitar desde el primer día.',
  tagline_left: 'Tres configuraciones.',
  tagline_right: 'Una sola filosofía de habitación.',
};

export function Suites() {
  const [suites, setSuites] = useState<Suite[]>([]);
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState<SuitesHeader>(defaultHeader);

  useEffect(() => {
    const fetchSuites = async () => {
      try {
        const { data, error } = await supabase
          .from('suites')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;
        setSuites(data || []);
      } catch (error) {
        console.error('Error fetching suites:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchHeader = async () => {
      const { data } = await supabase
        .from('site_content')
        .select('*')
        .eq('key', 'suites_header')
        .maybeSingle();
      if (!data) return;
      const j = (data.content_json ?? {}) as Record<string, unknown>;
      setHeader({
        section_label: (j.section_label as string) ?? defaultHeader.section_label,
        heading: data.title ?? defaultHeader.heading,
        subheading: data.content ?? defaultHeader.subheading,
        tagline_left: (j.tagline_left as string) ?? defaultHeader.tagline_left,
        tagline_right: (j.tagline_right as string) ?? defaultHeader.tagline_right,
      });
    };

    fetchSuites();
    fetchHeader();
  }, []);

  return (
    <section id="suites" className="py-24 md:py-32 bg-[#111111] relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{ background: 'linear-gradient(to right, #111111 0%, transparent 100%)' }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{ background: 'linear-gradient(to left, #111111 0%, transparent 100%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-14">
          {header.section_label && (
            <p className="text-xs tracking-widest text-white/30 uppercase font-sans mb-4">
              {header.section_label}
            </p>
          )}
          <div className="flex items-end justify-between gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold uppercase text-white/90 leading-none mb-3">
                {header.heading}
              </h2>
              {header.subheading && (
                <p className="text-sm text-white/40 font-light tracking-wide max-w-xl leading-relaxed">
                  {header.subheading}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-white/35 font-light tracking-wide">{header.tagline_left}</p>
              <p className="text-xs text-white/35 font-light tracking-wide">{header.tagline_right}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 animate-pulse h-96" />
            ))}
          </div>
        ) : suites.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {suites.map((suite) => (
              <SuiteCard key={suite.id} suite={suite} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/35 text-sm font-light">No hay suites disponibles en este momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}
