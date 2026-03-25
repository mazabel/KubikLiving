import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Space } from '../../types';
import { PageHeader } from '../components/PageHeader';
import { FormField, Input, Textarea } from '../components/FormField';
import { SaveButton } from '../components/SaveButton';
import { useSiteContent } from '../hooks/useSiteContent';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { ImageUploadField } from '../components/ImageUploadField';

function SpacesHeaderEditor() {
  const { data, loading, saveStatus, errorMessage, save } = useSiteContent('spaces_header');

  const [sectionLabel, setSectionLabel] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!data) return;
    const j = (data.content_json ?? {}) as Record<string, string>;
    setSectionLabel(j.section_label ?? '');
    setTitle(data.title ?? '');
    setDescription(data.content ?? '');
  }, [data]);

  if (loading) return null;

  return (
    <div className="mb-10 bg-[#1a1a1a] border border-white/10 p-6">
      <p className="text-xs tracking-widest text-white/40 uppercase mb-5">Encabezado de Sección</p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Etiqueta" hint="Texto pequeño (ej: Espacios Compartidos)">
            <Input value={sectionLabel} onChange={(e) => setSectionLabel(e.target.value)} placeholder="Espacios Compartidos" />
          </FormField>
          <FormField label="Título Principal">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Vida en Comunidad" />
          </FormField>
        </div>
        <FormField label="Descripción / Subtexto">
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Lugares diseñados para encuentros espontáneos..." />
        </FormField>
        <SaveButton
          status={saveStatus}
          onClick={() => save({ title, content: description, content_json: { section_label: sectionLabel } })}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const emptyForm = (): Partial<Space> => ({
  name: '',
  description: '',
  image_url: '',
  display_order: 0,
});

export function SpacesManager() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Space> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const fetch = async () => {
    const { data } = await supabase.from('spaces').select('*').order('display_order');
    setSpaces(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(emptyForm()); setIsNew(true); };
  const openEdit = (s: Space) => { setEditing({ ...s }); setIsNew(false); };
  const close = () => { setEditing(null); setSaveStatus('idle'); };

  const handleSave = async () => {
    if (!editing) return;
    setSaveStatus('saving');
    const payload = {
      name: editing.name,
      description: editing.description || null,
      image_url: editing.image_url || null,
      display_order: editing.display_order ?? 0,
    };
    let error;
    if (isNew) {
      ({ error } = await supabase.from('spaces').insert(payload));
    } else {
      ({ error } = await supabase.from('spaces').update(payload).eq('id', editing.id!));
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
    if (!confirm('¿Eliminar este espacio?')) return;
    await supabase.from('spaces').delete().eq('id', id);
    await fetch();
  };

  if (loading) return <div className="text-white/40 text-sm">Cargando...</div>;

  return (
    <div>
      <PageHeader title="Espacios Compartidos" description="Gestiona los espacios comunes de la propiedad." />

      <SpacesHeaderEditor />

      <button
        onClick={openNew}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#6b7c5c] hover:bg-[#5a6a4c] text-white text-sm mb-6 transition-colors"
      >
        <Plus size={16} /> Nuevo Espacio
      </button>

      <div className="space-y-3">
        {spaces.map((space) => (
          <div key={space.id} className="flex items-center justify-between bg-[#1a1a1a] border border-white/10 px-5 py-4">
            <div className="flex items-center gap-4">
              {space.image_url ? (
                <img src={space.image_url} alt={space.name} className="w-14 h-10 object-cover bg-[#0f0f0f]" />
              ) : (
                <div className="w-14 h-10 bg-[#0f0f0f] border border-white/10" />
              )}
              <div>
                <p className="text-sm text-white font-medium">{space.name}</p>
                <p className="text-xs text-white/40 line-clamp-1">{space.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(space)} className="p-2 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <Pencil size={15} />
              </button>
              <button onClick={() => handleDelete(space.id)} className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg p-8 relative">
            <button onClick={close} className="absolute top-4 right-4 text-white/40 hover:text-white"><X size={20} /></button>
            <h2 className="text-lg font-bold text-white mb-6">{isNew ? 'Nuevo Espacio' : 'Editar Espacio'}</h2>
            <div className="space-y-5">
              <FormField label="Nombre">
                <Input value={editing.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </FormField>
              <FormField label="Descripción">
                <Textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
              </FormField>
              <ImageUploadField
                label="Imagen"
                value={editing.image_url ?? ''}
                onChange={(url) => setEditing({ ...editing, image_url: url })}
              />
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
