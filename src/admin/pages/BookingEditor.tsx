import { useState, useEffect } from 'react';
import { useSiteContent } from '../hooks/useSiteContent';
import { PageHeader } from '../components/PageHeader';
import { FormField, Input, Textarea } from '../components/FormField';
import { SaveButton } from '../components/SaveButton';

export function BookingEditor() {
  const { data, loading, saveStatus, errorMessage, save } = useSiteContent('booking');

  const [sectionLabel, setSectionLabel] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!data) return;
    const j = (data.content_json ?? {}) as Record<string, string>;
    setSectionLabel(j.section_label ?? '');
    setTitle(j.title ?? data.title ?? '');
    setDescription(j.description ?? data.content ?? '');
  }, [data]);

  const handleSave = () => {
    save({
      content_json: {
        section_label: sectionLabel,
        title,
        description,
      },
    });
  };

  if (loading) return <div className="text-white/40 text-sm">Cargando...</div>;

  return (
    <div>
      <PageHeader title="Sección Reserva" description="Edita el encabezado del formulario de reserva." />

      <div className="max-w-2xl space-y-6">
        <FormField label="Etiqueta de Sección" hint="Texto pequeño sobre el título (ej: Reserva)">
          <Input value={sectionLabel} onChange={(e) => setSectionLabel(e.target.value)} placeholder="Reserva" />
        </FormField>

        <FormField label="Título Principal">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book Your Stay" />
        </FormField>

        <FormField label="Descripción">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Completa el formulario y nos pondremos en contacto..." />
        </FormField>

        <div className="pt-2">
          <SaveButton status={saveStatus} onClick={handleSave} errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}
