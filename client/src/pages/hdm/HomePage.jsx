import Hero from '../../components/hdm/Hero';
import Features from '../../components/hdm/Features';
import ServicesSection from '../../components/hdm/ServicesSection';
import AppsSection from '../../components/hdm/AppsSection';
import ProjectsSection from '../../components/hdm/ProjectsSection';
import Gallery from '../../components/hdm/Gallery';

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="max-w-6xl mx-auto px-4">
        <Features />
        <ServicesSection />
        <AppsSection />
        <ProjectsSection />
        <Gallery />
      </div>
    </>
  );
}