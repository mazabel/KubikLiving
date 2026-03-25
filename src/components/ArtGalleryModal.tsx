import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  artist: string;
  year?: number;
  medium?: string;
}

const FALLBACK_ITEMS: GalleryItem[] = [
  { id: '1', imageUrl: 'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'Neblina de Octubre', artist: 'Camila Restrepo', year: 2023, medium: 'Óleo sobre lienzo' },
  { id: '2', imageUrl: 'https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'La Candelaria 6am', artist: 'Sebastián Mora', year: 2022, medium: 'Fotografía analógica' },
  { id: '3', imageUrl: 'https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'Manta del Páramo', artist: 'Valentina Cruz', year: 2023, medium: 'Tejido en telar' },
  { id: '4', imageUrl: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'Raíces Expuestas', artist: 'Camila Restrepo', year: 2022, medium: 'Acuarela y tinta' },
  { id: '5', imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'Ventana al Patio', artist: 'Sebastián Mora', year: 2023, medium: 'Fotografía digital' },
  { id: '6', imageUrl: 'https://images.pexels.com/photos/1629351/pexels-photo-1629351.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'Geometría del Río', artist: 'Valentina Cruz', year: 2022, medium: 'Bordado sobre lino' },
  { id: '7', imageUrl: 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'Palimpsesto Urbano', artist: 'Camila Restrepo', year: 2024, medium: 'Técnica mixta' },
];

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const tall = index % 5 === 0 || index % 5 === 3;

  return (
    <div
      className={`relative overflow-hidden group cursor-pointer ${tall ? 'row-span-2' : 'row-span-1'}`}
      style={{ aspectRatio: tall ? undefined : '3/4' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover transition-all duration-700"
        style={{
          filter: hovered ? 'none' : 'grayscale(1)',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-400"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)',
          opacity: hovered ? 1 : 0.6,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300"
        style={{ transform: hovered ? 'translateY(0)' : 'translateY(6px)', opacity: hovered ? 1 : 0.7 }}
      >
        <p className="text-white text-sm font-light leading-snug">{item.title}</p>
        <p className="text-white/50 text-xs mt-0.5 font-light">{item.artist}{item.year ? ` · ${item.year}` : ''}</p>
        {item.medium && (
          <p className="text-white/30 text-[10px] mt-0.5 font-light tracking-wide uppercase">{item.medium}</p>
        )}
      </div>
    </div>
  );
}

interface ArtGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArtGalleryModal({ isOpen, onClose }: ArtGalleryModalProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeArtist, setActiveArtist] = useState<Artist | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [{ data: artistData }, { data: artworkData }] = await Promise.all([
          supabase.from('artists').select('*').order('display_order'),
          supabase.from('artworks').select('*').order('display_order'),
        ]);

        if (artistData && artworkData && artistData.length > 0) {
          setArtists(artistData);
          setActiveArtist(artistData[0]);
          const mapped: GalleryItem[] = (artworkData as Artwork[]).map((aw) => {
            const artist = (artistData as Artist[]).find((a) => a.id === aw.artist_id);
            return {
              id: aw.id,
              imageUrl: aw.image_url,
              title: aw.title,
              artist: artist?.name ?? '',
              year: aw.year ?? undefined,
              medium: aw.medium ?? undefined,
            };
          });
          setItems(mapped);
        } else {
          setItems(FALLBACK_ITEMS);
        }
      } catch {
        setItems(FALLBACK_ITEMS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0e0e0e]">
      <div className="flex items-center justify-between px-6 md:px-12 h-20 border-b border-white/5 flex-shrink-0">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-light">Arte & Comunidad</p>
          <h2 className="text-lg font-display font-normal uppercase text-white/90 leading-none mt-1">
            Colecciones de artistas locales
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-white/30 text-white/50 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white/5 animate-pulse"
                  style={{ aspectRatio: '3/4', animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 auto-rows-fr">
              {items.map((item, i) => (
                <GalleryCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}

          {artists.length > 0 && (
            <div className="mt-16 pt-12 border-t border-white/[0.08]">
              <div className="flex gap-6 mb-8 overflow-x-auto pb-2">
                {artists.map((artist) => (
                  <button
                    key={artist.id}
                    onClick={() => setActiveArtist(artist)}
                    className="shrink-0 text-left transition-all duration-300"
                  >
                    <p
                      className="text-xs font-light tracking-wide transition-colors duration-300"
                      style={{ color: activeArtist?.id === artist.id ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)' }}
                    >
                      {artist.name}
                    </p>
                    <div
                      className="mt-1 h-px transition-all duration-300"
                      style={{
                        width: activeArtist?.id === artist.id ? '100%' : '0%',
                        background: 'rgba(255,255,255,0.4)',
                      }}
                    />
                  </button>
                ))}
              </div>

              {activeArtist && (
                <div className="grid md:grid-cols-2 gap-8 max-w-2xl">
                  <div>
                    <p className="text-[9px] tracking-[0.25em] text-white/25 uppercase font-light mb-1">Artista</p>
                    <p className="font-display font-normal text-white/85 text-lg">{activeArtist.name}</p>
                    {activeArtist.origin && (
                      <p className="text-xs text-white/35 font-light mt-0.5">{activeArtist.origin}</p>
                    )}
                  </div>
                  {activeArtist.bio && (
                    <div>
                      <p className="text-xs text-white/40 font-light leading-relaxed">{activeArtist.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
