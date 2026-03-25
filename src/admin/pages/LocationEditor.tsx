import { useState, useEffect } from 'react';
import { useSiteContent } from '../hooks/useSiteContent';
import { PageHeader } from '../components/PageHeader';
import { FormField, Input, Textarea } from '../components/FormField';
import { SaveButton } from '../components/SaveButton';
import { Plus, X } from 'lucide-react';

const MAX_LANDMARKS = 10;

interface Landmark {
  name: string;
}

export function LocationEditor() {
  const { data, loading, saveStatus, errorMessage, save } = useSiteContent('location');

  const [sectionLabel, setSectionLabel] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [landmarksTitle, setLandmarksTitle] = useState('');
  const [landmarks, setLandmarks] = useState<Landmark[]>([{ name: '' }]);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (!data) return;
    const j = (data.content_json ?? {}) as Record<string, unknown>;
    setSectionLabel((j.section_label as string) ?? '');
    setNeighborhood(data.title ?? '');
    setSubtitle((j.subtitle as string) ?? '');
    setContent(data.content ?? '');
    setLandmarksTitle((j.landmarks_title as string) ?? '');
    const lm = (j.landmarks as Landmark[]) ?? [];
    setLandmarks(lm.length > 0 ? lm : [{ name: '' }]);
    setQuote((j.quote as string) ?? '');
  }, [data]);

  const updateLandmark = (idx: number, value: string) => {
    const updated = [...landmarks];
    updated[idx] = { name: value };
    setLandmarks(updated);
  };

  const addLandmark = () => {
    if (landmarks.length >= MAX_LANDMARKS) return;
    setLandmarks([...landmarks, { name: '' }]);
  };

  const removeLandmark = (idx: number) => {
    if (landmarks.length <= 1) return;
    setLandmarks(landmarks.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    save({
      title: neighborhood,
      content,
      content_json: {
        section_label: sectionLabel,
        subtitle,
        landmarks_title: landmarksTitle,
        landmarks: landmarks.filter((l) => l.name.trim() !== ''),
        quote,
      },
    });
  };

  if (loading) return <div className="text-white/40 text-sm">Cargando...</div>;

  return (
    <div>
      <PageHeader title="Sección Ubicación" description="Edita la información de ubicación y puntos de referencia." />

      <div className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Etiqueta de Sección" hint="Ej: SECCIÓN 05 · UBICACIÓN">
            <Input value={sectionLabel} onChange={(e) => setSectionLabel(e.target.value)} placeholder="SECCIÓN 05 · UBICACIÓN · PARQUE VIRREY — LA CABRERA" />
          </FormField>
          <FormField label="Barrio / Zona">
            <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Parque Virrey- La Cabrera" />
          </FormField>
        </div>

        <FormField label="Subtítulo">
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Elegimos el mejor parque." />
        </FormField>

        <FormField label="Descripción">
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="El Parque el Virrey es el eje del mejor barrio..." />
        </FormField>

        <div className="border-t border-white/10 pt-6">
          <FormField label="Título de la lista de puntos" hint="Ej: En 500 metros desde Kubik:">
            <Input value={landmarksTitle} onChange={(e) => setLandmarksTitle(e.target.value)} placeholder="En 500 metros desde Kubik:" />
          </FormField>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs tracking-widest text-white/40 uppercase">Puntos de Referencia</p>
            {landmarks.length < MAX_LANDMARKS && (
              <button
                onClick={addLandmark}
                className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
              >
                <Plus size={13} /> Agregar
              </button>
            )}
          </div>
          <div className="space-y-2">
            {landmarks.map((lm, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-white/20 text-xs w-4 flex-shrink-0 text-right">{idx + 1}</span>
                <Input
                  value={lm.name}
                  onChange={(e) => updateLandmark(idx, e.target.value)}
                  placeholder="Parque la 93"
                />
                <button
                  onClick={() => removeLandmark(idx)}
                  disabled={landmarks.length <= 1}
                  className="p-1.5 text-white/20 hover:text-red-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <FormField label="Cita / Quote" hint="Texto destacado al final de la sección">
            <Textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={3} placeholder='"Elegimos esta dirección porque nuestros clientes no deberían tener que descubrir el barrio solos..."' />
          </FormField>
        </div>

        <div className="pt-2">
          <SaveButton status={saveStatus} onClick={handleSave} errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}
