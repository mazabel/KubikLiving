import { useState, useEffect } from 'react';
import { useSiteContent } from '../hooks/useSiteContent';
import { PageHeader } from '../components/PageHeader';
import { FormField, Input, Textarea } from '../components/FormField';
import { SaveButton } from '../components/SaveButton';

export function FooterEditor() {
  const { data, loading, saveStatus, errorMessage, save } = useSiteContent('footer');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [copyright, setCopyright] = useState('');

  useEffect(() => {
    if (!data) return;
    setTitle(data.title ?? '');
    setContent(data.content ?? '');
    const j = data.content_json ?? {};
    setEmail(j.email ?? '');
    setPhone(j.phone ?? '');
    setAddress(j.address ?? '');
    setInstagram(j.instagram ?? '');
    setFacebook(j.facebook ?? '');
    setLinkedin(j.linkedin ?? '');
    setCopyright(j.copyright ?? '');
  }, [data]);

  const handleSave = () => {
    save({
      title,
      content,
      content_json: { email, phone, address, instagram, facebook, linkedin, copyright },
    });
  };

  if (loading) return <div className="text-white/40 text-sm">Cargando...</div>;

  return (
    <div>
      <PageHeader title="Footer" description="Edita el pie de página con datos de contacto y redes sociales." />

      <div className="max-w-2xl space-y-6">
        <FormField label="Nombre / Logo Text">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="KubikLiving 8i8" />
        </FormField>

        <FormField label="Descripción">
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={2} />
        </FormField>

        <div className="border-t border-white/10 pt-6">
          <h3 className="text-xs tracking-widest text-white/40 uppercase mb-4">Contacto</h3>
          <div className="space-y-4">
            <FormField label="Email">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@kubikliving.com" />
            </FormField>
            <FormField label="Teléfono">
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+57 1 300 123 4567" />
            </FormField>
            <FormField label="Dirección / Ciudad">
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Bogotá, Colombia" />
            </FormField>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="text-xs tracking-widest text-white/40 uppercase mb-4">Redes Sociales</h3>
          <div className="space-y-4">
            <FormField label="Instagram URL">
              <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
            </FormField>
            <FormField label="Facebook URL">
              <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
            </FormField>
            <FormField label="LinkedIn URL">
              <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/..." />
            </FormField>
          </div>
        </div>

        <FormField label="Texto de Copyright">
          <Input value={copyright} onChange={(e) => setCopyright(e.target.value)} placeholder="© 2024 KubikLiving 8i8. All rights reserved." />
        </FormField>

        <div className="pt-2">
          <SaveButton status={saveStatus} onClick={handleSave} errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}
