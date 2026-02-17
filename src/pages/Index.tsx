import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { SocialLinks } from "@/components/SocialLinks";
import { Footer } from "@/components/Footer";
import { GradientMesh } from "@/components/GradientMesh";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { PageTransition } from "@/components/PageTransition";
import { HourlyContentSection } from "@/components/HourlyContentSection";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const shouldOpenHourly =
      location.pathname === "/hourly" ||
      searchParams.get("open") === "hourly" ||
      location.hash === "#saatlik-ilham";

    if (!shouldOpenHourly) return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById("saatlik-ilham")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname, location.search]);

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background overflow-hidden">
        <GradientMesh />
        <DarkModeToggle />

        <Hero />

        <HourlyContentSection />

        <SocialLinks />

        <Footer />
      </main>
    </PageTransition>
  );
};

export default Index;
