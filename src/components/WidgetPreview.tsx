import { motion } from "framer-motion";
import { BookOpenText, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

type WidgetPreviewProps = {
  verseText: string;
  verseRef: string;
  hadithText: string;
  hadithSource: string;
};

export const WidgetPreview = ({ verseText, verseRef, hadithText, hadithSource }: WidgetPreviewProps) => {
  const { lowPerformanceMode } = usePerformanceMode();
  const now = new Date();
  const dateLabel = now.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" });
  const timeLabel = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={cn(
        "rounded-[28px] border border-border/70 p-6 shadow-soft",
        lowPerformanceMode ? "bg-card/95" : "bg-card/80 backdrop-blur-sm",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Widget Önizleme</p>
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">iOS + Android</span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/20 bg-black/40 text-white p-4 shadow-soft overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_55%)]" />
          <div className="relative">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/70">Lock Screen</p>
            <p className="mt-2 text-xs text-white/80">{dateLabel}</p>
            <p className="font-display text-6xl leading-none mt-2">{timeLabel}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="inline-flex items-center gap-1 font-semibold"><BookOpenText className="h-3 w-3" /> Ayet</p>
                <p className="mt-1 text-white/75 max-h-10 overflow-hidden">{verseText}</p>
              </div>
              <div>
                <p className="inline-flex items-center gap-1 font-semibold"><ScrollText className="h-3 w-3" /> Hadis</p>
                <p className="mt-1 text-white/75 max-h-10 overflow-hidden">{hadithText}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-border/70 bg-background/60 p-4 shadow-soft"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Home Medium</p>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Ayet</p>
              <p className="text-sm text-foreground/90 max-h-10 overflow-hidden">{verseText}</p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground mt-1">{verseRef}</p>
            </div>
            <div className="h-px bg-border/70" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Hadis</p>
              <p className="text-sm text-foreground/90 max-h-10 overflow-hidden">{hadithText}</p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground mt-1">{hadithSource}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Önizleme referansı lock-screen hissine göre hazırlandı. Native widget tarafında aynı görsel dil uygulanacak.
      </p>
    </div>
  );
};
