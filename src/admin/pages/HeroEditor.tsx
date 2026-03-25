import { useState, useEffect } from 'react';
import { useSiteContent } from '../hooks/useSiteContent';
import { PageHeader } from '../components/PageHeader';
import { FormField, Input, Textarea } from '../components/FormField';
import { SaveButton } from '../components/SaveButton';
import { ImageUploadField } from '../components/ImageUploadField';

export function HeroEditor() {
  const { data, loading, saveStatus, errorMessage, save } = useSiteContent('hero');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('');
  const [city, setCity] = useState('');
  const [ctaPrimary, setCtaPrimary] = useState('');
  const [ctaSecondary, setCtaSecondary] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!data) return;
    setTitle(data.title ?? '');
    setContent(data.content ?? '');
    const j = data.content_json ?? {};
    setSubtitle(j.subtitle ?? '');
    setBadge(j.badge ?? '');
    setCity(j.city ?? '');
    setCtaPrimary(j.cta_primary ?? '');
    setCtaSecondary(j.cta_secondary ?? '');
    setImageUrl(j.image_url ?? '');
  }, [data]);

  const handleSave = () => {
    save({
      title,
      content,
      content_json: { subtitle, badge, city, cta_primary: ctaPrimary, cta_secondary: ctaSecondary, image_url: imageUrl },
    });
  };

  if (loading) return <div className="text-white/40 text-sm">Cargando...</div>;

  return (
    <div>
      <PageHeader title="Sección Hero" description="Edita el encabezado principal de la landing page." />

      <div className="max-w-2xl space-y-6">
        <FormField label="Título Principal" hint="Texto grande que aparece en el hero (ej: FLUXING HOME)">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="FLUXING HOME" />
        </FormField>

        <FormField label="Subtítulo / Badge" hint="Texto pequeño junto al título (ej: Residencias Urbanas)">
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Residencias Urbanas" />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Badge / Código" hint="Ej: 8i8">
            <Input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="8i8" />
          </FormField>
          <FormField label="Ciudad">
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bogotá" />
          </FormField>
        </div>

        <FormField label="Descripción" hint="Párrafo breve bajo el título">
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="Residencias urbanas amuebladas en Bogotá..." />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Botón Primario">
            <Input value={ctaPrimary} onChange={(e) => setCtaPrimary(e.target.value)} placeholder="Explorar Suites" />
          </FormField>
          <FormField label="Botón Secundario">
            <Input value={ctaSecondary} onChange={(e) => setCtaSecondary(e.target.value)} placeholder="Book Now" />
          </FormField>
        </div>

        <ImageUploadField
          label="Imagen de Fondo"
          hint="Imagen principal del hero"
          value={imageUrl}
          onChange={setImageUrl}
          aspectRatio="aspect-video"
        />

        <div className="pt-2">
          <SaveButton status={saveStatus} onClick={handleSave} errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}
