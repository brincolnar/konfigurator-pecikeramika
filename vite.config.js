import { defineConfig } from "vite";

export default defineConfig({
  // Poleg privzetega VITE_ izpostavi še PK_ (Peči Keramika) predpono,
  // da se ključi v .env ne začnejo z VITE_.
  envPrefix: ["VITE_", "PK_"],
});
