import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, hint, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs tracking-widest text-white/50 uppercase mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-white/30 mt-1.5">{hint}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 text-white text-sm focus:border-[#6b7c5c] focus:outline-none transition-colors placeholder:text-white/20 ${className}`}
    />
  );
}

export function Textarea({ className = '', rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      rows={rows}
      className={`w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 text-white text-sm focus:border-[#6b7c5c] focus:outline-none transition-colors resize-none placeholder:text-white/20 ${className}`}
    />
  );
}
