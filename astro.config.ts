import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightThemeRapide from "starlight-theme-rapide";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://note.jspark.dev",
  integrations: [
    starlight({
      plugins: [starlightThemeRapide()],
      title: "NoTe",
      logo: {
        src: "./src/assets/logo.svg",
        replacesTitle: true,
      },
      customCss: [
        "@fontsource/pretendard/400.css",
        "@fontsource/pretendard/600.css",
        "@fontsource/jetbrains-mono",
        "./src/custom.css",
      ],
      credits: true,
      titleDelimiter: " - ",
      social: {
        github: "https://github.com/jsparkdev/note",
        mastodon: "https://mastodon.social/@jsparkdev",
        "x.com": "https://x.com/jsparkdev",
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
        // {
        //   label: "TypeScript",
        //   autogenerate: { directory: "ts" },
        // },
        // {
        //   label: "React",
        //   autogenerate: { directory: "react" },
        // },
      ],
    }),
    sitemap({
      filter: (page) => !page.includes("/draft/"),
    }),
  ],
});
