import { Search } from "lucide-react";

type LibrarySearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export const LibrarySearch = ({ value, onChange }: LibrarySearchProps) => {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Kitap adında ara"
        aria-label="Kitap adında ara"
        className="h-12 w-full rounded-full border border-border/70 bg-card/80 pl-12 pr-4 text-sm text-foreground shadow-soft outline-none transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
};
