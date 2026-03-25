import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Suite } from '../../types';
import { PageHeader } from '../components/PageHeader';
import { FormField, Input, Textarea } from '../components/FormField';
import { SaveButton } from '../components/SaveButton';
import { useSiteContent } from '../hooks/useSiteContent';
import { Plus, Pencil, Trash2, X, ChevronUp, ChevronDown, Upload, Images, GripVertical } from 'lucide-react';

const BUCKET = 'suite-images';

interface StorageImage {
  name: string;
  url: string;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const emptyForm = (): Partial<Suite> => ({
  name: '',
  type: '',
  bedrooms: 1,
  bathrooms: 1,
  guests: 2,
  area_sqm: 0,
  terrace_sqm: null,
  day_price: 0,
  month_price: 0,
  description: '',
  images: [],
  tour_3d_url: '',
  video_url: '',
  display_order: 0,
});

function SuitesHeaderEditor() {
  const { data, loading, saveStatus, errorMessage, save } = useSiteContent('suites_header');

  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [taglineLeft, setTaglineLeft] = useState('');
  const [taglineRight, setTaglineRight] = useState('');
  const [sectionLabel, setSectionLabel] = useState('');

  useEffect(() => {
    if (!data) return;
    const j = (data.content_json ?? {}) as Record<string, unknown>;
    setHeading(data.title ?? '');
    setSubheading(data.content ?? '');
    setTaglineLeft((j.tagline_left as string) ?? '');
    setTaglineRight((j.tagline_right as string) ?? '');
    setSectionLabel((j.section_label as string) ?? '');
  }, [data]);

  if (loading) return null;

  return (
    <div className="mb-10 bg-[#1a1a1a] border border-white/10 p-6">
      <p className="text-xs tracking-widest text-white/40 uppercase mb-5">Encabezado de Sección</p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Título Principal">
            <Input value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="Apartamentos y Residencias" />
          </FormField>
          <FormField label="Etiqueta (opcional)">
            <Input value={sectionLabel} onChange={(e) => setSectionLabel(e.target.value)} placeholder="Ej: KUBIK 8I8" />
          </FormField>
        </div>
        <FormField label="Subtítulo / Descripción">
          <Textarea value={subheading} onChange={(e) => setSubheading(e.target.value)} rows={2} placeholder="Doce espacios diferentes. Un solo edificio." />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Tagline izquierda">
            <Input value={taglineLeft} onChange={(e) => setTaglineLeft(e.target.value)} placeholder="Tres configuraciones." />
          </FormField>
          <FormField label="Tagline derecha">
            <Input value={taglineRight} onChange={(e) => setTaglineRight(e.target.value)} placeholder="Una sola filosofía de habitación." />
          </FormField>
        </div>
        <SaveButton
          status={saveStatus}
          onClick={() => save({ title: heading, content: subheading, content_json: { section_label: sectionLabel, tagline_left: taglineLeft, tagline_right: taglineRight } })}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}

export function SuitesManager() {
  const [suites, setSuites] = useState<Suite[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSuite, setEditingSuite] = useState<Partial<Suite> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [imageInput, setImageInput] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [galleryImages, setGalleryImages] = useState<StorageImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const fetchSuites = async () => {
    const { data } = await supabase.from('suites').select('*').order('display_order');
    setSuites(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchSuites(); }, []);

  const fetchGallery = async () => {
    const { data } = await supabase.storage.from(BUCKET).list('', {
      sortBy: { column: 'created_at', order: 'desc' },
    });
    const items = (data ?? []).filter((f) => f.name !== '.emptyFolderPlaceholder');
    setGalleryImages(items.map((file) => {
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(file.name);
      return { name: file.name, url: urlData.publicUrl };
    }));
  };

  const openPicker = () => {
    fetchGallery();
    setShowPicker(true);
  };

  const pickImage = (url: string) => {
    if (!editingSuite) return;
    if ((editingSuite.images ?? []).includes(url)) return;
    setEditingSuite({ ...editingSuite, images: [...(editingSuite.images ?? []), url] });
    setShowPicker(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (!error) {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
        uploaded.push(urlData.publicUrl);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploading(false);
    if (uploaded.length > 0 && editingSuite) {
      setEditingSuite({ ...editingSuite, images: [...(editingSuite.images ?? []), ...uploaded] });
    }
  };

  const openNew = () => {
    setEditingSuite(emptyForm());
    setIsNew(true);
    setImageInput('');
  };

  const openEdit = (suite: Suite) => {
    setEditingSuite({ ...suite });
    setIsNew(false);
    setImageInput('');
  };

  const closeForm = () => {
    setEditingSuite(null);
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    if (!editingSuite) return;
    setSaveStatus('saving');

    const payload = {
      name: editingSuite.name,
      type: editingSuite.type,
      bedrooms: editingSuite.bedrooms,
      bathrooms: editingSuite.bathrooms,
      guests: editingSuite.guests,
      area_sqm: editingSuite.area_sqm,
      terrace_sqm: editingSuite.terrace_sqm || null,
      day_price: editingSuite.day_price,
      month_price: editingSuite.month_price,
      description: editingSuite.description,
      images: editingSuite.images ?? [],
      tour_3d_url: editingSuite.tour_3d_url || null,
      video_url: editingSuite.video_url || null,
      display_order: editingSuite.display_order ?? 0,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from('suites').insert(payload));
    } else {
      ({ error } = await supabase.from('suites').update(payload).eq('id', editingSuite.id!));
    }

    if (error) {
      setSaveStatus('error');
    } else {
      setSaveStatus('saved');
      await fetchSuites();
      setTimeout(() => { closeForm(); }, 1000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta suite? Esta acción no se puede deshacer.')) return;
    await supabase.from('suites').delete().eq('id', id);
    await fetchSuites();
  };

  const addImage = () => {
    if (!imageInput.trim() || !editingSuite) return;
    setEditingSuite({ ...editingSuite, images: [...(editingSuite.images ?? []), imageInput.trim()] });
    setImageInput('');
  };

  const removeImage = (idx: number) => {
    if (!editingSuite) return;
    const imgs = [...(editingSuite.images ?? [])];
    imgs.splice(idx, 1);
    setEditingSuite({ ...editingSuite, images: imgs });
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    if (!editingSuite) return;
    const imgs = [...(editingSuite.images ?? [])];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= imgs.length) return;
    [imgs[idx], imgs[newIdx]] = [imgs[newIdx], imgs[idx]];
    setEditingSuite({ ...editingSuite, images: imgs });
  };

  const persistOrder = async (reordered: Suite[]) => {
    const updates = reordered.map((s, i) => ({ id: s.id, display_order: i }));
    for (const u of updates) {
      await supabase.from('suites').update({ display_order: u.display_order }).eq('id', u.id);
    }
  };

  const moveSuite = async (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= suites.length) return;
    const reordered = [...suites];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    setSuites(reordered);
    await persistOrder(reordered);
  };

  const onDragStart = (idx: number) => {
    dragItem.current = idx;
    setDraggingIdx(idx);
  };

  const onDragEnter = (idx: number) => {
    dragOverItem.current = idx;
    setDragOverIdx(idx);
  };

  const onDragEnd = async () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    setDraggingIdx(null);
    setDragOverIdx(null);
    dragItem.current = null;
    dragOverItem.current = null;
    if (from === null || to === null || from === to) return;
    const reordered = [...suites];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setSuites(reordered);
    await persistOrder(reordered);
  };

  if (loading) return <div className="text-white/40 text-sm">Cargando...</div>;

  return (
    <div>
      <PageHeader title="Apartamentos y Residencias" description="Gestiona el encabezado y los apartamentos listados en la landing." />

      <SuitesHeaderEditor />

      <button
        onClick={openNew}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#6b7c5c] hover:bg-[#5a6a4c] text-white text-sm mb-6 transition-colors"
      >
        <Plus size={16} /> Nueva Suite
      </button>

      <div className="space-y-1">
        {suites.map((suite, idx) => (
          <div
            key={suite.id}
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragEnter={() => onDragEnter(idx)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={[
              'flex items-center justify-between bg-[#1a1a1a] border px-4 py-3 transition-all select-none',
              draggingIdx === idx ? 'opacity-40 border-[#6b7c5c]' : 'border-white/10',
              dragOverIdx === idx && draggingIdx !== idx ? 'border-t-2 border-t-[#6b7c5c]' : '',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-0.5 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors">
                <GripVertical size={16} />
              </div>

              {suite.images?.[0] ? (
                <img src={suite.images[0]} alt={suite.name} className="w-12 h-9 object-cover bg-[#0f0f0f] flex-shrink-0" />
              ) : (
                <div className="w-12 h-9 bg-[#0f0f0f] border border-white/10 flex-shrink-0" />
              )}

              <div>
                <p className="text-sm text-white font-medium">{suite.name}</p>
                <p className="text-xs text-white/40">{suite.type} · {suite.area_sqm}m²</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex flex-col mr-1">
                <button
                  onClick={() => moveSuite(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  title="Subir"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => moveSuite(idx, 1)}
                  disabled={idx === suites.length - 1}
                  className="p-1 text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  title="Bajar"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              <button
                onClick={() => openEdit(suite)}
                className="p-2 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(suite.id)}
                className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingSuite && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-2xl p-8 relative">
            <button onClick={closeForm} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-white mb-6">{isNew ? 'Nueva Suite' : 'Editar Suite'}</h2>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Nombre">
                  <Input value={editingSuite.name ?? ''} onChange={(e) => setEditingSuite({ ...editingSuite, name: e.target.value })} placeholder="Suite Terraza" />
                </FormField>
                <FormField label="Tipo">
                  <Input value={editingSuite.type ?? ''} onChange={(e) => setEditingSuite({ ...editingSuite, type: e.target.value })} placeholder="Terrace Suite" />
                </FormField>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField label="Alcobas">
                  <Input type="number" min={1} value={editingSuite.bedrooms ?? 1} onChange={(e) => setEditingSuite({ ...editingSuite, bedrooms: +e.target.value })} />
                </FormField>
                <FormField label="Baños">
                  <Input type="number" min={1} value={editingSuite.bathrooms ?? 1} onChange={(e) => setEditingSuite({ ...editingSuite, bathrooms: +e.target.value })} />
                </FormField>
                <FormField label="Huéspedes">
                  <Input type="number" min={1} value={editingSuite.guests ?? 1} onChange={(e) => setEditingSuite({ ...editingSuite, guests: +e.target.value })} />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Área Interior (m²)">
                  <Input type="number" min={0} value={editingSuite.area_sqm ?? 0} onChange={(e) => setEditingSuite({ ...editingSuite, area_sqm: +e.target.value })} />
                </FormField>
                <FormField label="Terraza (m²)" hint="Dejar vacío si no tiene">
                  <Input type="number" min={0} value={editingSuite.terrace_sqm ?? ''} onChange={(e) => setEditingSuite({ ...editingSuite, terrace_sqm: e.target.value ? +e.target.value : null })} placeholder="Opcional" />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Precio por Noche (COP)">
                  <Input type="number" min={0} value={editingSuite.day_price ?? 0} onChange={(e) => setEditingSuite({ ...editingSuite, day_price: +e.target.value })} />
                </FormField>
                <FormField label="Precio Mensual (COP)">
                  <Input type="number" min={0} value={editingSuite.month_price ?? 0} onChange={(e) => setEditingSuite({ ...editingSuite, month_price: +e.target.value })} />
                </FormField>
              </div>

              <FormField label="Descripción">
                <Textarea value={editingSuite.description ?? ''} onChange={(e) => setEditingSuite({ ...editingSuite, description: e.target.value })} rows={3} />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="URL Tour 3D">
                  <Input value={editingSuite.tour_3d_url ?? ''} onChange={(e) => setEditingSuite({ ...editingSuite, tour_3d_url: e.target.value })} placeholder="https://..." />
                </FormField>
                <FormField label="URL Video">
                  <Input value={editingSuite.video_url ?? ''} onChange={(e) => setEditingSuite({ ...editingSuite, video_url: e.target.value })} placeholder="https://..." />
                </FormField>
              </div>

              <div>
                <p className="text-xs tracking-widest text-white/50 uppercase mb-2">Imágenes</p>
                <div className="space-y-2 mb-3">
                  {(editingSuite.images ?? []).map((img, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#0f0f0f] border border-white/10 px-3 py-2">
                      <img src={img} alt="" className="w-10 h-8 object-cover bg-[#0f0f0f] flex-shrink-0" />
                      <span className="flex-1 text-xs text-white/50 truncate">{img}</span>
                      <button onClick={() => moveImage(idx, -1)} className="text-white/30 hover:text-white"><ChevronUp size={14} /></button>
                      <button onClick={() => moveImage(idx, 1)} className="text-white/30 hover:text-white"><ChevronDown size={14} /></button>
                      <button onClick={() => removeImage(idx)} className="text-white/30 hover:text-red-400"><X size={14} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#0f0f0f] border border-white/10 hover:border-[#6b7c5c] text-white/60 hover:text-white text-xs transition-colors disabled:opacity-40"
                  >
                    <Upload size={13} />
                    {uploading ? 'Subiendo...' : 'Subir foto'}
                  </button>
                  <button
                    type="button"
                    onClick={openPicker}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#0f0f0f] border border-white/10 hover:border-[#6b7c5c] text-white/60 hover:text-white text-xs transition-colors"
                  >
                    <Images size={13} />
                    Elegir de galería
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addImage()}
                    placeholder="o pega una URL directamente..."
                    className="flex-1 px-3 py-2 bg-[#0f0f0f] border border-white/10 text-white text-sm focus:border-[#6b7c5c] focus:outline-none"
                  />
                  <button onClick={addImage} className="px-4 py-2 bg-[#6b7c5c] hover:bg-[#5a6a4c] text-white text-sm transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button onClick={closeForm} className="text-sm text-white/40 hover:text-white transition-colors">Cancelar</button>
                <SaveButton status={saveStatus} onClick={handleSave} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showPicker && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-3xl p-6 relative">
            <button onClick={() => setShowPicker(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-sm font-bold text-white mb-4 tracking-widest uppercase">Elegir imagen de galería</h2>
            {galleryImages.length === 0 ? (
              <p className="text-white/40 text-sm py-10 text-center">No hay imágenes en la galería. Ve a <strong>Galería</strong> para subir fotos primero.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {galleryImages.map((img) => {
                  const alreadyAdded = (editingSuite?.images ?? []).includes(img.url);
                  return (
                    <button
                      key={img.name}
                      onClick={() => pickImage(img.url)}
                      disabled={alreadyAdded}
                      className="group relative aspect-video overflow-hidden border border-white/10 hover:border-[#6b7c5c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                      {alreadyAdded && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white/60">Ya agregada</div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
