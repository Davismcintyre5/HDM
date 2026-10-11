import { createContext, useContext, useEffect, useState } from 'react';
import smartgenApi from '../api/smartgen';

const SmartGenContext = createContext(null);

export function SmartGenProvider({ children }) {
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    smartgenApi
      .getSite()
      .then((data) => setSite(data))
      .catch(() => setSite(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SmartGenContext.Provider value={{ site, loading }}>
      {children}
    </SmartGenContext.Provider>
  );
}

export function useSmartGen() {
  const ctx = useContext(SmartGenContext);
  if (!ctx) throw new Error('useSmartGen must be used within SmartGenProvider');
  return ctx;
}