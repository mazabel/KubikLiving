import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Space } from '../types';

interface SpacesHeader {
  section_label: string;
  title: string;
  description: string;
}

const spacesHeaderDefaults: SpacesHeader = {
  section_label: 'Espacios Compartidos',
  title: 'Vida en Comunidad',
  description: 'Lugares diseñados para encuentros espontáneos y conexión genuina.',
};

const BENTO_CONFIGS = [
  { colSpan: 'md:col-span-2', rowSpan: 'md:row-span-2', aspectRatio: 'aspect-square md:aspect-auto' },
  { colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1', aspectRatio: 'aspect-[4/3]' },
  { colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1', aspectRatio: 'aspect-[4/3]' },
  { colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1', aspectRatio: 'aspect-[16/7]' },
  { colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1', aspectRatio: 'aspect-[4/3]' },
  { colSpan: 'md:col-span-1', rowSpan: 'md:row-span-2', aspectRatio: 'aspect-[3/4]' },
  { colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1', aspectRatio: 'aspect-[16/7]' },
];

interface BentoCardProps {
  space: Space;
  config: typeof BENTO_CONFIGS[0];
  index: number;
}

function BentoCard({ space, config, index }: BentoCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${config.colSpan} ${config.rowSpan} group relative overflow-hidden cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`relative w-full h-full min-h-[200px] ${config.aspectRatio} md:aspect-auto`}>
        {space.image_url ? (
          <img
            src={space.image_url}
            alt={space.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[#e8e4de]" />
        )}

        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(to top, rgba(15,12,8,0.75) 0%, rgba(15,12,8,0.1) 50%, transparent 100%)',
            opacity: hovered ? 1 : 0.55,
          }}
        />
        <div className="absolute inset-0 p-6 flex flex-col justify-end" style={{ zIndex: 3 }}>
          <div
            className="transition-all duration-500 ease-out"
            style={{
              transform: hovered ? 'translateY(0)' : 'translateY(4px)',
              opacity: hovered ? 1 : 0.9,
            }}
          >
            <h3 className="font-display font-normal uppercase text-white-cream text-2xl md:text-3xl leading-tight mb-2">
              {space.name}
            </h3>
            <p
              className="text-white-cream/70 text-sm leading-relaxed transition-all duration-500 ease-out overflow-hidden"
              style={{
                maxHeight: hovered ? '80px' : '0px',
                opacity: hovered ? 1 : 0,
              }}
            >
              {space.description}
            </p>
          </div>
        </div>

        {!space.image_url && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#b5afa8]/40 text-sm font-sans tracking-wide">No image</span>
          </div>
        )}
      </div>
    </div>
  );
}

function BentoSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-3 h-[600px]">
      <div className="md:col-span-2 md:row-span-2 bg-[#e8e4de]/50 animate-pulse rounded-none" />
      <div className="bg-[#e8e4de]/50 animate-pulse rounded-none" />
      <div className="bg-[#e8e4de]/50 animate-pulse rounded-none" />
    </div>
  );
}

export function Espacios() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState<SpacesHeader>(spacesHeaderDefaults);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;
        setSpaces(data || []);
      } catch (error) {
        console.error('Error fetching spaces:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchHeader = async () => {
      const { data } = await supabase
        .from('site_content')
        .select('*')
        .eq('key', 'spaces_header')
        .maybeSingle();
      if (!data) return;
      const j = (data.content_json ?? {}) as Record<string, string>;
      setHeader({
        section_label: j.section_label ?? spacesHeaderDefaults.section_label,
        title: data.title ?? spacesHeaderDefaults.title,
        description: data.content ?? spacesHeaderDefaults.description,
      });
    };

    fetchSpaces();
    fetchHeader();
  }, []);

  const getGridClass = (count: number) => {
    if (count <= 2) return 'grid md:grid-cols-2 gap-3';
    if (count === 3) return 'grid md:grid-cols-3 gap-3';
    return 'grid md:grid-cols-3 gap-3 md:auto-rows-[280px]';
  };

  return (
    <section id="espacios" className="py-24 md:py-32 bg-light-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-widest text-olive/60 uppercase font-sans font-normal mb-4">
              {header.section_label}
            </p>
            <h2 className="heading-lg text-dark">{header.title}</h2>
          </div>
          <p className="hidden md:block text-sm text-warm-gray text-right max-w-xs leading-relaxed">
            {header.description}
          </p>
        </div>

        {loading ? (
          <BentoSkeleton />
        ) : spaces.length > 0 ? (
          <div className={getGridClass(spaces.length)}>
            {spaces.map((space, index) => {
              const config = BENTO_CONFIGS[index % BENTO_CONFIGS.length];
              return (
                <BentoCard
                  key={space.id}
                  space={space}
                  config={config}
                  index={index}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-warm-gray">No hay espacios disponibles por el momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}
