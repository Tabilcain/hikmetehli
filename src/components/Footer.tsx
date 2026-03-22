export const Footer = () => {
  return (
    <footer className="relative py-16 footer-reveal">
      <div className="geometric-divider mb-12" />

      <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Hikmet Ehli</p>
        </div>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>© {new Date().getFullYear()}</span>
          <span className="w-10 h-px bg-border" />
          <span>Her hakkı saklıdır</span>
        </div>
      </div>
    </footer>
  );
};
