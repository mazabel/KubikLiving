import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Service } from '../../types';
import { PageHeader } from '../components/PageHeader';
import { FormField, Input, Textarea } from '../components/FormField';
import { SaveButton } from '../components/SaveButton';
import { useSiteContent } from '../hooks/useSiteContent';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

function ServicesHeaderEditor() {
  const { data, loading, saveStatus, errorMessage, save } = useSiteContent('services_header');

  const [sectionLabel, setSectionLabel] = useState('');
  const [title, setTitle] = useState('');
  const [subtitleItalic, setSubtitleItalic] = useState('');
  const [description, setDescription] = useState('');
  const [labelIncluded, setLabelIncluded] = useState('');
  const [labelCorporate, setLabelCorporate] = useState('');
  const [labelAdditional, setLabelAdditional] = useState('');

  useEffect(() => {
    if (!data) return;
    const j = (data.content_json ?? {}) as Record<string, string>;
    setSectionLabel(j.section_label ?? '');
    setTitle(data.title ?? '');
    setSubtitleItalic(j.subtitle_italic ?? '');
    setDescription(data.content ?? '');
    setLabelIncluded(j.label_included ?? '');
    setLabelCorporate(j.label_corporate ?? '');
    setLabelAdditional(j.label_additional ?? '');
  }, [data]);

  if (loading) return null;

  return (
    <div className="mb-10 bg-[#1a1a1a] border border-white/10 p-6">
      <p className="text-xs tracking-widest text-white/40 uppercase mb-5">Encabezado de Sección</p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Etiqueta" hint="Texto pequeño superior (ej: Servicios)">
            <Input value={sectionLabel} onChange={(e) => setSectionLabel(e.target.value)} placeholder="Servicios" />
          </FormField>
          <FormField label="Título">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Operación integrada." />
          </FormField>
        </div>
        <FormField label="Subtítulo en Itálica">
          <Input value={subtitleItalic} onChange={(e) => setSubtitleItalic(e.target.value)} placeholder="Experiencia sin fricción." />
        </FormField>
        <FormField label="Descripción">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="El modelo Flux Living incluye..." />
        </FormField>
        <div className="border-t border-white/10 pt-4 space-y-3">
          <p className="text-xs tracking-widest text-white/30 uppercase">Etiquetas de categorías</p>
          <FormField label="Categoría Incluidos">
            <Input value={labelIncluded} onChange={(e) => setLabelIncluded(e.target.value)} placeholder="Lo que está incluido siempre" />
          </FormField>
          <FormField label="Categoría Empresas">
            <Input value={labelCorporate} onChange={(e) => setLabelCorporate(e.target.value)} placeholder="Para empresas con equipos en movimiento" />
          </FormField>
          <FormField label="Categoría Adicionales">
            <Input value={labelAdditional} onChange={(e) => setLabelAdditional(e.target.value)} placeholder="Servicios adicionales disponibles" />
          </FormField>
        </div>
        <SaveButton
          status={saveStatus}
          onClick={() => save({
            title,
            content: description,
            content_json: {
              section_label: sectionLabel,
              subtitle_italic: subtitleItalic,
              label_included: labelIncluded,
              label_corporate: labelCorporate,
              label_additional: labelAdditional,
            },
          })}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const iconOptions = ['wifi', 'sparkles', 'chef', 'shield', 'shirt', 'car', 'clock', 'user'];

const emptyForm = (): Partial<Service> => ({
  name: '',
  description: '',
  category: 'included',
  icon_name: 'sparkles',
  display_order: 0,
});

const categoryLabels: Record<string, string> = {
  included: 'Incluido siempre',
  corporate: 'Para empresas',
  additional: 'Adicional',
  optional: 'Opcional',
};

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const fetch = async () => {
    const { data } = await supabase.from('services').select('*').order('display_order');
    setServices(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(emptyForm()); setIsNew(true); };
  const openEdit = (s: Service) => { setEditing({ ...s }); setIsNew(false); };
  const close = () => { setEditing(null); setSaveStatus('idle'); };

  const handleSave = async () => {
    if (!editing) return;
    setSaveStatus('saving');
    const payload = {
      name: editing.name,
      description: editing.description || null,
      category: editing.category,
      icon_name: editing.icon_name || null,
      display_order: editing.display_order ?? 0,
    };
    let error;
    if (isNew) {
      ({ error } = await supabase.from('services').insert(payload));
    } else {
      ({ error } = await supabase.from('services').update(payload).eq('id', editing.id!));
    }
    if (error) {
      setSaveStatus('error');
    } else {
      setSaveStatus('saved');
      await fetch();
      setTimeout(() => close(), 1000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    await supabase.from('services').delete().eq('id', id);
    await fetch();
  };

  const grouped = (['included', 'corporate', 'additional', 'optional'] as const).map((cat) => ({
    cat,
    label: categoryLabels[cat],
    items: services.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  if (loading) return <div className="text-white/40 text-sm">Cargando...</div>;

  const ServiceRow = ({ service }: { service: Service }) => (
    <div className="flex items-center justify-between bg-[#1a1a1a] border border-white/10 px-5 py-3">
      <div className="flex items-center gap-3">
        <span className="text-xs bg-[#0f0f0f] border border-white/10 px-2 py-1 text-white/40">{service.icon_name}</span>
        <div>
          <p className="text-sm text-white">{service.name}</p>
          {service.description && <p className="text-xs text-white/40 line-clamp-1">{service.description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(service)} className="p-2 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
          <Pencil size={15} />
        </button>
        <button onClick={() => handleDelete(service.id)} className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Servicios" description="Gestiona los servicios incluidos, para empresas y adicionales." />

      <ServicesHeaderEditor />

      <button
        onClick={openNew}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#6b7c5c] hover:bg-[#5a6a4c] text-white text-sm mb-6 transition-colors"
      >
        <Plus size={16} /> Nuevo Servicio
      </button>

      <div className="space-y-6">
        {grouped.map(({ cat, label, items }) => (
          <div key={cat}>
            <h3 className="text-xs tracking-widest text-white/40 uppercase mb-3">{label} ({items.length})</h3>
            <div className="space-y-2">{items.map((s) => <ServiceRow key={s.id} service={s} />)}</div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg p-8 relative">
            <button onClick={close} className="absolute top-4 right-4 text-white/40 hover:text-white"><X size={20} /></button>
            <h2 className="text-lg font-bold text-white mb-6">{isNew ? 'Nuevo Servicio' : 'Editar Servicio'}</h2>
            <div className="space-y-5">
              <FormField label="Nombre">
                <Input value={editing.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </FormField>
              <FormField label="Descripción" hint="Opcional, visible en servicios opcionales">
                <Textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} />
              </FormField>
              <FormField label="Categoría">
                <select
                  value={editing.category ?? 'included'}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as Service['category'] })}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 text-white text-sm focus:border-[#6b7c5c] focus:outline-none"
                >
                  <option value="included">Incluido siempre</option>
                  <option value="corporate">Para empresas</option>
                  <option value="additional">Adicional</option>
                  <option value="optional">Opcional</option>
                </select>
              </FormField>
              <FormField label="Ícono" hint={`Opciones: ${iconOptions.join(', ')}`}>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setEditing({ ...editing, icon_name: icon })}
                      className={`px-3 py-2 text-xs border transition-colors ${
                        editing.icon_name === icon
                          ? 'border-[#6b7c5c] bg-[#6b7c5c]/20 text-[#9aad85]'
                          : 'border-white/10 text-white/40 hover:border-white/30'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </FormField>
              <FormField label="Orden">
                <Input type="number" min={0} value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: +e.target.value })} />
              </FormField>
              <div className="flex items-center justify-between pt-2">
                <button onClick={close} className="text-sm text-white/40 hover:text-white transition-colors">Cancelar</button>
                <SaveButton status={saveStatus} onClick={handleSave} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
