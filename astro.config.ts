import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightThemeRapide from "starlight-theme-rapide";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      plugins: [starlightThemeRapide()],
      title: "Note",
      credits: true,
      social: {
        github: "https://github.com/jsparkdev/note",
      },
      components: {
        Head: "./src/components/starlight/Head.astro",
      },
      lastUpdated: true,
      locales: {
        root: {
          label: "한국어",
          lang: "ko-KR",
        },
      },
      sidebar: [
        {
          label: "Notes",
          autogenerate: { directory: "notes" },
        },
      ],
    }),
  ],
});
