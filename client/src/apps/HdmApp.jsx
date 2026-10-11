import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/hdm/Layout';
import HomePage from '../pages/hdm/HomePage';
import ServicesPage from '../pages/hdm/ServicesPage';
import AppsPage from '../pages/hdm/AppsPage';
import AppDetailPage from '../pages/hdm/AppDetailPage';
import ProjectsPage from '../pages/hdm/ProjectsPage';
import GalleryPage from '../pages/hdm/GalleryPage';
import ContactPage from '../pages/hdm/ContactPage';
import NotFoundPage from '../pages/hdm/NotFoundPage';

export default function HdmApp() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="apps" element={<AppsPage />} />
        <Route path="apps/:slug" element={<AppDetailPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}