import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PageHeader } from '../components/PageHeader';
import { FormField, Input, Textarea } from '../components/FormField';
import { SaveButton } from '../components/SaveButton';
import { ImageUploadField } from '../components/ImageUploadField';
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface Artist {
  id: string;
  name: string;
  bio: string | null;
  origin: string | null;
  display_order: number;
}

interface Artwork {
  id: string;
  artist_id: string;
  title: string;
  year: number | null;
  medium: string | null;
  image_url: string;
  display_order: number;
}

const emptyArtist = (): Partial<Artist> => ({ name: '', bio: '', origin: '', display_order: 0 });
const emptyArtwork = (artistId: string): Partial<Artwork> => ({
  artist_id: artistId,
  title: '',
  year: undefined,
  medium: '',
  image_url: '',
  display_order: 0,
});

function ArtworkRow({ artwork, onEdit, onDelete, onMove, total }: {
  artwork: Artwork;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  total: number;
}) {
  return (
    <div className="flex items-center gap-3 bg-[#111111] border border-white/8 px-4 py-3">
      <div className="w-12 h-9 shrink-0 overflow-hidden bg-[#0f0f0f]">
        {artwork.image_url ? (
          <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-white/5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/80 truncate">{artwork.title}</p>
        <p className="text-xs text-white/30 truncate">{artwork.medium}{artwork.year ? ` · ${artwork.year}` : ''}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onMove(-1)} disabled={artwork.display_order === 0} className="p-1.5 text-white/25 hover:text-white/60 disabled:opacity-20 transition-colors">
          <ChevronUp size={13} />
        </button>
        <button onClick={() => onMove(1)} disabled={artwork.display_order >= total - 1} className="p-1.5 text-white/25 hover:text-white/60 disabled:opacity-20 transition-colors">
          <ChevronDown size={13} />
        </button>
        <button onClick={onEdit} className="p-1.5 text-white/30 hover:text-white hover:bg-white/10 transition-colors ml-1">
          <Pencil size={13} />
        </button>
        <button onClick={onDelete} className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function ArtworkModal({ artwork, isNew, artistId, onClose, onSaved }: {
  artwork: Partial<Artwork>;
  isNew: boolean;
  artistId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Artwork>>(artwork);
  const [status, setStatus] = useState<SaveStatus>('idle');

  const handleSave = async () => {
    if (!form.title || !form.image_url) return;
    setStatus('saving');
    const payload = {
      artist_id: artistId,
      title: form.title,
      year: form.year || null,
      medium: form.medium || null,
      image_url: form.image_url,
      display_order: form.display_order ?? 0,
    };
    let error;
    if (isNew) {
      ({ error } = await supabase.from('artworks').insert(payload));
    } else {
      ({ error } = await supabase.from('artworks').update(payload).eq('id', form.id!));
    }
    if (error) {
      setStatus('error');
    } else {
      setStatus('saved');
      onSaved();
      setTimeout(onClose, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white"><X size={18} /></button>
        <h3 className="text-base font-semibold text-white mb-6">{isNew ? 'Nueva Obra' : 'Editar Obra'}</h3>
        <div className="space-y-5">
          <ImageUploadField
            label="Imagen de la Obra"
            value={form.image_url ?? ''}
            onChange={(url) => setForm({ ...form, image_url: url })}
            aspectRatio="aspect-[3/4]"
          />
          <FormField label="Título">
            <Input value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nombre de la obra" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Año">
              <Input type="number" min={1900} max={2100} value={form.year ?? ''} onChange={(e) => setForm({ ...form, year: e.target.value ? +e.target.value : undefined })} placeholder="2024" />
            </FormField>
            <FormField label="Orden">
              <Input type="number" min={0} value={form.display_order ?? 0} onChange={(e) => setForm({ ...form, display_order: +e.target.value })} />
            </FormField>
          </div>
          <FormField label="Técnica / Medio">
            <Input value={form.medium ?? ''} onChange={(e) => setForm({ ...form, medium: e.target.value })} placeholder="Óleo sobre lienzo" />
          </FormField>
          <div className="flex items-center justify-between pt-2">
            <button onClick={onClose} className="text-sm text-white/40 hover:text-white transition-colors">Cancelar</button>
            <SaveButton status={status} onClick={handleSave} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtistPanel({ artist, onEdit, onDelete, isExpanded, onToggle }: {
  artist: Artist;
  onEdit: () => void;
  onDelete: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loadingArtworks, setLoadingArtworks] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Partial<Artwork> | null>(null);
  const [artworkIsNew, setArtworkIsNew] = useState(false);

  const fetchArtworks = async () => {
    setLoadingArtworks(true);
    const { data } = await supabase.from('artworks').select('*').eq('artist_id', artist.id).order('display_order');
    setArtworks(data ?? []);
    setLoadingArtworks(false);
  };

  useEffect(() => {
    if (isExpanded) fetchArtworks();
  }, [isExpanded]);

  const handleDeleteArtwork = async (id: string) => {
    if (!confirm('¿Eliminar esta obra?')) return;
    await supabase.from('artworks').delete().eq('id', id);
    await fetchArtworks();
  };

  const handleMoveArtwork = async (artwork: Artwork, dir: -1 | 1) => {
    const siblings = [...artworks];
    const idx = siblings.findIndex((a) => a.id === artwork.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= siblings.length) return;
    const swap = siblings[swapIdx];
    await Promise.all([
      supabase.from('artworks').update({ display_order: swap.display_order }).eq('id', artwork.id),
      supabase.from('artworks').update({ display_order: artwork.display_order }).eq('id', swap.id),
    ]);
    await fetchArtworks();
  };

  return (
    <div className="border border-white/10 bg-[#171717]">
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={onToggle} className="flex items-center gap-3 flex-1 text-left">
          <div>
            <p className="text-sm text-white/85 font-medium">{artist.name}</p>
            <p className="text-xs text-white/30">{artist.origin}</p>
          </div>
          <ChevronDown
            size={16}
            className={`text-white/30 transition-transform ml-2 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        <div className="flex items-center gap-1.5 ml-4">
          <button onClick={onEdit} className="p-2 text-white/30 hover:text-white hover:bg-white/10 transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={onDelete} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-white/8 px-5 py-4 space-y-2">
          {loadingArtworks ? (
            <p className="text-xs text-white/30 py-2">Cargando obras...</p>
          ) : artworks.length === 0 ? (
            <p className="text-xs text-white/25 py-2">Este artista no tiene obras aún.</p>
          ) : (
            artworks.map((aw) => (
              <ArtworkRow
                key={aw.id}
                artwork={aw}
                total={artworks.length}
                onEdit={() => { setEditingArtwork({ ...aw }); setArtworkIsNew(false); }}
                onDelete={() => handleDeleteArtwork(aw.id)}
                onMove={(dir) => handleMoveArtwork(aw, dir)}
              />
            ))
          )}
          <button
            onClick={() => { setEditingArtwork(emptyArtwork(artist.id)); setArtworkIsNew(true); }}
            className="flex items-center gap-1.5 mt-3 text-xs text-white/35 hover:text-white transition-colors"
          >
            <Plus size={13} /> Agregar obra
          </button>
        </div>
      )}

      {editingArtwork && (
        <ArtworkModal
          artwork={editingArtwork}
          isNew={artworkIsNew}
          artistId={artist.id}
          onClose={() => setEditingArtwork(null)}
          onSaved={fetchArtworks}
        />
      )}
    </div>
  );
}

export function ArtGalleryManager() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArtist, setEditingArtist] = useState<Partial<Artist> | null>(null);
  const [artistIsNew, setArtistIsNew] = useState(false);
  const [artistStatus, setArtistStatus] = useState<SaveStatus>('idle');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchArtists = async () => {
    const { data } = await supabase.from('artists').select('*').order('display_order');
    setArtists(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchArtists(); }, []);

  const handleSaveArtist = async () => {
    if (!editingArtist?.name) return;
    setArtistStatus('saving');
    const payload = {
      name: editingArtist.name,
      bio: editingArtist.bio || null,
      origin: editingArtist.origin || null,
      display_order: editingArtist.display_order ?? 0,
    };
    let error;
    if (artistIsNew) {
      ({ error } = await supabase.from('artists').insert(payload));
    } else {
      ({ error } = await supabase.from('artists').update(payload).eq('id', editingArtist.id!));
    }
    if (error) {
      setArtistStatus('error');
    } else {
      setArtistStatus('saved');
      await fetchArtists();
      setTimeout(() => { setEditingArtist(null); setArtistStatus('idle'); }, 800);
    }
  };

  const handleDeleteArtist = async (id: string) => {
    if (!confirm('¿Eliminar este artista y todas sus obras? Esta acción no se puede deshacer.')) return;
    await supabase.from('artists').delete().eq('id', id);
    await fetchArtists();
  };

  if (loading) return <div className="text-white/40 text-sm">Cargando...</div>;

  return (
    <div>
      <PageHeader title="Galería de Arte" description="Gestiona los artistas locales y sus colecciones de obras." />

      <button
        onClick={() => { setEditingArtist(emptyArtist()); setArtistIsNew(true); setArtistStatus('idle'); }}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#6b7c5c] hover:bg-[#5a6a4c] text-white text-sm mb-6 transition-colors"
      >
        <Plus size={16} /> Nuevo Artista
      </button>

      <div className="space-y-3">
        {artists.map((artist) => (
          <ArtistPanel
            key={artist.id}
            artist={artist}
            isExpanded={expandedId === artist.id}
            onToggle={() => setExpandedId(expandedId === artist.id ? null : artist.id)}
            onEdit={() => { setEditingArtist({ ...artist }); setArtistIsNew(false); setArtistStatus('idle'); }}
            onDelete={() => handleDeleteArtist(artist.id)}
          />
        ))}
        {artists.length === 0 && (
          <p className="text-white/30 text-sm py-8 text-center border border-dashed border-white/10">
            No hay artistas. Crea el primero.
          </p>
        )}
      </div>

      {editingArtist && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center px-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg p-8 relative">
            <button onClick={() => setEditingArtist(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X size={18} />
            </button>
            <h3 className="text-base font-semibold text-white mb-6">{artistIsNew ? 'Nuevo Artista' : 'Editar Artista'}</h3>
            <div className="space-y-5">
              <FormField label="Nombre del Artista">
                <Input value={editingArtist.name ?? ''} onChange={(e) => setEditingArtist({ ...editingArtist, name: e.target.value })} placeholder="Nombre completo" />
              </FormField>
              <FormField label="Origen / Ciudad">
                <Input value={editingArtist.origin ?? ''} onChange={(e) => setEditingArtist({ ...editingArtist, origin: e.target.value })} placeholder="Bogotá, Colombia" />
              </FormField>
              <FormField label="Biografía">
                <Textarea value={editingArtist.bio ?? ''} onChange={(e) => setEditingArtist({ ...editingArtist, bio: e.target.value })} rows={3} placeholder="Breve descripción del artista..." />
              </FormField>
              <FormField label="Orden de visualización">
                <Input type="number" min={0} value={editingArtist.display_order ?? 0} onChange={(e) => setEditingArtist({ ...editingArtist, display_order: +e.target.value })} />
              </FormField>
              <div className="flex items-center justify-between pt-2">
                <button onClick={() => setEditingArtist(null)} className="text-sm text-white/40 hover:text-white transition-colors">Cancelar</button>
                <SaveButton status={artistStatus} onClick={handleSaveArtist} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
