import { useState, useEffect } from 'react';
import { Calendar, Users, Mail, Phone, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BookingContent {
  section_label: string;
  title: string;
  description: string;
}

const defaults: BookingContent = {
  section_label: 'Reserva',
  title: 'Book Your Stay',
  description: 'Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.',
};

export function Booking() {
  const [c, setC] = useState<BookingContent>(defaults);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    suiteType: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    supabase.from('site_content').select('*').eq('key', 'booking').maybeSingle().then(({ data }) => {
      if (!data) return;
      const j = (data.content_json ?? {}) as Record<string, string>;
      setC({
        section_label: j.section_label ?? defaults.section_label,
        title: j.title ?? data.title ?? defaults.title,
        description: j.description ?? data.content ?? defaults.description,
      });
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="booking" className="py-24 md:py-32 bg-dark">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest text-muted-green/80 uppercase font-sans font-normal mb-4">
            {c.section_label}
          </p>
          <h2 className="heading-lg text-white-cream mb-4">{c.title}</h2>
          <p className="text-editorial text-white-cream/70">{c.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white-cream p-8 md:p-12 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-xs tracking-wide text-warm-gray/80 uppercase mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-warm-gray/20 bg-white focus:border-olive focus:outline-none transition-colors font-sans text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs tracking-wide text-warm-gray/80 uppercase mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray/40" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-warm-gray/20 bg-white focus:border-olive focus:outline-none transition-colors font-sans text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-xs tracking-wide text-warm-gray/80 uppercase mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray/40" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-warm-gray/20 bg-white focus:border-olive focus:outline-none transition-colors font-sans text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="guests" className="block text-xs tracking-wide text-warm-gray/80 uppercase mb-2">
                Huéspedes
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray/40" />
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-warm-gray/20 bg-white focus:border-olive focus:outline-none transition-colors font-sans text-sm appearance-none"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Huésped' : 'Huéspedes'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="checkIn" className="block text-xs tracking-wide text-warm-gray/80 uppercase mb-2">
                Check-In *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray/40" />
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-warm-gray/20 bg-white focus:border-olive focus:outline-none transition-colors font-sans text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="checkOut" className="block text-xs tracking-wide text-warm-gray/80 uppercase mb-2">
                Check-Out *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray/40" />
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-warm-gray/20 bg-white focus:border-olive focus:outline-none transition-colors font-sans text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="suiteType" className="block text-xs tracking-wide text-warm-gray/80 uppercase mb-2">
              Tipo de Suite *
            </label>
            <select
              id="suiteType"
              name="suiteType"
              value={formData.suiteType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-warm-gray/20 bg-white focus:border-olive focus:outline-none transition-colors font-sans text-sm"
            >
              <option value="">Selecciona una opción</option>
              <option value="terrace">Terrace Suite</option>
              <option value="superior">Superior Residence</option>
              <option value="superior-terrace">Superior + Terrace</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs tracking-wide text-warm-gray/80 uppercase mb-2">
              Mensaje
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-warm-gray/40" />
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-warm-gray/20 bg-white focus:border-olive focus:outline-none transition-colors font-sans text-sm resize-none"
                placeholder="Cuéntanos sobre tu estadía..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary bg-olive hover:bg-olive/90 py-4"
            disabled={submitted}
          >
            {submitted ? 'Enviado ✓' : 'Enviar Solicitud'}
          </button>

          {submitted && (
            <div className="text-center text-sm text-olive">
              Gracias por tu interés. Te contactaremos pronto.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
