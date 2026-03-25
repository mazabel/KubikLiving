import { useState, useEffect } from 'react';
import { useSiteContent } from '../hooks/useSiteContent';
import { PageHeader } from '../components/PageHeader';
import { FormField, Input, Textarea } from '../components/FormField';
import { SaveButton } from '../components/SaveButton';
import { ImageUploadField } from '../components/ImageUploadField';
import { Plus, X } from 'lucide-react';

interface GalleryImage {
  url: string;
  caption: string;
}

const defaultGalleryImages: GalleryImage[] = [
  { url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Sala Principal' },
  { url: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Cocina Moderna' },
  { url: 'https://images.pexels.com/photos/2098405/pexels-photo-2098405.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Dormitorio Principal' },
  { url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Detalles Arquitectónicos' },
  { url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Baño de Lujo' },
  { url: 'https://images.pexels.com/photos/2029722/pexels-photo-2029722.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Vista Panorámica' },
];

export function ContextEditor() {
  const { data, loading, saveStatus, errorMessage, save } = useSiteContent('context');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description2, setDescription2] = useState('');
  const [sectionLabel, setSectionLabel] = useState('');
  const [stat1Value, setStat1Value] = useState('');
  const [stat1Label, setStat1Label] = useState('');
  const [stat2Value, setStat2Value] = useState('');
  const [stat2Label, setStat2Label] = useState('');
  const [stat3Value, setStat3Value] = useState('');
  const [stat3Label, setStat3Label] = useState('');
  const [fluxSectionLabel, setFluxSectionLabel] = useState('');
  const [fluxTitle, setFluxTitle] = useState('');
  const [fluxDescription, setFluxDescription] = useState('');
  const [step1Title, setStep1Title] = useState('');
  const [step1Body, setStep1Body] = useState('');
  const [step2Title, setStep2Title] = useState('');
  const [step2Body, setStep2Body] = useState('');
  const [step3Title, setStep3Title] = useState('');
  const [step3Body, setStep3Body] = useState('');
  const [step4Title, setStep4Title] = useState('');
  const [step4Body, setStep4Body] = useState('');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(defaultGalleryImages);

  useEffect(() => {
    if (!data) return;
    setTitle(data.title ?? '');
    setContent(data.content ?? '');
    const j = data.content_json ?? {};
    setDescription2(j.description_2 ?? '');
    setSectionLabel(j.section_label ?? '');
    setStat1Value(j.stat_1_value ?? '');
    setStat1Label(j.stat_1_label ?? '');
    setStat2Value(j.stat_2_value ?? '');
    setStat2Label(j.stat_2_label ?? '');
    setStat3Value(j.stat_3_value ?? '');
    setStat3Label(j.stat_3_label ?? '');
    setFluxSectionLabel(j.flux_section_label ?? '');
    setFluxTitle(j.flux_title ?? '');
    setFluxDescription(j.flux_description ?? '');
    setStep1Title(j.step_1_title ?? '');
    setStep1Body(j.step_1_body ?? '');
    setStep2Title(j.step_2_title ?? '');
    setStep2Body(j.step_2_body ?? '');
    setStep3Title(j.step_3_title ?? '');
    setStep3Body(j.step_3_body ?? '');
    setStep4Title(j.step_4_title ?? '');
    setStep4Body(j.step_4_body ?? '');
    const imgs = j.gallery_images as GalleryImage[] | undefined;
    if (imgs && imgs.length > 0) setGalleryImages(imgs);
  }, [data]);

  const handleSave = () => {
    save({
      title,
      content,
      content_json: {
        description_2: description2,
        section_label: sectionLabel,
        stat_1_value: stat1Value,
        stat_1_label: stat1Label,
        stat_2_value: stat2Value,
        stat_2_label: stat2Label,
        stat_3_value: stat3Value,
        stat_3_label: stat3Label,
        flux_section_label: fluxSectionLabel,
        flux_title: fluxTitle,
        flux_description: fluxDescription,
        step_1_title: step1Title,
        step_1_body: step1Body,
        step_2_title: step2Title,
        step_2_body: step2Body,
        step_3_title: step3Title,
        step_3_body: step3Body,
        step_4_title: step4Title,
        step_4_body: step4Body,
        gallery_images: galleryImages.filter((img) => img.url.trim() !== ''),
      },
    });
  };

  const updateImage = (idx: number, field: keyof GalleryImage, value: string) => {
    const updated = [...galleryImages];
    updated[idx] = { ...updated[idx], [field]: value };
    setGalleryImages(updated);
  };

  const removeImage = (idx: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  const addImage = () => {
    setGalleryImages([...galleryImages, { url: '', caption: '' }]);
  };

  if (loading) return <div className="text-white/40 text-sm">Cargando...</div>;

  const stepFields = [
    { num: '01', title: step1Title, setTitle: setStep1Title, body: step1Body, setBody: setStep1Body },
    { num: '02', title: step2Title, setTitle: setStep2Title, body: step2Body, setBody: setStep2Body },
    { num: '03', title: step3Title, setTitle: setStep3Title, body: step3Body, setBody: setStep3Body },
    { num: '04', title: step4Title, setTitle: setStep4Title, body: step4Body, setBody: setStep4Body },
  ];

  return (
    <div>
      <PageHeader title="Sección Contexto" description="Edita el contenido de 'El Proyecto' y 'Fluxing Living'." />

      <div className="max-w-2xl space-y-10">

        <section className="space-y-6">
          <h3 className="text-xs tracking-widest text-white/40 uppercase border-b border-white/10 pb-3">
            El Proyecto
          </h3>

          <FormField label="Etiqueta de Sección" hint="Texto pequeño sobre el título (ej: El Proyecto)">
            <Input value={sectionLabel} onChange={(e) => setSectionLabel(e.target.value)} placeholder="El Proyecto" />
          </FormField>

          <FormField label="Título Principal">
            <Textarea value={title} onChange={(e) => setTitle(e.target.value)} rows={2} placeholder="Arquitectura que define un nuevo estándar en Bogotá." />
          </FormField>

          <FormField label="Primer Párrafo">
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
          </FormField>

          <FormField label="Segundo Párrafo">
            <Textarea value={description2} onChange={(e) => setDescription2(e.target.value)} rows={4} />
          </FormField>

          <div className="border-t border-white/10 pt-6">
            <p className="text-xs tracking-widest text-white/40 uppercase mb-4">Estadísticas</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormField label="Valor 1">
                  <Input value={stat1Value} onChange={(e) => setStat1Value(e.target.value)} placeholder="8" />
                </FormField>
                <FormField label="Etiqueta 1">
                  <Input value={stat1Label} onChange={(e) => setStat1Label(e.target.value)} placeholder="Residencias Únicas" />
                </FormField>
              </div>
              <div className="space-y-2">
                <FormField label="Valor 2">
                  <Input value={stat2Value} onChange={(e) => setStat2Value(e.target.value)} placeholder="78–132" />
                </FormField>
                <FormField label="Etiqueta 2">
                  <Input value={stat2Label} onChange={(e) => setStat2Label(e.target.value)} placeholder="m² Interiores" />
                </FormField>
              </div>
              <div className="space-y-2">
                <FormField label="Valor 3">
                  <Input value={stat3Value} onChange={(e) => setStat3Value(e.target.value)} placeholder="100%" />
                </FormField>
                <FormField label="Etiqueta 3">
                  <Input value={stat3Label} onChange={(e) => setStat3Label(e.target.value)} placeholder="Amobladas y Equipadas" />
                </FormField>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs tracking-widest text-white/40 uppercase">Imágenes del Carrusel</p>
              <button
                onClick={addImage}
                className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
              >
                <Plus size={13} /> Agregar imagen
              </button>
            </div>
            <div className="space-y-6">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="bg-[#0f0f0f] border border-white/10 p-4 space-y-3 relative">
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-3 right-3 p-1 text-white/20 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <p className="text-xs text-white/30 font-mono">{String(idx + 1).padStart(2, '0')}</p>
                  <ImageUploadField
                    label="Imagen"
                    value={img.url}
                    onChange={(url) => updateImage(idx, 'url', url)}
                    aspectRatio="aspect-video"
                  />
                  <FormField label="Pie de foto">
                    <Input
                      value={img.caption}
                      onChange={(e) => updateImage(idx, 'caption', e.target.value)}
                      placeholder="Sala Principal"
                    />
                  </FormField>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xs tracking-widest text-white/40 uppercase border-b border-white/10 pb-3">
            Fluxing Living
          </h3>

          <FormField label="Etiqueta de Sección" hint="Texto pequeño sobre el título (ej: Flexibilidad)">
            <Input value={fluxSectionLabel} onChange={(e) => setFluxSectionLabel(e.target.value)} placeholder="Flexibilidad" />
          </FormField>

          <FormField label="Título">
            <Textarea value={fluxTitle} onChange={(e) => setFluxTitle(e.target.value)} rows={2} placeholder="Así funciona Fluxing Living" />
          </FormField>

          <FormField label="Descripción">
            <Textarea value={fluxDescription} onChange={(e) => setFluxDescription(e.target.value)} rows={3} placeholder="Un modelo diseñado para adaptarse a cada etapa..." />
          </FormField>

          <div className="border-t border-white/10 pt-6 space-y-4">
            <p className="text-xs tracking-widest text-white/40 uppercase">Pasos</p>

            {stepFields.map(({ num, title: t, setTitle: st, body: b, setBody: sb }) => (
              <div key={num} className="bg-white/[0.03] border border-white/8 rounded p-4 space-y-3">
                <p className="text-xs text-white/30 font-mono">{num}</p>
                <FormField label="Título del paso">
                  <Input value={t} onChange={(e) => st(e.target.value)} placeholder={`Título paso ${num}`} />
                </FormField>
                <FormField label="Descripción del paso">
                  <Textarea value={b} onChange={(e) => sb(e.target.value)} rows={2} placeholder="Descripción..." />
                </FormField>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-2">
          <SaveButton status={saveStatus} onClick={handleSave} errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}
