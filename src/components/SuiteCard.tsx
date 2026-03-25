import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Scan, ImageOff, BedDouble, Bath, LayoutGrid, TreePine } from 'lucide-react';
import { Suite } from '../types';

interface SuiteCardProps {
  suite: Suite;
}

export function SuiteCard({ suite }: SuiteCardProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const hasImages = suite.images && suite.images.length > 0;
  const currentImage = hasImages ? suite.images[currentImageIdx] : null;

  const handlePrevImage = () => {
    setCurrentImageIdx((prev) =>
      prev === 0 ? suite.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIdx((prev) =>
      prev === suite.images.length - 1 ? 0 : prev + 1
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col bg-[#111111] border border-white/8 hover:border-white/16 transition-all duration-500">
      <div className="relative aspect-[4/3] bg-[#0d0d0d] overflow-hidden group">
        {currentImage ? (
          <img
            src={currentImage}
            alt={`${suite.name} - Image ${currentImageIdx + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#0d0d0d]">
            <ImageOff className="w-10 h-10 text-white/20" />
          </div>
        )}

        {suite.terrace_sqm && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#4a5240]/85 backdrop-blur-sm">
            <p className="text-[9px] text-white/90 tracking-[0.2em] uppercase font-light">
              {suite.terrace_sqm} m² Terraza
            </p>
          </div>
        )}

        <div className="absolute top-3 right-3 flex gap-1.5">
          {suite.tour_3d_url && (
            <a
              href={suite.tour_3d_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-colors"
              aria-label="3D Tour"
            >
              <Scan className="w-3.5 h-3.5 text-white/80" />
            </a>
          )}
          {suite.video_url && (
            <button
              onClick={() => setShowVideoModal(true)}
              className="w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-colors"
              aria-label="Ver video"
            >
              <Play className="w-3.5 h-3.5 text-white/80" />
            </button>
          )}
        </div>

        {hasImages && suite.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-6">
        <div className="mb-5">
          <p className="text-[9px] tracking-[0.25em] text-white/35 uppercase font-light mb-2.5">
            {suite.type}
          </p>
          <h3 className="text-xl md:text-2xl font-display font-semibold uppercase text-white/90 mb-3 leading-tight">
            {suite.name}
          </h3>
          <p className="text-xs text-white/45 leading-relaxed line-clamp-2 font-light">
            {suite.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 mb-5">
          <div className="flex items-center gap-2.5">
            <BedDouble className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-white/65 truncate">
                {suite.bedrooms === 1 ? '1 Alcoba' : `${suite.bedrooms} Alcobas`}
              </p>
              <p className="text-[10px] text-white/30 truncate">hasta {suite.guests} huéspedes</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Bath className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-white/65 truncate">
                {suite.bathrooms === 1 ? '1 Baño' : `${suite.bathrooms} Baños`}
              </p>
              <p className="text-[10px] text-white/30 truncate">completos</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-white/65 truncate">{suite.area_sqm} m²</p>
              <p className="text-[10px] text-white/30 truncate">interior</p>
            </div>
          </div>

          {suite.terrace_sqm ? (
            <div className="flex items-center gap-2.5">
              <TreePine className="w-3.5 h-3.5 text-white/30 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-white/65 truncate">{suite.terrace_sqm} m²</p>
                <p className="text-[10px] text-white/30 truncate">terraza privada</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <TreePine className="w-3.5 h-3.5 text-white/15 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-white/25 truncate">Terraza</p>
                <p className="text-[10px] text-white/20 truncate">no incluida</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-5 border-t border-white/8">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-[9px] tracking-[0.2em] text-white/30 uppercase mb-1.5 font-light">
                Por Noche
              </p>
              <p className="font-display font-normal text-white/85 leading-none">
                <span className="text-base">{formatPrice(suite.day_price)}</span>
                <span className="text-[9px] text-white/35 ml-1 font-sans tracking-wide">COP</span>
              </p>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.2em] text-white/30 uppercase mb-1.5 font-light">
                Mensual
              </p>
              <p className="font-display font-normal text-white/85 leading-none">
                <span className="text-base">{formatPrice(suite.month_price)}</span>
                <span className="text-[9px] text-white/35 ml-1 font-sans tracking-wide">COP</span>
              </p>
            </div>
          </div>

          <button className="w-full py-3 bg-[#4a5240] hover:bg-[#5a6350] text-white/90 text-[10px] tracking-[0.25em] uppercase font-sans font-light transition-colors duration-300">
            Reservar esta suite
          </button>
        </div>
      </div>

      {showVideoModal && suite.video_url && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 text-xl"
              aria-label="Close video"
            >
              ×
            </button>
            <iframe
              src={suite.video_url}
              className="w-full h-full"
              allowFullScreen
              title={`${suite.name} video`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
