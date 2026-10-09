# Ninja Destiny Wiki — Dojo test

An independent Ninja Destiny wiki with a moonlit shinobi-village theme, hand-inked green fabric scrolls, animated unrolling, smoke when closing, and ambient mist. Works on phones and desktop. No framework dependencies.

The supplied `freesound_community-headband-tighten-96568.mp3` is used for opening and closing scrolls, with a persistent Sound on/off button. It is served as `public/scroll-sound.mp3`. Sound starts from user interaction; browser autoplay rules may suppress it when loading a deep link directly.

The two published scrolls are the verified Chunin Exams guide and Shinobi Fishing Macro v4 for Windows. Unverified starter sections were removed until accurate in-game details are available.

## Theme toggle

The prominent moon button in the header switches between the regular blue shinobi theme and a red-and-black Akatsuki night theme. The selected theme is stored in the browser as `ninja-theme` and restored on return visits by `theme-boot.js` before CSS loads.

Each theme has its own looping soundtrack: blue plays `naruto funk by altac0untb0y.mp3`, while Akatsuki night plays `public/Naruto_Shippuden_OST_-_Akatsuki_Theme_2_(mp3.pm).mp3`. Switching modes switches the current music player track while retaining its volume setting and controls. As usual, playback depends on browser autoplay rules. No image asset is required for the red/black scene.

## Background music (Shinobi Radio)

The floating player displays **naruto funk by altac0untb0y**, loops the uploaded track, and starts at **12% volume** on first visit. Visitors can pause, mute, scrub, or change volume. Because browsers block unprompted audio, playback may begin after the first user interaction instead of immediately.

The uploaded audio is stored at `public/naruto funk by altac0untb0y.mp3` and served at `/naruto%20funk%20by%20altac0untb0y.mp3` after deployment.

## Cloudflare Pages

Create a **Pages** project, connect this repository, and use:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Leave blank |
| Node version | 20 or newer |

Pages does not require a deploy command. If the dashboard requires one, you are in the Workers flow; switch to Pages → Import an existing Git repository.

You can test on the generated `pages.dev` address before connecting a domain. For `ninja.riix.fun`, add it under this Pages project's **Custom domains**. If `riix.fun` is in your Cloudflare account, Cloudflare can create the DNS record for that subdomain. Use the project's Custom domains flow rather than only adding a DNS record. Keep the existing root-domain configuration intact.

## Local checks and build

```sh
npm run check
npm run build
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. The site needs HTTP so JavaScript modules load; don't double-click `index.html`.

## Edit content

`content.js` contains each scroll's title, preview, category, and article HTML. Keep article HTML authored locally; it is not a user-input rendering path. Add a scroll to that array, then update the all-scrolls count in `index.html`.

`styles.css` controls the dojo, responsive layout, unrolling, and smoke. `app.js` handles search, filtering, dialogs, deep links, and motion preferences. The original macro is in `public/downloads/Shinobi_Fishing_Macro_v4.zip` and is served at `/downloads/Shinobi_Fishing_Macro_v4.zip`.

## Test checklist

- Open and close every scroll; try the close button, “Seal the scroll,” Escape, and the backdrop.
- Try search and the category filters on a phone.
- Open `/#chunin-exams` directly and use browser Back.
- Download the macro ZIP.
- Toggle Effects off; also test the device's reduced motion setting.

This test build requests no search-engine indexing through `index.html` and `public/robots.txt`. When ready to launch publicly, remove the `noindex,nofollow` meta tag, allow crawling in robots.txt, and add a sitemap for the final domain.

Community wiki; not affiliated with MilkTea Party or Roblox. Game claims come from the supplied game description and the author's in-game Chunin Exams notes. No invented stats, codes, or tier rankings.
