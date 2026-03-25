import { useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X } from 'lucide-react';

const BUCKET = 'suite-images';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  aspectRatio?: string;
}

export function ImageUploadField({ label, value, onChange, hint, aspectRatio = 'aspect-video' }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (!error) {
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      onChange(urlData.publicUrl);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs tracking-widest text-white/50 uppercase">{label}</p>
        {hint && <p className="text-xs text-white/25 font-light">{hint}</p>}
      </div>

      {value ? (
        <div className="relative group">
          <div className={`${aspectRatio} w-full overflow-hidden bg-[#0f0f0f] border border-white/10`}>
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#6b7c5c] hover:bg-[#5a6a4c] text-white text-xs transition-colors disabled:opacity-50"
            >
              <Upload size={13} />
              {uploading ? 'Subiendo...' : 'Cambiar'}
            </button>
            <button
              onClick={() => onChange('')}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500/80 hover:bg-red-500 text-white text-xs transition-colors"
            >
              <X size={13} />
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-2 border border-dashed border-white/15 hover:border-[#6b7c5c] bg-[#0f0f0f] hover:bg-[#0f0f0f] text-white/30 hover:text-white/60 transition-colors py-8 disabled:opacity-50"
          >
            <Upload size={20} />
            <span className="text-xs">{uploading ? 'Subiendo...' : 'Haz clic para subir imagen'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
