import { useState, useEffect } from 'react';
import { useSiteContent } from '../hooks/useSiteContent';
import { PageHeader } from '../components/PageHeader';
import { FormField, Input, Textarea } from '../components/FormField';
import { SaveButton } from '../components/SaveButton';
import { Plus, X } from 'lucide-react';

interface Pillar {
  icon: string;
  title: string;
  body: string;
}

const emptyPillar = (): Pillar => ({ icon: '→', title: '', body: '' });

export function SobreKubikEditor() {
  const { data, loading, saveStatus, errorMessage, save } = useSiteContent('sobre');

  const [sectionLabel, setSectionLabel] = useState('');
  const [brandName, setBrandName] = useState('');
  const [headline, setHeadline] = useState('');
  const [intro, setIntro] = useState('');
  const [pillarsTitle, setPillarsTitle] = useState('');
  const [pillars, setPillars] = useState<Pillar[]>([emptyPillar()]);
  const [teamTitle, setTeamTitle] = useState('');
  const [teamBody, setTeamBody] = useState('');

  useEffect(() => {
    if (!data) return;
    const j = (data.content_json ?? {}) as Record<string, unknown>;
    setSectionLabel((j.section_label as string) ?? '');
    setBrandName(data.title ?? '');
    setHeadline((j.headline as string) ?? '');
    setIntro(data.content ?? '');
    setPillarsTitle((j.pillars_title as string) ?? '');
    const lp = (j.pillars as Pillar[]) ?? [];
    setPillars(lp.length > 0 ? lp : [emptyPillar()]);
    setTeamTitle((j.team_title as string) ?? '');
    setTeamBody((j.team_body as string) ?? '');
  }, [data]);

  const updatePillar = (idx: number, field: keyof Pillar, value: string) => {
    const updated = [...pillars];
    updated[idx] = { ...updated[idx], [field]: value };
    setPillars(updated);
  };

  const addPillar = () => setPillars([...pillars, emptyPillar()]);

  const removePillar = (idx: number) => {
    if (pillars.length <= 1) return;
    setPillars(pillars.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    save({
      title: brandName,
      content: intro,
      content_json: {
        section_label: sectionLabel,
        headline,
        pillars_title: pillarsTitle,
        pillars: pillars.filter((p) => p.title.trim() !== ''),
        team_title: teamTitle,
        team_body: teamBody,
      },
    });
  };

  if (loading) return <div className="text-white/40 text-sm">Cargando...</div>;

  return (
    <div>
      <PageHeader title="Sobre Kubik Living" description="Edita el contenido de la página Sobre Kubik." />

      <div className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Etiqueta de Sección">
            <Input value={sectionLabel} onChange={(e) => setSectionLabel(e.target.value)} placeholder="SOBRE KUBIK LIVING" />
          </FormField>
          <FormField label="Nombre de Marca">
            <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Flux Living by Kubik." />
          </FormField>
        </div>

        <FormField label="Titular / Headline">
          <Textarea value={headline} onChange={(e) => setHeadline(e.target.value)} rows={2} placeholder="El modelo habitacional que responde a cómo viven..." />
        </FormField>

        <FormField label="Introducción" hint="Separa párrafos con una línea en blanco">
          <Textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={5} placeholder="Flux Living es el estándar que desarrollamos..." />
        </FormField>

        <div className="border-t border-white/10 pt-6">
          <FormField label="Título de Pilares" hint='Ej: "Lo que nos define."'>
            <Input value={pillarsTitle} onChange={(e) => setPillarsTitle(e.target.value)} placeholder="Lo que nos define." />
          </FormField>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs tracking-widest text-white/40 uppercase">Pilares / Valores</p>
            <button
              onClick={addPillar}
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
            >
              <Plus size={13} /> Agregar
            </button>
          </div>
          <div className="space-y-4">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="bg-[#0f0f0f] border border-white/10 p-4 space-y-3 relative">
                <button
                  onClick={() => removePillar(idx)}
                  disabled={pillars.length <= 1}
                  className="absolute top-3 right-3 p-1 text-white/20 hover:text-red-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="grid grid-cols-[80px_1fr] gap-3">
                  <FormField label="Icono">
                    <Input value={pillar.icon} onChange={(e) => updatePillar(idx, 'icon', e.target.value)} placeholder="→" />
                  </FormField>
                  <FormField label="Título">
                    <Input value={pillar.title} onChange={(e) => updatePillar(idx, 'title', e.target.value)} placeholder="Diseño como herramienta." />
                  </FormField>
                </div>
                <FormField label="Descripción">
                  <Textarea value={pillar.body} onChange={(e) => updatePillar(idx, 'body', e.target.value)} rows={2} placeholder="Cada decisión de diseño..." />
                </FormField>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 space-y-4">
          <FormField label="Título del Equipo">
            <Input value={teamTitle} onChange={(e) => setTeamTitle(e.target.value)} placeholder="El equipo." />
          </FormField>
          <FormField label="Descripción del Equipo">
            <Textarea value={teamBody} onChange={(e) => setTeamBody(e.target.value)} rows={3} placeholder="Detrás de Kubik hay personas que llevan años..." />
          </FormField>
        </div>

        <div className="pt-2">
          <SaveButton status={saveStatus} onClick={handleSave} errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}
