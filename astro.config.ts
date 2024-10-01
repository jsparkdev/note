import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightThemeRapide from "starlight-theme-rapide";

// https://astro.build/config
export default defineConfig({
  site: "https://note-5q8.pages.dev",
  integrations: [
    starlight({
      plugins: [starlightThemeRapide()],
      title: "Note",
      credits: true,
      titleDelimiter: " - ",
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
          label: "JavaScript",
          autogenerate: { directory: "js" },
        },
        {
          label: "TypeScript",
          autogenerate: { directory: "ts" },
        },
        {
          label: "React",
          autogenerate: { directory: "react" },
        },
      ],
    }),
  ],
});
