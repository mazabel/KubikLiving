import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useRouter } from '../lib/router';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export function Login() {
  const { signIn } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            KUBIK<span className="text-[#6b7c5c]">LIVING</span>
          </h1>
          <p className="text-sm text-white/40 tracking-widest uppercase">Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/10 p-8 space-y-5">
          <div>
            <label className="block text-xs tracking-widest text-white/50 uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 text-white text-sm focus:border-[#6b7c5c] focus:outline-none transition-colors"
              placeholder="admin@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest text-white/50 uppercase mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 bg-[#0f0f0f] border border-white/10 text-white text-sm focus:border-[#6b7c5c] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#6b7c5c] hover:bg-[#5a6a4c] text-white text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
          >
            <LogIn size={16} />
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-xs text-white/20 mt-6">
          Acceso restringido al equipo autorizado
        </p>
      </div>
    </div>
  );
}
