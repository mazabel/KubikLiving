import { useState, useEffect } from 'react';
import {
  Wifi, Sparkles, ChefHat, Shield, Shirt, Car, Clock, UserCheck,
  Building2, BarChart3, MapPin
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';

interface ServicesHeader {
  section_label: string;
  title: string;
  subtitle_italic: string;
  description: string;
  label_included: string;
  label_corporate: string;
  label_additional: string;
}

const servicesHeaderDefaults: ServicesHeader = {
  section_label: 'Servicios',
  title: 'Operación integrada.',
  subtitle_italic: 'Experiencia sin fricción.',
  description: 'El modelo Flux Living incluye servicios operados con estándares de hospitalidad. No como un hotel — como el lugar donde realmente vives, pero sin tener que gestionar nada.',
  label_included: 'Lo que está incluido siempre',
  label_corporate: 'Para empresas con equipos en movimiento',
  label_additional: 'Servicios adicionales disponibles',
};

const iconMap: Record<string, any> = {
  wifi: Wifi,
  sparkles: Sparkles,
  chef: ChefHat,
  shield: Shield,
  shirt: Shirt,
  car: Car,
  clock: Clock,
  user: UserCheck,
  building: Building2,
  chart: BarChart3,
  map: MapPin,
};

const getIcon = (iconName: string | null) => {
  if (!iconName) return Sparkles;
  return iconMap[iconName.toLowerCase()] || Sparkles;
};

interface ServiceWithSubtitle extends Service {
  subtitle?: string | null;
}

export function Services() {
  const [services, setServices] = useState<ServiceWithSubtitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState<ServicesHeader>(servicesHeaderDefaults);

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        setServices((data as ServiceWithSubtitle[]) || []);
        setLoading(false);
      });

    supabase
      .from('site_content')
      .select('*')
      .eq('key', 'services_header')
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const j = (data.content_json ?? {}) as Record<string, string>;
        setHeader({
          section_label: j.section_label ?? servicesHeaderDefaults.section_label,
          title: data.title ?? servicesHeaderDefaults.title,
          subtitle_italic: j.subtitle_italic ?? servicesHeaderDefaults.subtitle_italic,
          description: data.content ?? servicesHeaderDefaults.description,
          label_included: j.label_included ?? servicesHeaderDefaults.label_included,
          label_corporate: j.label_corporate ?? servicesHeaderDefaults.label_corporate,
          label_additional: j.label_additional ?? servicesHeaderDefaults.label_additional,
        });
      });
  }, []);

  const included = services.filter((s) => s.category === 'included');
  const corporate = services.filter((s) => s.category === 'corporate');
  const additional = services.filter((s) => s.category === 'additional');

  return (
    <section id="servicios" className="py-24 md:py-36 bg-white-cream">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 mb-20 md:mb-28">
          <div>
            <p className="text-xs tracking-[0.2em] text-olive/50 uppercase font-sans mb-5">{header.section_label}</p>
            <h2 className="heading-lg text-dark leading-[1.1]">
              {header.title}<br />
              <span className="font-display font-normal italic text-warm-gray">{header.subtitle_italic}</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-base md:text-lg text-warm-gray leading-relaxed font-light">
              {header.description}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse bg-light-bg h-20" />
            ))}
          </div>
        ) : (
          <div className="space-y-20 md:space-y-28">

            <div>
              <div className="flex items-center gap-4 mb-10">
                <span className="text-xs tracking-[0.2em] text-olive/50 uppercase font-sans">{header.label_included}</span>
                <span className="flex-1 h-px bg-warm-gray/15" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-warm-gray/10">
                {included.map((service) => {
                  const Icon = getIcon(service.icon_name);
                  return (
                    <div
                      key={service.id}
                      className="bg-white-cream p-8 group hover:bg-light-bg transition-colors duration-300"
                    >
                      <div className="flex items-start gap-5">
                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-olive/8 group-hover:bg-olive/14 transition-colors mt-0.5">
                          <Icon className="w-5 h-5 text-olive" strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-xs text-olive/40 font-sans">→</span>
                            <p className="text-sm font-sans font-medium text-dark tracking-wide">{service.name}</p>
                          </div>
                          {service.description && (
                            <p className="text-xs text-warm-gray leading-relaxed">{service.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {corporate.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <span className="text-xs tracking-[0.2em] text-olive/50 uppercase font-sans">{header.label_corporate}</span>
                  <span className="flex-1 h-px bg-warm-gray/15" />
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {corporate.map((service, i) => {
                    const Icon = getIcon(service.icon_name);
                    return (
                      <div key={service.id} className="border border-warm-gray/12 p-8 group hover:border-olive/30 transition-colors duration-300">
                        <div className="w-8 h-8 flex items-center justify-center bg-olive/8 mb-6">
                          <Icon className="w-4 h-4 text-olive" strokeWidth={1.5} />
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-xs text-olive/40 font-sans">0{i + 1}</span>
                          <p className="text-sm font-sans font-medium text-dark tracking-wide">{service.name}</p>
                        </div>
                        {service.description && (
                          <p className="text-xs text-warm-gray leading-relaxed">{service.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {additional.length > 0 && (
              <div className="pt-8 border-t border-warm-gray/10">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-xs tracking-[0.2em] text-olive/50 uppercase font-sans mr-3">{header.label_additional}</span>
                  {additional.map((service, i) => (
                    <span key={service.id} className="text-sm text-warm-gray font-light">
                      {service.name}{i < additional.length - 1 ? <span className="text-warm-gray/30 mx-2">·</span> : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}
