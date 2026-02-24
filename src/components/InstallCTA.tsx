import { useEffect, useState } from "react";
import { Download, Share2 } from "lucide-react";
import { InstallGuide } from "@/components/InstallGuide";
import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isSafari = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes("safari") && !ua.includes("crios") && !ua.includes("fxios") && !ua.includes("edgios");
};

export const InstallCTA = () => {
  const { lowPerformanceMode } = usePerformanceMode();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const installedHandler = () => setInstalled(true);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && (window.navigator as unknown as { standalone?: boolean }).standalone);
    if (standalone) setInstalled(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const showIosGuide = isIos() && isSafari();

  return (
    <div
      className={cn(
        "rounded-[28px] border border-border/70 p-6 shadow-soft",
        lowPerformanceMode ? "bg-card/95" : "bg-card/80 backdrop-blur-sm",
      )}
    >
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Ana Ekrana Ekle</p>
      <h3 className="mt-4 text-2xl font-display">Saatlik İlhamı bir uygulama gibi kullan.</h3>
      <p className="mt-3 text-sm text-muted-foreground">
        Bildirim beklemeden her saat taze sahih hadis. Ana ekranına ekleyerek tek dokunuşla eriş.
      </p>

      {installed ? (
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Kurulu
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {deferredPrompt && !showIosGuide && (
            <button
              onClick={handleInstall}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-[0.25em] shadow-elevated hover:shadow-glow transition-all"
            >
              <Download className="h-4 w-4" />
              Yükle
            </button>
          )}
          {showIosGuide && (
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <Share2 className="h-4 w-4 text-primary" />
              Paylaş → Ana Ekrana Ekle
            </div>
          )}
          {!deferredPrompt && !showIosGuide && (
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Tarayıcı menüsü → Ana Ekrana Ekle
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <InstallGuide />
      </div>
    </div>
  );
};
