import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

interface SiteContent {
  id: string;
  key: string;
  title: string | null;
  content: string | null;
  content_json: Record<string, any> | null;
  updated_at: string;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useSiteContent(key: string) {
  const [data, setData] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data: row } = await supabase
        .from('site_content')
        .select('*')
        .eq('key', key)
        .maybeSingle();
      setData(row);
      setLoading(false);
    };
    fetch();
  }, [key]);

  const save = useCallback(async (updates: { title?: string; content?: string; content_json?: Record<string, any> }) => {
    setSaveStatus('saving');
    setErrorMessage('');

    const { error } = await supabase
      .from('site_content')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('key', key);

    if (error) {
      setSaveStatus('error');
      setErrorMessage('Error al guardar. Intenta de nuevo.');
    } else {
      setSaveStatus('saved');
      setData((prev) => prev ? { ...prev, ...updates } : prev);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, [key]);

  return { data, loading, saveStatus, errorMessage, save };
}
