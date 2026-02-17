import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="relative py-16"
    >
      <div className="geometric-divider mb-12" />

      <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Hikmet Ehli</p>
          <p className="text-lg font-display">İlimle yol alan bir topluluk.</p>
        </div>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>© {new Date().getFullYear()}</span>
          <span className="w-10 h-px bg-border" />
          <span>Her hakkı saklıdır</span>
        </div>
      </div>
    </motion.footer>
  );
};
