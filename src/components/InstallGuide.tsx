import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

const iosSteps = [
  "Safari ile Hikmet Ehli'ni aç.",
  "Paylaş ikonuna dokun.",
  '"Ana Ekrana Ekle" seçeneğini seç.',
];

const androidSteps = [
  "Chrome ile Hikmet Ehli'ni aç.",
  'Menüden "Ana ekrana ekle" veya "Yükle" seç.',
  "Onayla ve ana ekrana sabitle.",
];

const widgetSteps = [
  "Ana ekranda boş alana uzun bas.",
  '"Widget" menüsünü aç.',
  "Hikmet Ehli widgetını ekle.",
];

export const InstallGuide = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full text-xs uppercase tracking-[0.22em]">
          <Smartphone className="h-4 w-4" />
          Kurulum Kılavuzu
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Uygulama ve Widget Kurulumu</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="ios" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/60">
            <TabsTrigger value="ios">iOS</TabsTrigger>
            <TabsTrigger value="android">Android</TabsTrigger>
          </TabsList>

          <TabsContent value="ios" className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Ana ekrana ekleme</p>
              <ol className="mt-3 space-y-2 text-sm">
                {iosSteps.map((step) => (
                  <li key={step} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Widget ekleme</p>
              <ol className="mt-3 space-y-2 text-sm">
                {widgetSteps.map((step) => (
                  <li key={step} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="android" className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Ana ekrana ekleme</p>
              <ol className="mt-3 space-y-2 text-sm">
                {androidSteps.map((step) => (
                  <li key={step} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Widget ekleme</p>
              <ol className="mt-3 space-y-2 text-sm">
                {widgetSteps.map((step) => (
                  <li key={step} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-xs text-muted-foreground">
                Not: Android'de kilit ekranı widget desteği cihaz ve launcher'a göre değişir. Destek yoksa ana ekran widgetı kullanılır.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
