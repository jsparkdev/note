import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightThemeRapide from "starlight-theme-rapide";

export default defineConfig({
  site: "https://note.jspark.dev",
  prefetch: {
    defaultStrategy: "viewport",
  },
  integrations: [
    starlight({
      plugins: [starlightThemeRapide()],
      title: "NoTe",
      logo: {
        src: "./src/assets/logo.svg",
        replacesTitle: true,
      },
      customCss: ["@fontsource/jetbrains-mono", "./src/custom.css"],
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
      head: [
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            as: "style",
            crossorigin: "anonymous",
            href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
          },
        },
      ],
      sidebar: [
        {
          label: "JavaScript",
          collapsed: true,
          autogenerate: { directory: "js" },
        },
        {
          label: "TypeScript",
          collapsed: true,
          autogenerate: { directory: "ts" },
        },
        {
          label: "React",
          collapsed: true,
          autogenerate: { directory: "react" },
        },
      ],
    }),
    sitemap({
      filter: (page) => !page.includes("/draft/"),
    }),
  ],
});
