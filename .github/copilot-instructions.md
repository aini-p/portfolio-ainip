# Project Guidelines

## Communication

- Default to Japanese for user-facing explanations unless the user asks for another language.

## Project Context

- This repository is a bilingual Astro portfolio site for AiniP. Prefer [GEMINI.md](../GEMINI.md) for the current project overview.
- Treat [README.md](../README.md) as upstream template material, not the source of truth for current app behavior.

## Build And Validation

- Use `npm run dev` for local development.
- Use `npm run check` after code changes that affect Astro, TypeScript, or general formatting.
- Use `npm run stylelint` after CSS or `.astro` style edits.
- Use `npm run build` before finishing larger routing, content, or layout changes.
- If autofixes are appropriate, use `npm run check:fix` and `npm run stylelint:fix`.

## Architecture

- The site has two language trees: Japanese at `/` and English at `/en`.
- `src/middleware.ts` sets `Astro.locals.lang` from the URL prefix. Layout and shared components rely on that value.
- Artwork content lives in the `artworks` collection defined in [src/content/config.ts](../src/content/config.ts), with MDX files under `src/content/artworks/ja/` and `src/content/artworks/en/`.
- Top-level pages and dynamic gallery routes are duplicated per language tree. Follow the existing split under `src/pages/` and `src/pages/en/` instead of introducing a new routing pattern.
- `src/layouts/BaseLayout.astro` and `src/components/header.astro` contain the canonical URL, `hreflang`, and language-switch path logic. Preserve that behavior when editing navigation or SEO tags.

## Conventions

- In page files, keep the existing explicit language constant pattern such as `const lang = "ja"` or `const lang = "en"`. Existing pages filter collection entries by `id.startsWith(`${lang}/`)`.
- When linking artwork detail pages, remove the language prefix from collection slugs before composing the route.
- Keep Japanese and English route counterparts in sync when changing shared page structure or behavior.
- Add or update UI copy in [src/i18n/ui.ts](../src/i18n/ui.ts) rather than hardcoding translated labels in components.
- Use the `~/` import alias defined by TypeScript config for project-local imports.
- For artwork entries, keep image fields compatible with Astro content collection `image()` handling instead of replacing them with plain strings.
- Match the existing formatting setup: Biome uses 2 spaces and LF line endings, and Astro-specific unused import or variable warnings are intentionally relaxed.

## Editing Guidance

- Prefer minimal edits that preserve the current page pair structure and existing URL scheme.
- Reuse established gallery, profile, and artwork-detail patterns from the existing pages before introducing new abstractions.
- If a change touches layout-level SEO or language switching, verify both Japanese and English URLs still resolve correctly.