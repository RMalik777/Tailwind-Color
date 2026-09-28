# Tailwind Color

[![CodSpeed](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/gh/RMalik777/Tailwind-Color)

Tailwind Color is a website that shows all Tailwind CSS colors from version 0 to version 4. You can compare the colors, make gradients, do a contrast test, and copy the values.

Live site: <https://tailwind.raflimalik.com>

## Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Get started](#get-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Development](#development)
- [Fix a bug](#fix-a-bug)
- [Build and self-host](#build-and-self-host)
- [Fork and customize](#fork-and-customize)
- [License](#license)
- [Built with](#built-with)

## Overview

### Features

The site has these pages:

| Page     | Path        | What it does                                                                   |
| -------- | ----------- | ------------------------------------------------------------------------------ |
| Home     | `/`         | Shows the full palette of one Tailwind CSS version in OKLCH, HEX, HSL, or RGB. |
| Compare  | `/compare`  | Shows two shades side by side. The shades can come from different versions.    |
| Gradient | `/gradient` | Blends two shades. Shows the result of each interpolation mode.                |
| Contrast | `/contrast` | Calculates the contrast of text on a background with WCAG 2 and APCA.          |
| Gallery  | `/gallery`  | Shows all colors of one version in one grid. Click a swatch to copy its value. |
| License  | `/license`  | Shows the projects that this site uses and their licenses.                     |

The site also supplies `/sitemap.xml` for search engines.

Each page keeps its settings in the `localStorage` of the browser. When you open the site again, the pages show your last settings.

### Tech stack

- [SvelteKit 2](https://svelte.dev/docs/kit) and [Svelte 5](https://svelte.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [shadcn-svelte](https://shadcn-svelte.com) and [Bits UI](https://bits-ui.com) for UI components
- [culori](https://culorijs.org) for color conversion
- [apca-w3](https://github.com/Myndex/apca-w3) for APCA contrast
- [runed](https://runed.dev) to keep settings after a page reload
- [Vitest](https://vitest.dev) and [CodSpeed](https://codspeed.io) for benchmarks
- [`@sveltejs/adapter-cloudflare`](https://svelte.dev/docs/kit/adapter-cloudflare) for deployment

### Color data

The color values come from the Tailwind CSS source code. The footer of the site has a link to the source file of each version.

- Version 4 uses OKLCH values.
- Version 0 to version 3 use HEX values.

The app changes each value to OKLCH, HEX, HSL, and RGB.

## Requirements

- [Node.js](https://nodejs.org) 20.19 or a more recent version
- [pnpm](https://pnpm.io) 12 (the version is in the `packageManager` field of `package.json`)
- [Git](https://git-scm.com)

> [!NOTE]
> The app does not use environment variables.

## Get started

1. Clone the repository:

   ```bash
   git clone https://github.com/RMalik777/Tailwind-Color.git
   cd Tailwind-Color
   ```

2. Enable Corepack. Corepack installs the pnpm version that the project uses.

   ```bash
   corepack enable
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open <http://localhost:5173> in your browser.

To open the browser automatically, run `pnpm dev --open`.

## Scripts

| Command            | What it does                                                 |
| ------------------ | ------------------------------------------------------------ |
| `pnpm dev`         | Starts the development server with hot reload.               |
| `pnpm build`       | Makes a production build.                                    |
| `pnpm preview`     | Serves the production build on your computer.                |
| `pnpm check`       | Does a type check of the Svelte and TypeScript files.        |
| `pnpm check:watch` | Does the type check again each time that a file changes.     |
| `pnpm lint`        | Does a check of the format (Prettier) and the code (ESLint). |
| `pnpm format`      | Formats all files with Prettier.                             |
| `pnpm bench`       | Runs the benchmarks in the `benches` folder.                 |

## Project structure

```text
benches/                  Benchmarks for the color and contrast functions
src/
  app.css                 Tailwind CSS theme and global styles
  app.html                HTML template
  lib/
    components/           Navigation bar, footer, and toolbar
      custom/             Color picker, shade picker, version select, copy button
      ui/                 Components from shadcn-svelte
    const/                Navigation links and select options
    data/
      raw-tailwind-color.ts   Color values from the Tailwind CSS source code
      color.ts                Palettes after conversion to all formats
    functions/            Color conversion, contrast, gradient, and color history
    types/                Shared TypeScript types
  routes/                 One folder for each page, plus sitemap.xml
static/                   Favicon
```

## Development

### Add a Tailwind CSS version

1. Add the color values to `src/lib/data/raw-tailwind-color.ts` as a new `RawTailwindColor[]` export.
2. Add the version to the `Version` type in `src/lib/types/color.ts`.
3. Add the new palette to `colorsByVersion` in `src/lib/data/color.ts`.
4. Add the version to `versionOptions` in `src/lib/const/option.ts`.
5. If the new version uses a different default interpolation for gradients, update `defaultInterpolation` in `src/lib/functions/gradient.ts`.

Use `processColorFromOklch` for OKLCH values. Use `processColorFromHex` for HEX values.

### Add a page

1. Make a folder in `src/routes` with a `+page.svelte` file.
2. Add the page to the `link` list in `src/lib/const/nav.ts`.
3. Add the path to the `pages` list in `src/routes/sitemap.xml/+server.ts`.

All pages are prerendered, because `src/routes/+layout.ts` sets `prerender = true`.

### Add a UI component

The files in `src/lib/components/ui` come from shadcn-svelte. To add a component, run this command:

```bash
pnpm dlx shadcn-svelte@latest add <component>
```

The settings for shadcn-svelte are in `components.json`.

### Code style

- Prettier formats the code. The settings are in `.prettierrc`.
- ESLint finds problems in the code. The settings are in `eslint.config.js`.
- Commit messages use [Conventional Commits](https://www.conventionalcommits.org) (for example, `feat:`, `fix:`, `style:`, `ci:`).

### Benchmarks

The `benches` folder has benchmarks for the color and contrast functions. Run them with this command:

```bash
pnpm bench
```

The CodSpeed workflow (`.github/workflows/codspeed.yml`) runs the benchmarks on each push to `main` and on each pull request.

## Fix a bug

1. Fork the repository on GitHub.
2. Clone your fork.
3. Make a new branch:

   ```bash
   git checkout -b fix/short-name
   ```

4. Start the development server with `pnpm dev`.
5. Do the steps that cause the bug.
6. Change the code to remove the bug.
7. If you change a function in `src/lib/functions`, add a test file in the same folder (for example, `color.test.ts`).
8. Run the checks:

   ```bash
   pnpm check
   pnpm lint
   pnpm build
   ```

9. If you change a function that has a benchmark, run `pnpm bench`.
10. Commit your changes.
11. Open a pull request.

Vitest finds the test files with the pattern `src/**/*.{test,spec}.{js,ts}`. To run the tests, use `pnpm exec vitest run`.

> [!TIP]
> The pages keep their settings in `localStorage`. If a bug occurs only with some settings, clear the site data in your browser. Then do the steps again.

## Build and self-host

> [!NOTE]
> All pages are prerendered to static HTML files. Only `/sitemap.xml` runs on the server when a request occurs.

### Cloudflare Pages

The project uses `@sveltejs/adapter-cloudflare`. Thus, you can deploy it to Cloudflare Pages without a change to the code.

To deploy from Git:

1. In the Cloudflare dashboard, make a new Pages project.
2. Connect your repository to the project.
3. Set the build command to `pnpm build`.
4. Set the build output directory to `.svelte-kit/cloudflare`.
5. Deploy the project.

To deploy from your computer:

```bash
pnpm build
pnpm dlx wrangler pages deploy .svelte-kit/cloudflare --project-name <your-project-name>
```

### Other hosts

For a different host, change the adapter to `@sveltejs/adapter-static`.

1. Replace the adapter:

   ```bash
   pnpm remove @sveltejs/adapter-cloudflare
   pnpm add -D @sveltejs/adapter-static
   ```

2. In `svelte.config.js`, change the import:

   ```js
   import adapter from "@sveltejs/adapter-static";
   ```

3. In `src/routes/sitemap.xml/+server.ts`, add this line. The static adapter can only use prerendered routes.

   ```ts
   export const prerender = true;
   ```

4. Build the site:

   ```bash
   pnpm build
   ```

5. Upload the `build` folder to your static host (for example, Netlify, Vercel, GitHub Pages, or an nginx server).

If the site is on a subpath (for example, `https://example.com/tailwind-color`), set `kit.paths.base` in `svelte.config.js`. For more information, refer to the [SvelteKit adapter documentation](https://svelte.dev/docs/kit/adapters).

## Fork and customize

Some values in the code are for the site of the author. Change these values in your fork:

| File                                | Value                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `src/routes/sitemap.xml/+server.ts` | The `site` URL                                                           |
| `src/routes/+layout.svelte`         | The page title, description, `og:url`, `og:site_name`, and `theme-color` |
| `src/routes/+layout.svelte`         | The `onedollarstats` analytics configuration                             |
| `src/lib/components/footer.svelte`  | The links to the author site, the source code, and "Other works"         |
| `static/favicon.png`                | The site icon                                                            |
| `src/app.css`                       | The theme colors and fonts                                               |

The site sends page views to [OneDollarStats](https://onedollarstats.com). To remove the analytics, do these steps:

1. In `src/routes/+layout.svelte`, remove the `onedollarstats` import, the `onMount` import, and the `onMount` block.
2. Remove the package:

   ```bash
   pnpm remove onedollarstats
   ```

## License

This project uses the [MIT License](LICENSE). Tailwind CSS and the other projects that this site uses have their own licenses. The `/license` page of the site shows them.

## Built with

[![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)](https://www.cloudflare.com)
[![pnpm](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)](https://pnpm.io)
