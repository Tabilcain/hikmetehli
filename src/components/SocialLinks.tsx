import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/link-button";
import { MagneticButton } from "@/components/MagneticButton";
import { MessageCircle, Send, Twitter, Youtube } from "lucide-react";

const links = [
  {
    id: "whatsapp",
    label: "WhatsApp Kanalı",
    href: "https://whatsapp.com/channel/0029Vb6RFpe9mrGmDygqcf3d",
    icon: MessageCircle,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@HikmetEhlidir",
    icon: Youtube,
  },
  {
    id: "telegram",
    label: "Telegram Kanalı",
    href: "https://t.me/hikmetehli",
    icon: Send,
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    href: "https://x.com/rekaket",
    icon: Twitter,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const SocialLinks = () => {
  return (
    <section className="relative py-20" id="baglan">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
          <div className="space-y-6 max-w-xl">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Bağlan
            </p>
            <h2 className="text-4xl md:text-5xl font-display tracking-tight">
              Farklı Mecralar, Ortak Tefekkür
            </h2>
            <p className="text-muted-foreground text-lg">
              Günlük notlarını ve kısa hikmet videolarını her platformda
              aynı görsel dil ve sakin akışla paylaşıyor.
            </p>
            <div className="flex items-center gap-3">
              <span className="w-12 h-px bg-foreground/20" />
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Güncel kal
              </span>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="w-full max-w-xl space-y-4"
          >
            {links.map((link) => (
              <motion.div key={link.id} variants={itemVariants}>
                <MagneticButton strength={0.18}>
                  <LinkButton
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    label={link.label}
                    description="Takip et ve bildirim al"
                    icon={<link.icon className="w-5 h-5" />}
                  />
                </MagneticButton>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
