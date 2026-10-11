import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import hdmApi from '../api/hdm';

const HdmContext = createContext(null);

export function HdmProvider({ children }) {
  const [company, setCompany] = useState(null);
  const [services, setServices] = useState([]);
  const [apps, setApps] = useState([]);
  const [projects, setProjects] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [ai, setAi] = useState({ enabled: false });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, s, a, p, ph, aiCfg] = await Promise.all([
      hdmApi.getCompany().catch(() => null),
      hdmApi.getServices().catch(() => []),
      hdmApi.getApps().catch(() => []),
      hdmApi.getProjects().catch(() => []),
      hdmApi.getPhotos().catch(() => []),
      hdmApi.getAiConfig().catch(() => ({ enabled: false })),
    ]);
    setCompany(c);
    setServices(Array.isArray(s) ? s : []);
    setApps(Array.isArray(a) ? a : []);
    setProjects(Array.isArray(p) ? p : []);
    setPhotos(Array.isArray(ph) ? ph : []);
    setAi(aiCfg || { enabled: false });
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <HdmContext.Provider
      value={{ company, services, apps, projects, photos, ai, loading, refresh: load }}
    >
      {children}
    </HdmContext.Provider>
  );
}

export function useHdm() {
  const ctx = useContext(HdmContext);
  if (!ctx) throw new Error('useHdm must be used within HdmProvider');
  return ctx;
}