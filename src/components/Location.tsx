import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Landmark {
  name: string;
}

interface LocationContent {
  title: string;
  content: string;
  section_label: string;
  subtitle: string;
  landmarks_title: string;
  landmarks: Landmark[];
  quote: string;
}

const locationDefaults: LocationContent = {
  title: 'Parque Virrey- La Cabrera',
  content: 'El Parque el Virrey es el eje del mejor barrio para vivir y trabajar en Bogotá — con acceso inmediato a la Zona Rosa, el Parque 93, zonas de embajadas, clínicas de primer nivel y los mejores restaurantes de la ciudad.',
  section_label: 'SECCIÓN 05 · UBICACIÓN · PARQUE VIRREY — LA CABRERA',
  subtitle: 'Elegimos el mejor parque.',
  landmarks_title: 'En 500 metros desde Kubik:',
  landmarks: [
    { name: 'Parque la 93' },
    { name: 'Zona T / Andino' },
    { name: 'Clínica del Country y Fundación Santa Fe, clínica barraquer' },
    { name: 'Colegios internacionales (Nueva Granada, Anglo)' },
    { name: 'Zona Rosa y vida nocturna premium — 5 minutos' },
    { name: 'Centro Financiero calle 72' },
  ],
  quote: '"Elegimos esta dirección porque nuestros clientes no deberían tener que descubrir el barrio solos. Que lleguen a casa — no a una ciudad desconocida."',
};

export function Location() {
  const [c, setC] = useState<LocationContent>(locationDefaults);

  useEffect(() => {
    supabase.from('site_content').select('*').eq('key', 'location').maybeSingle().then(({ data }) => {
      if (!data) return;
      const j = (data.content_json ?? {}) as Record<string, unknown>;
      const lm = (j.landmarks as Landmark[]) ?? [];
      setC({
        title: data.title ?? locationDefaults.title,
        content: data.content ?? locationDefaults.content,
        section_label: (j.section_label as string) ?? locationDefaults.section_label,
        subtitle: (j.subtitle as string) ?? locationDefaults.subtitle,
        landmarks_title: (j.landmarks_title as string) ?? locationDefaults.landmarks_title,
        landmarks: lm.length > 0 ? lm : locationDefaults.landmarks,
        quote: (j.quote as string) ?? locationDefaults.quote,
      });
    });
  }, []);

  return (
    <section id="ubicacion" className="py-24 md:py-32 bg-light-bg">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <p className="text-xs tracking-widest text-olive/60 uppercase font-sans font-normal mb-10">
          {c.section_label}
        </p>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <h2 className="heading-lg text-dark mb-3">{c.title}</h2>
            <p className="text-base font-sans text-dark/70 font-medium mb-6">{c.subtitle}</p>
            <p className="text-editorial text-warm-gray leading-relaxed mb-8">{c.content}</p>

            {c.landmarks_title && (
              <p className="text-sm font-sans text-dark/60 mb-4 font-medium">{c.landmarks_title}</p>
            )}

            <ul className="space-y-3 mb-10">
              {c.landmarks.map((lm, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-olive flex-shrink-0" />
                  <span className="text-sm text-warm-gray leading-relaxed">{lm.name}</span>
                </li>
              ))}
            </ul>

            {c.quote && (
              <blockquote className="border-l-2 border-olive/40 pl-5 py-1">
                <p className="text-sm text-dark/60 italic leading-relaxed">{c.quote}</p>
              </blockquote>
            )}
          </div>

          <div className="relative aspect-square bg-soft-neutral/10 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-olive/20 to-muted-green/20">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 text-olive/60 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-sm text-warm-gray">
                  Interactive map coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
