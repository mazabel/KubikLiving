import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface GalleryImage {
  url: string;
  caption: string;
}

interface ContextContent {
  title: string;
  content: string;
  description_2: string;
  section_label: string;
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
  flux_section_label: string;
  flux_title: string;
  flux_description: string;
  step_1_title: string;
  step_1_body: string;
  step_2_title: string;
  step_2_body: string;
  step_3_title: string;
  step_3_body: string;
  step_4_title: string;
  step_4_body: string;
  gallery_images: GalleryImage[];
}

const contextDefaults: ContextContent = {
  title: 'Arquitectura que define un nuevo estándar en Bogotá.',
  content: 'KubikLiving 8i8 nace de la convicción de que el espacio bien construido transforma la manera en que habitamos la ciudad. Cada residencia es una declaración de precisión material: concreto expuesto, madera natural, luz calculada.',
  description_2: 'Sin concesiones estéticas. Solo la permanencia honesta de los materiales, la generosidad del espacio y la ciudad como telón de fondo permanente.',
  section_label: 'El Proyecto',
  stat_1_value: '8',
  stat_1_label: 'Residencias Únicas',
  stat_2_value: '78–132',
  stat_2_label: 'm² Interiores',
  stat_3_value: '100%',
  stat_3_label: 'Amobladas y Equipadas',
  flux_section_label: 'Flexibilidad',
  flux_title: 'Así funciona Fluxing Living',
  flux_description: 'Un modelo diseñado para adaptarse a cada etapa de tu vida o negocio, sin fricciones y sin el costo de una mudanza.',
  step_1_title: 'Llegas solo',
  step_1_body: 'Entras en tu apartamento de 1 habitación. Espacio ideal para empezar, sin pagar de más.',
  step_2_title: 'Tu equipo crece',
  step_2_body: 'Avisas con anticipación. Incluimos 2 o 3 habitaciones adicionales — sin mudarte, sin nuevo contrato.',
  step_3_title: 'Flexibilidad total',
  step_3_body: 'Salida anticipada o reducción de configuración. El espacio se adapta a tu realidad, no al revés.',
  step_4_title: 'Tu familia llega',
  step_4_body: 'Conectamos los espacios: de 1 a 3 habitaciones, sala amplia y cocina completa. Todo en el mismo edificio.',
  gallery_images: [
    { url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Sala Principal' },
    { url: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Cocina Moderna' },
    { url: 'https://images.pexels.com/photos/2098405/pexels-photo-2098405.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Dormitorio Principal' },
    { url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Detalles Arquitectónicos' },
    { url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Baño de Lujo' },
    { url: 'https://images.pexels.com/photos/2029722/pexels-photo-2029722.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Vista Panorámica' },
  ],
};

export function Context() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [c, setC] = useState<ContextContent>(contextDefaults);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('*')
      .eq('key', 'context')
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const j = (data.content_json ?? {}) as Record<string, string>;
        setC({
          title: data.title ?? contextDefaults.title,
          content: data.content ?? contextDefaults.content,
          description_2: j.description_2 ?? contextDefaults.description_2,
          section_label: j.section_label ?? contextDefaults.section_label,
          stat_1_value: j.stat_1_value ?? contextDefaults.stat_1_value,
          stat_1_label: j.stat_1_label ?? contextDefaults.stat_1_label,
          stat_2_value: j.stat_2_value ?? contextDefaults.stat_2_value,
          stat_2_label: j.stat_2_label ?? contextDefaults.stat_2_label,
          stat_3_value: j.stat_3_value ?? contextDefaults.stat_3_value,
          stat_3_label: j.stat_3_label ?? contextDefaults.stat_3_label,
          flux_section_label: j.flux_section_label ?? contextDefaults.flux_section_label,
          flux_title: j.flux_title ?? contextDefaults.flux_title,
          flux_description: j.flux_description ?? contextDefaults.flux_description,
          step_1_title: j.step_1_title ?? contextDefaults.step_1_title,
          step_1_body: j.step_1_body ?? contextDefaults.step_1_body,
          step_2_title: j.step_2_title ?? contextDefaults.step_2_title,
          step_2_body: j.step_2_body ?? contextDefaults.step_2_body,
          step_3_title: j.step_3_title ?? contextDefaults.step_3_title,
          step_3_body: j.step_3_body ?? contextDefaults.step_3_body,
          step_4_title: j.step_4_title ?? contextDefaults.step_4_title,
          step_4_body: j.step_4_body ?? contextDefaults.step_4_body,
          gallery_images: (j.gallery_images as GalleryImage[] | undefined)?.length
            ? (j.gallery_images as GalleryImage[])
            : contextDefaults.gallery_images,
        });
      });
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % c.gallery_images.length);
        setIsTransitioning(false);
      }, 400);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoplay, currentIndex]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setAutoplay(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 400);
  };

  const stats = [
    { value: c.stat_1_value, label: c.stat_1_label },
    { value: c.stat_2_value, label: c.stat_2_label },
    { value: c.stat_3_value, label: c.stat_3_label },
  ];

  const steps = [
    { step: '01', title: c.step_1_title, body: c.step_1_body },
    { step: '02', title: c.step_2_title, body: c.step_2_body },
    { step: '03', title: c.step_3_title, body: c.step_3_body },
    { step: '04', title: c.step_4_title, body: c.step_4_body },
  ];

  return (
    <>
      <section id="context" className="bg-white-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-0">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            <div className="lg:col-span-5 space-y-10">
              <div>
                <p className="text-xs tracking-[0.2em] text-olive/50 uppercase font-sans mb-6">
                  {c.section_label}
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-display font-semibold uppercase text-dark leading-[1.08]">
                  {c.title}
                </h2>
              </div>

              <div className="space-y-5 pt-2">
                <p className="text-base text-warm-gray leading-[1.75] font-light">
                  {c.content}
                </p>
                <p className="text-base text-warm-gray leading-[1.75] font-light">
                  {c.description_2}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-0 pt-4 border-t border-warm-gray/15">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className={`py-6 ${i < 2 ? 'border-r border-warm-gray/15 pr-6' : ''} ${i > 0 ? 'pl-6' : ''}`}
                  >
                    <p className="text-3xl md:text-4xl font-display font-semibold uppercase text-dark leading-none mb-2">
                      {stat.value}
                    </p>
                    <p className="text-[10px] tracking-[0.18em] text-soft-neutral uppercase leading-snug">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 relative">
              <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
                {c.gallery_images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={img.caption}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      i === currentIndex && !isTransitioning ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}

                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark/50 to-transparent pointer-events-none" />

                <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                  <p className="text-white/80 text-xs tracking-[0.15em] uppercase font-sans">
                    {c.gallery_images[currentIndex].caption}
                  </p>
                  <p className="text-white/40 text-xs font-sans tabular-nums">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(c.gallery_images.length).padStart(2, '0')}
                  </p>
                </div>
              </div>

              <div className="flex gap-1.5 mt-4">
                {c.gallery_images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-0.5 transition-all duration-500 ${
                      index === currentIndex
                        ? 'bg-dark w-10'
                        : 'bg-warm-gray/25 w-5 hover:bg-warm-gray/50'
                    }`}
                    aria-label={`Imagen ${index + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-white-cream py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <p className="text-xs tracking-[0.2em] text-olive/50 uppercase font-sans mb-6">
                {c.flux_section_label}
              </p>
              <h2 className="text-4xl md:text-5xl font-display font-semibold uppercase text-dark leading-[1.08] mb-6">
                {c.flux_title}
              </h2>
              <p className="text-base text-warm-gray leading-[1.75] font-light">
                {c.flux_description}
              </p>

              <div className="mt-12 flex gap-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`h-0.5 transition-all duration-400 ${
                      i === activeStep ? 'bg-dark w-10' : 'bg-warm-gray/20 w-5 hover:bg-warm-gray/40'
                    }`}
                    aria-label={`Paso ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="space-y-0">
                {steps.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`w-full text-left group transition-all duration-300 border-t border-warm-gray/15 ${
                      i === steps.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="py-8 md:py-10 transition-all duration-300">
                      <div className="flex items-start gap-8 md:gap-12">
                        <span className={`text-xs font-sans tabular-nums transition-colors duration-300 pt-1 shrink-0 ${
                          activeStep === i ? 'text-dark' : 'text-soft-neutral/40'
                        }`}>
                          {item.step}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-6">
                            <h3 className={`text-xl md:text-2xl font-display font-normal uppercase transition-colors duration-300 leading-snug ${
                              activeStep === i ? 'text-dark' : 'text-dark/50 group-hover:text-dark/80'
                            }`}>
                              {item.title}
                            </h3>
                            <span className={`text-warm-gray/30 text-lg transition-transform duration-300 shrink-0 mt-0.5 ${
                              activeStep === i ? 'rotate-45 text-dark/30' : 'group-hover:text-warm-gray/60'
                            }`}>
                              +
                            </span>
                          </div>

                          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            activeStep === i ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                          }`}>
                            <p className="text-base text-warm-gray leading-[1.75] font-light pr-8">
                              {item.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
