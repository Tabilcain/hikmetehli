import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

const iosSteps = [
  "Safari’den Paylaş ➡️ Ana Ekrana Ekle",
  "Onayla ve ana ekrana sabitle.",
  "Hikmet Ehli’ni mobil uygulama gibi kullan.",
];

const androidSteps = [
  "Chrome’dan sağ üst köşedeki üç nokta (⋮) ➡️ Ana Ekrana Ekle",
  "Onayla ve ana ekrana sabitle.",
  "Hikmet Ehli’ni mobil uygulama gibi kullan.",
];

export const InstallGuide = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full text-xs uppercase tracking-[0.16em]"
          data-install-guide-trigger
        >
          <Smartphone className="h-4 w-4" />
          Kurulum Kılavuzu
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Mobil Uygulama Gibi Kullanım</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="ios" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/60">
            <TabsTrigger value="ios">iOS</TabsTrigger>
            <TabsTrigger value="android">Android</TabsTrigger>
          </TabsList>

          <TabsContent value="ios" className="space-y-4">
            <p className="text-sm text-muted-foreground">Safari kullanıcıları için hızlı kurulum</p>
            <ol className="space-y-2 text-sm">
              {iosSteps.map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </TabsContent>

          <TabsContent value="android" className="space-y-4">
            <p className="text-sm text-muted-foreground">Chrome kullanıcıları için hızlı kurulum</p>
            <ol className="space-y-2 text-sm">
              {androidSteps.map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
