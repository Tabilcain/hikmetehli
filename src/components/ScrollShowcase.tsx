import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const highlights = [
  {
    tag: "Derinlik",
    title: "Uzun sohbetler, kısa hikmetler.",
    body: "Konuyu derinleştiren uzun sohbetler ve günlük hayatın içinden kısa hikmet notları.",
  },
  {
    tag: "Ritim",
    title: "Görsel akış ve metin uyumu.",
    body: "Tipografi, ritim ve boşluklarla ilerleyen bir anlatım dili. Her karede nefes.",
  },
  {
    tag: "İstikamet",
    title: "Hayata dokunan temalar.",
    body: "İnsanın kalbine seslenen temalar, pratik öneriler ve sakin bir tempo.",
  },
];

export const ScrollShowcase = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lift = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="relative py-24" id="vizyon">
      <div className="container grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-start">
        <motion.div style={{ y: lift }} className="lg:sticky lg:top-24 space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Vizyon</p>
          <h2 className="text-4xl md:text-5xl font-display tracking-tight">
            İlmi estetikle, estetiği hikmetle buluşturuyoruz.
          </h2>
          <p className="text-muted-foreground text-lg">
            Hikmet Ehli, her içerikte sakin, kontrollü ve derinlikli bir görsel dil kurar. Bu dil,
            tıpkı sahnede ilerleyen bir hikaye gibi, kaydırdıkça açılır.
          </p>
          <div className="flex items-center gap-3">
            <span className="w-12 h-px bg-foreground/20" />
            <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Scroll ile anlat
            </span>
          </div>
        </motion.div>

        <div className="space-y-6" id="icerik">
          {highlights.map((item, index) => (
            <motion.div
              key={item.tag}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-[28px] border border-border/80 bg-card/80 backdrop-blur-sm p-8 shadow-soft hover:shadow-elevated transition-all"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span>{item.tag}</span>
                <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-display tracking-tight">{item.title}</h3>
              <p className="mt-4 text-muted-foreground">{item.body}</p>
              <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground transition-colors">
                Detaya In
                <span className="w-8 h-px bg-foreground/20 group-hover:bg-foreground" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
