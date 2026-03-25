import { Check, Loader2, Save } from 'lucide-react';

type Status = 'idle' | 'saving' | 'saved' | 'error';

interface SaveButtonProps {
  status: Status;
  onClick: () => void;
  errorMessage?: string;
}

export function SaveButton({ status, onClick, errorMessage }: SaveButtonProps) {
  return (
    <div className="flex items-center gap-4">
      {status === 'error' && errorMessage && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}
      <button
        onClick={onClick}
        disabled={status === 'saving'}
        className="flex items-center gap-2 px-6 py-3 bg-[#6b7c5c] hover:bg-[#5a6a4c] text-white text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
      >
        {status === 'saving' && <Loader2 size={16} className="animate-spin" />}
        {status === 'saved' && <Check size={16} />}
        {(status === 'idle' || status === 'error') && <Save size={16} />}
        {status === 'saving' ? 'Guardando...' : status === 'saved' ? 'Guardado' : 'Guardar Cambios'}
      </button>
    </div>
  );
}
