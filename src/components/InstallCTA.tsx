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
  const { lowPerformanceMode, isMobile } = usePerformanceMode();
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
        "rounded-[26px] border border-border/70 p-4 shadow-soft md:rounded-[30px] md:p-6",
        lowPerformanceMode ? "bg-card/95" : "bg-card/80 backdrop-blur-sm",
      )}
      data-install-cta-shell
    >
      <p className="kicker">Ana Ekrana Ekle</p>
      <h3 className="mt-3 text-xl font-display md:text-2xl">Mobil uygulama gibi kullanabilirsiniz.</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
        Hikmet Ehli’ni ana ekrana eklediğinde tek dokunuşla açılır ve mobil uygulama deneyimine yakın bir kullanım sağlar.
      </p>

      {installed ? (
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Kurulu
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          {deferredPrompt && !showIosGuide ? (
            <button
              onClick={handleInstall}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-soft transition-all hover:shadow-glow"
              data-install-cta-action
            >
              <Download className="h-4 w-4" />
              Yükle
            </button>
          ) : null}

          {showIosGuide ? (
            <div className="flex w-full items-start rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-xs font-medium leading-relaxed text-foreground md:w-auto">
              <Share2 className="h-4 w-4 text-primary" />
              <span className="ml-2">Safari’den Paylaş ➡️ Ana Ekrana Ekle</span>
            </div>
          ) : null}

          {!deferredPrompt && !showIosGuide ? (
            <div className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-xs font-medium leading-relaxed text-foreground md:w-auto">
              Chrome’dan sağ üst köşedeki üç nokta (⋮) ➡️ Ana Ekrana Ekle
            </div>
          ) : null}
        </div>
      )}

      <div className={cn("mt-5", isMobile ? "w-full" : "w-auto")}>
        <InstallGuide />
      </div>
    </div>
  );
};
