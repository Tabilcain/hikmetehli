import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";

registerSW({ immediate: true });

if (Capacitor.isNativePlatform()) {
  CapApp.addListener("appUrlOpen", ({ url }) => {
    if (!url) return;
    if (url.startsWith("hikmetehli://hourly")) {
      window.history.replaceState({}, "", "/hourly?open=hourly");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
