import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const LibraryIndex = lazy(() => import("./pages/LibraryIndex"));
const LibraryDetail = lazy(() => import("./pages/LibraryDetail"));
const LibraryReader = lazy(() => import("./pages/LibraryReader"));

const queryClient = new QueryClient();
const RouteFallback = (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-sm text-muted-foreground">
    Sayfa yükleniyor...
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hourly" element={<Index />} />
          <Route
            path="/kutuphane"
            element={(
              <Suspense fallback={RouteFallback}>
                <LibraryIndex />
              </Suspense>
            )}
          />
          <Route
            path="/kutuphane/:slug"
            element={(
              <Suspense fallback={RouteFallback}>
                <LibraryDetail />
              </Suspense>
            )}
          />
          <Route
            path="/kutuphane/:slug/oku"
            element={(
              <Suspense fallback={RouteFallback}>
                <LibraryReader />
              </Suspense>
            )}
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
