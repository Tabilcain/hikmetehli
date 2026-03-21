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
const MuasirSozler = lazy(() => import("./pages/MuasirSozler"));
const MuasirKisiDetay = lazy(() => import("./pages/MuasirKisiDetay"));
const SelefIncileri = lazy(() => import("./pages/SelefIncileri"));
const SelefImamDetay = lazy(() => import("./pages/SelefImamDetay"));
const SahabedenSozler = lazy(() => import("./pages/SahabedenSozler"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
    },
    mutations: {
      retry: 0,
    },
  },
});
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
          <Route
            path="/muasir"
            element={(
              <Suspense fallback={RouteFallback}>
                <MuasirSozler />
              </Suspense>
            )}
          />
          <Route
            path="/muasir/kisi/:personId"
            element={(
              <Suspense fallback={RouteFallback}>
                <MuasirKisiDetay />
              </Suspense>
            )}
          />
          <Route
            path="/selef-incileri"
            element={(
              <Suspense fallback={RouteFallback}>
                <SelefIncileri />
              </Suspense>
            )}
          />
          <Route
            path="/selef-incileri/imam/:imamId"
            element={(
              <Suspense fallback={RouteFallback}>
                <SelefImamDetay />
              </Suspense>
            )}
          />
          <Route
            path="/sahabeden"
            element={(
              <Suspense fallback={RouteFallback}>
                <SahabedenSozler />
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
