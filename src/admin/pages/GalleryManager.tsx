import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { PageHeader } from '../components/PageHeader';
import { Upload, Trash2, Copy, Check, ImageOff, ExternalLink } from 'lucide-react';

interface StorageImage {
  name: string;
  url: string;
  created_at: string;
}

const BUCKET = 'suite-images';

export function GalleryManager() {
  const [images, setImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list('', {
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    } else {
      const items = (data ?? []).filter((f) => f.name !== '.emptyFolderPlaceholder');
      const withUrls: StorageImage[] = items.map((file) => {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(file.name);
        return {
          name: file.name,
          url: urlData.publicUrl,
          created_at: file.created_at ?? '',
        };
      });
      setImages(withUrls);
    }
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      await supabase.storage.from(BUCKET).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploading(false);
    await fetchImages();
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (name: string) => {
    await supabase.storage.from(BUCKET).remove([name]);
    setDeleteConfirm(null);
    await fetchImages();
  };

  return (
    <div>
      <PageHeader
        title="Galería de Imágenes"
        description="Sube y gestiona las fotos que usarás en las suites y secciones."
      />

      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6b7c5c] hover:bg-[#5a6a4c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm transition-colors"
        >
          <Upload size={16} />
          {uploading ? 'Subiendo...' : 'Subir Imágenes'}
        </button>
        <p className="text-xs text-white/30 mt-2">
          Puedes seleccionar varias imágenes a la vez. Formatos: JPG, PNG, WebP.
        </p>
      </div>

      {loading ? (
        <div className="text-white/40 text-sm">Cargando imágenes...</div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 text-white/30">
          <ImageOff size={40} className="mb-3" />
          <p className="text-sm">No hay imágenes aún. Sube la primera.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.name} className="group relative bg-[#1a1a1a] border border-white/10 overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleCopy(img.url)}
                  title="Copiar URL"
                  className="p-2 bg-white/10 hover:bg-[#6b7c5c] text-white transition-colors"
                >
                  {copiedUrl === img.url ? <Check size={15} /> : <Copy size={15} />}
                </button>
                <a
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ver original"
                  className="p-2 bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ExternalLink size={15} />
                </a>
                {deleteConfirm === img.name ? (
                  <button
                    onClick={() => handleDelete(img.name)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white text-xs transition-colors"
                  >
                    Confirmar
                  </button>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(img.name)}
                    title="Eliminar"
                    className="p-2 bg-white/10 hover:bg-red-500/80 text-white transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div className="px-2 py-1.5 border-t border-white/10">
                <p className="text-xs text-white/30 truncate">{img.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-[#1a1a1a] border border-white/10 text-xs text-white/40 space-y-1">
        <p className="text-white/60 font-medium text-xs tracking-widest uppercase mb-2">Cómo usar</p>
        <p>1. Sube una imagen con el botón de arriba.</p>
        <p>2. Pasa el cursor sobre la imagen y haz clic en <strong className="text-white/60">Copiar URL</strong>.</p>
        <p>3. Ve a <strong className="text-white/60">Suites</strong>, edita la suite y pega la URL en el campo de imágenes.</p>
      </div>
    </div>
  );
}
