# The Breakroom — Design Intensity Scale Reference

## Museum Research → Component Design Patterns

This document maps specific 1997 Web Design Museum findings to actionable component designs for each of The Breakroom's four design intensity levels. Each level section includes: visual DNA sourced from real sites, CSS variable layer specifications, component variants, and creation template guidance.

---

## Level 1: Insane / Cursed

**Museum Sources**: Urban Diary (Personal), Don Barnett "BugLight" (Design & Art), Blur "blurspace" (Music)

### Visual DNA

| Pattern | Source | Breakroom Component |
|---------|--------|-------------------|
| Illustrated scene as full page (park at night with lamp, bench, cobblestones) | Don Barnett | SleepNet page backgrounds for weirdness_level 1 sites |
| Navigation as objects in the scene (text scattered through illustration) | Don Barnett | `SleepNetSiteView` nav variant — no structured nav, clickable zones |
| Floating glass spheres with images, no grid | Blur | Component layout mode — scattered absolute positioning |
| "not seeing the entire picture? refresh your eyes..." cryptic instructions | Blur | Empty state / loading copy for Level 1 pages |
| Graph paper backgrounds, polaroid clusters, film strips, collage composition | Urban Diary | Background texture set for personal/creative site types |
| Hand-drawn text mixed with pixel fonts | Urban Diary | Font mixing — `--type-typer` + `--type-pixel` combined |
| Hit counters as decorative elements | Don Barnett | `VisitorCounter` component (already exists, should show at Level 1) |
| Author credit as in-world object (name on a park sign) | Don Barnett | Creator attribution as stamped/filed label |

### CSS Layer: `[data-level="1"]`

```css
[data-level="1"] {
  --bg: #0a0908;                    /* near-black */
  --bg-texture: url('/textures/crumpled-paper.png');
  --text: #c8c6c1;                  /* chrome/silver */
  --text-accent: #33ff66;           /* phosphor green */
  --link: #ff6633;                  /* burnt orange */
  --link-hover: #ffcc00;            /* neon yellow */
  --nav-style: scattered;           /* no grid, absolute positioned */
  --border-style: none;             /* borders are illustration edges */
  --cursed: 1.0;                    /* max scanline/grain intensity */
  --font-body: var(--type-typer);   /* Special Elite */
  --font-heading: var(--type-pixel); /* VT323 */
  --font-nav: var(--type-typer);
  --letter-spacing-nav: 0.15em;     /* Quake II spaced-out style */
  --content-width: 100vw;           /* full bleed, no container */
}
```

### Component Behavior at Level 1

- **Page Layout**: No `.old-shell` containers. Content floats freely. Background is a full illustration or texture.
- **Navigation**: Image maps or scattered clickable text. No navbar. No breadcrumbs.
- **Buttons**: Replaced by in-world objects or hand-lettered text links.
- **Sections**: No visible section dividers. Content bleeds into background.
- **Guestbook**: Appears as graffiti on a wall or notes pinned to a board.
- **Fake Ads**: Bizarre, surreal. Could be fake missing pet posters or alien recruitment flyers.
- **Agent Comments**: Appear as voices in the dark, typed messages on a terminal, or handwritten notes.

### Creation Template Guidance

When a user creates a Level 1 site, the generator should:
- Use full-black or heavily textured backgrounds
- Scatter section content in non-grid layouts
- Generate in-world navigation labels (not "About" but "The Back Room", "What's Behind The Curtain")
- Include at least one hidden element or Easter egg
- Apply maximum cursed overlay intensity

---

## Level 2: Underground / Weird

**Museum Sources**: Fallout (Games), Diablo "Ogden's Tavern" (Games), Quake II (Games), Westwood Studios (Games), MTV Online (Music), Blur tracklist pages (Music)

### Visual DNA

| Pattern | Source | Breakroom Component |
|---------|--------|-------------------|
| Crumpled paper/parchment texture background | Fallout | Background texture for dive bar / underground site types |
| Torn notebook paper strip as navigation sidebar | Fallout | `SleepNetSiteView` nav variant — torn paper strip |
| Full black background + metallic UI elements | Quake II | Dark mode base for all Level 2 pages |
| Industrial metal navigation bar with rivets and pipes | Quake II | `.old-shell` variant — metal/industrial frame |
| Diegetic scene as nav page (tavern interior with NPC) | Diablo | SleepNet page backgrounds — illustrated scene with clickable zones |
| Wooden sign labels in destroyed landscape | Diablo | Navigation labels as in-world signage |
| Neon green on black with colored bullets | Westwood | Color accent system — neon on dark |
| Red text links on black background | Westwood | Link color override for Level 2 dark themes |
| Multi-colored section labels with plaintext descriptions | MTV Online | Portal/directory variant for Level 2 hub pages |
| Spaced-out letterspacing for links | Quake II | `letter-spacing: 0.2em` on nav items |
| "click here to detonate" style CTAs | Westwood | Button copy — aggressive, in-world verbs |
| Numbered tracklist layout with cyan links | Blur | Ordered list component for catalog/archive pages |
| File format labels as aesthetic ("0.32 Mb, .au format") | Blur | Metadata display — show formats, sizes, dates as texture |
| Fire-animated logos | Diablo | CSS animation for Level 2 site titles |
| Gothic/medieval letterforms | Diablo | `--type-paper` (DM Serif Display) at larger sizes |
| "What's New This Week" dated bulletin | Westwood | News/update component — dated entries with red/green accents |

### CSS Layer: `[data-level="2"]`

```css
[data-level="2"] {
  --bg: #0a0908;                    /* near-black */
  --bg-texture: url('/textures/dark-metal.png');
  --text: #c8c6c1;                  /* chrome */
  --text-accent: #33ff66;           /* phosphor green */
  --text-warm: #e8dfc7;             /* nicotine for body text on dark */
  --link: #ff3333;                  /* aggressive red */
  --link-alt: #00cccc;              /* cyan alternative */
  --link-hover: #ffcc00;            /* neon yellow */
  --nav-style: sidebar;             /* left sidebar, sticky */
  --border-style: beveled;          /* 3D beveled edges */
  --border-color: #444;
  --cursed: 0.8;
  --font-body: var(--type-ui);      /* Inter for readability */
  --font-heading: var(--type-paper); /* DM Serif Display */
  --font-nav: var(--type-typer);    /* Special Elite */
  --letter-spacing-nav: 0.12em;
  --content-width: 800px;
  --section-bg: rgba(0,0,0,0.6);   /* semi-transparent panels on texture */
}
```

### Component Behavior at Level 2

- **Page Layout**: Dark background with textured overlay. Content in semi-transparent panels (`.old-shell` with dark variant).
- **Navigation**: Left sidebar with torn-paper or metal-frame aesthetic. Labels use in-world language.
- **Buttons**: Beveled 3D buttons with metallic gradient or torn label aesthetic. Text in Special Elite.
- **Sections**: Dark panels with subtle border glow. Section headers in serif or pixel font.
- **Guestbook**: Dark-themed, neon text entries. Feels like writing on a bathroom stall wall.
- **Fake Ads**: Dark, weird. Could be fake concert flyers, underground zine ads, or conspiracy notices.
- **Agent Comments**: Appear as NPC dialogue (Diablo tavern keeper style) — boxed with character name.
- **Status Strips**: Dark background, colored text. "Filed under: unknown. Status: seen."

### Creation Template Guidance

When a user creates a Level 2 site, the generator should:
- Default to black/very dark backgrounds
- Provide left-sidebar navigation with in-world labels
- Use multi-color accent system (each section gets its own color like MTV)
- Include atmospheric metadata ("Last seen: 3 AM", "Signal: weak")
- Generate beveled/metallic UI elements
- Use aggressive, casual copy ("Click here to enter the basement")
- Enable guestbook by default (dark variant)

---

## Level 3: Old-Web Directory / Local Business

**Museum Sources**: Yahoo (Portal), GeoCities (Portal), AltaVista (Portal), Angelfire (Portal), MapQuest (Portal), Northern Light (Portal)

### Visual DNA

| Pattern | Source | Breakroom Component |
|---------|--------|-------------------|
| Search bar + two-column category directory | Yahoo | SleepNet portal homepage — search + district directory |
| Category links with item counts in parentheses | Yahoo | District/neighborhood link lists: "Pool Hall County (12)" |
| [Xtra!] / [New!] badges on directory items | Yahoo | Badge component — `[NEW]`, `[FILED]`, `[GONE]` stamps |
| Neighborhood concept (Hollywood, SoHo, Athens) | GeoCities | SleepNet neighborhoods/districts — direct mapping |
| "Today's Cool Homestead" featured page | GeoCities | "Site of the Night" SleepNet feature |
| Member count displays ("Join 3.5 million homesteaders") | GeoCities | Community metrics display on portal |
| Guestbook system as core feature | GeoCities | SleepNet guestbooks — already implemented |
| Blue/purple links on white/light gray | Yahoo, all portals | Standard link colors for Level 3 |
| Gray background (#c0c0c0) with white content areas | AltaVista, portals | Panel backgrounds |
| 1px solid borders, no rounded corners | All portals | `.old-shell` border style |
| Table-based layouts with cell padding | All portals | Grid/flex layouts mimicking table structure |
| Small font sizes (10-12px) for density | Yahoo, portals | Compact text settings |
| Horizontal rule dividers (`<hr>`) | All portals | Section dividers in Level 3 pages |
| "Advanced Search" and "Search Options" links | AltaVista, Northern Light | SleepNet search refinement UI |
| Partner/sponsor bar at top | Yahoo, portals | OmniShift sponsorship strip |
| "Cool links" / "What's New" sidebar | Portals | SleepNet sidebar widgets |

### CSS Layer: `[data-level="3"]`

```css
[data-level="3"] {
  --bg: #f6f3ec;                    /* bleached — warm white */
  --bg-alt: #e8dfc7;               /* nicotine — panel backgrounds */
  --text: #14110e;                  /* ink */
  --text-muted: #666;
  --link: #0000ee;                  /* classic blue */
  --link-visited: #551a8b;         /* classic purple */
  --link-hover-bg: #f5c518;        /* yellow highlight */
  --nav-style: top-bar;            /* horizontal nav bar */
  --border-style: solid;           /* 1px solid borders */
  --border-color: #999;
  --cursed: 0.4;                   /* light scanlines */
  --font-body: var(--type-ui);     /* Inter */
  --font-heading: var(--type-paper); /* DM Serif Display */
  --font-nav: var(--type-ui);
  --font-size-body: 13px;         /* compact, dense text */
  --content-width: 760px;         /* classic 800px-era width */
  --section-bg: #fff;
  --section-border: 1px solid #ccc;
}
```

### Component Behavior at Level 3

This is the **current default** — most of The Breakroom already renders at this level. The `.old-shell`, `.old-header`, `.old-body`, `.old-button` system is Level 3.

- **Page Layout**: Centered content container. White/cream panels on warm background. Dense text.
- **Navigation**: Horizontal top bar or left sidebar with plain text links. Blue underlined links.
- **Buttons**: `.old-button` — bordered, text-based, no gradients. Clear label + icon.
- **Sections**: `.old-shell` with `.old-header` + `.old-body`. 1px borders. Square corners.
- **Guestbook**: Classic form + entry list. Blue links, timestamps, simple layout.
- **Fake Ads**: Banner-style, clearly labeled "AD" or "SPONSORED". Parody of 90s banner ads.
- **Agent Comments**: Plain text blocks with agent name in bold. Feels like a forum post.
- **Status Strips**: Horizontal bar with gray background, small text, pipe-separated items.
- **Directory Listings**: Two-column or three-column link lists with counts and badges.
- **Search**: Text input + button. "Search SleepNet" with optional "Advanced" link.

### Creation Template Guidance

When a user creates a Level 3 site, the generator should:
- Use light backgrounds (cream/white)
- Provide clean `.old-shell` containers for all sections
- Use standard blue links with yellow hover
- Include directory-style navigation with counts
- Add `[NEW]` or `[FILED]` badges where appropriate
- Keep copy informational but slightly off ("Hours: Whenever the door is open")
- Enable all standard features (guestbook, ads, more-like-this)

---

## Level 4: Polished Corporate / OmniShift

**Museum Sources**: Pixar (Corporate), NASA (Corporate/Technology)

### Visual DNA

| Pattern | Source | Breakroom Component |
|---------|--------|-------------------|
| Clean white background with generous whitespace | Pixar | OmniShift portal/memo backgrounds |
| Centered layout with letterhead-style header | Pixar | OmniShift memo/announcement layout |
| Serif fonts for headings, sans-serif for body | Pixar | `--type-paper` headers + `--type-ui` body |
| Red accent color (one strong brand color) | Pixar | `--beer-red` as OmniShift brand accent |
| Dense corporate text pages — long paragraphs | Pixar | OmniShift internal memos, policy docs |
| Metallic image tile grid with descriptions | NASA | OmniShift department/division directory |
| Bulleted link directories with metadata | NASA | OmniShift resource listings |
| "What's New" sections with dates and descriptions | NASA | OmniShift announcements |
| Small red navigation text | Pixar | OmniShift nav in corporate red |
| Footer with copyright and legal links | Pixar | OmniShift footer — "OmniShift Holdings LLC. All rights reserved." |
| Professional photography/renders as hero images | Both | OmniShift hero banners — stock-photo-parody |

### CSS Layer: `[data-level="4"]`

```css
[data-level="4"] {
  --bg: #ffffff;                    /* pure white */
  --bg-alt: #f8f8f8;              /* barely-gray panels */
  --text: #333333;                 /* dark gray, not black */
  --text-muted: #888;
  --link: #c61f1f;                 /* beer-red — corporate brand */
  --link-visited: #8b1a1a;
  --link-hover: #c61f1f;
  --link-hover-bg: transparent;    /* no yellow highlight */
  --nav-style: minimal;            /* small text, top-right */
  --border-style: thin;            /* hairline borders */
  --border-color: #e0e0e0;
  --cursed: 0;                     /* NO scanlines, no grain */
  --font-body: var(--type-ui);     /* Inter */
  --font-heading: var(--type-paper); /* DM Serif Display — letterhead */
  --font-nav: var(--type-ui);
  --font-size-body: 15px;         /* comfortable reading size */
  --content-width: 680px;         /* narrow, elegant column */
  --section-bg: transparent;
  --section-border: none;
  --letter-spacing-heading: 0.02em;
}
```

### Component Behavior at Level 4

- **Page Layout**: Clean, centered, narrow column. Maximum whitespace. No visual noise.
- **Navigation**: Small text in corporate red, top of page. Minimal. Could be just a logo + 3 links.
- **Buttons**: Clean text buttons with thin borders or underlines. No bevels, no textures.
- **Sections**: No visible containers — just headings and text with generous spacing.
- **Headers**: Serif letterhead style. "OMNISHIFT INTERNAL MEMO" or "FROM THE OFFICE OF..."
- **Red Stamps**: Official-looking stamps: `APPROVED`, `CLASSIFIED`, `INTERNAL USE ONLY`.
- **Footer**: Corporate legal text. Small. Gray. "2003 OmniShift Holdings. All rights enumerated."
- **No Guestbook**: Level 4 pages don't have guestbooks. Too corporate.
- **No Fake Ads**: Replaced by "OmniShift Partner" notices or internal memos.
- **Agent Comments**: Appear as "From the desk of [Agent Name]" memos.

### Creation Template Guidance

Level 4 is primarily for OmniShift system pages, not user-created content. However, if a user creates a "faux_company" type at high polish:
- Use white background, no textures
- Apply serif headers with generous spacing
- Use red as the only accent color
- Keep copy corporate-deadpan ("This department has been reviewed. Findings are pending.")
- Disable guestbook by default
- Apply no cursed overlays

---

## Implementation Architecture

### 1. Data Model: `design_level` Field

Add `design_level` (1-4, default 3) to `SleepNetSite` type alongside existing `weirdness_level`:

```typescript
export type SleepNetSite = {
  // ... existing fields ...
  design_level: 1 | 2 | 3 | 4;  // drives visual treatment
  weirdness_level?: number;       // drives content weirdness (keep separate)
};
```

**Mapping heuristic** for existing/generated sites:
- `site_type === 'cursed_personal_page'` → Level 1
- `site_type === 'underground_zine' || site_type === 'paranormal_report'` → Level 2
- `site_type === 'faux_company' || site_type === 'local_business'` → Level 3
- OmniShift system pages → Level 4

### 2. CSS Architecture: Layered Custom Properties

The `[data-level]` attribute on `<body>` or the site view container drives all visual changes through CSS custom property overrides. No JavaScript needed for the visual layer.

```html
<!-- BaseLayout.astro or SleepNetSiteView.astro -->
<body data-section="sleepnet" data-level="2">
```

The CSS cascade:
1. `:root` — base palette (current)
2. `[data-section]` — section-specific overrides (current)
3. `[data-level]` — design intensity overrides (NEW)
4. Component-specific styles — use the cascaded variables

### 3. Component Variants

Each component reads `--nav-style`, `--border-style`, `--cursed`, etc. from the cascade and adapts:

```css
/* .old-shell adapts to level */
.old-shell {
  background: var(--section-bg, #fff);
  border: var(--section-border, 1px solid #ccc);
}

[data-level="1"] .old-shell {
  background: transparent;
  border: none;
}

[data-level="2"] .old-shell {
  background: rgba(0,0,0,0.6);
  border: 2px solid #333;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
}

[data-level="4"] .old-shell {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-color);
}
```

### 4. Generator Updates

`sleepnetGenerators.ts` should map site types to design levels and feed level-appropriate content:

```typescript
function getDesignLevel(siteType: string): 1 | 2 | 3 | 4 {
  switch (siteType) {
    case 'cursed_personal_page': return 1;
    case 'underground_zine':
    case 'paranormal_report': return 2;
    case 'faux_company':
    case 'local_business':
    default: return 3;
  }
}
```

### 5. Creation UI

The SleepNet page editor and Pocket "Make One Thing" should expose the design scale:

- **SleepNet Create**: Dropdown or slider for "Design Intensity" with preview thumbnails showing each level's visual character
- **Pocket Make**: Template selection includes level-tagged options ("Weird Personal Page [Level 1]", "Underground Zine [Level 2]")
- **Auto-assignment**: When AI generates a site, it picks the level based on the content description

### 6. Descent UX

As users navigate deeper into SleepNet (portal → district → site → hidden page), the visual level should naturally descend:

- Portal homepage: Level 3 (Yahoo directory clean)
- District pages: Level 3 with hints of Level 2
- Individual sites: Level dictated by `design_level` field
- Hidden doors / deep pages: Level 1-2 (always weird)

This creates the "descent" feeling — you start in the clean directory and end up somewhere strange.

---

## Texture & Asset Requirements

### Background Textures Needed

| Level | Texture | Reference |
|-------|---------|-----------|
| 1 | Crumpled brown paper | Fallout homepage |
| 1 | Graph paper / notebook | Urban Diary |
| 1 | Dark illustrated scene (generic) | Don Barnett |
| 2 | Dark metal / industrial | Quake II |
| 2 | Lightning cracks on gray | Westwood Studios |
| 2 | Circuit board / digital mesh | MTV Online |
| 2 | Torn notebook paper strip | Fallout nav |
| 3 | Light linen / subtle paper | Current default |
| 4 | None (pure white) | Pixar |

### Font Usage By Level

| Level | Headings | Body | Nav | Accent |
|-------|----------|------|-----|--------|
| 1 | VT323 (pixel) | Special Elite (typewriter) | Special Elite | VT323 |
| 2 | DM Serif Display | Inter | Special Elite | JetBrains Mono |
| 3 | DM Serif Display | Inter | Inter | JetBrains Mono |
| 4 | DM Serif Display | Inter | Inter | Inter |

### Color Palettes By Level

| Level | Background | Text | Links | Accent 1 | Accent 2 |
|-------|-----------|------|-------|----------|----------|
| 1 | #0a0908 (ash) | #c8c6c1 (chrome) | #ff6633 | #33ff66 (phosphor) | #ffcc00 |
| 2 | #0a0908 (ash) | #e8dfc7 (nicotine) | #ff3333 | #33ff66 (phosphor) | #00cccc |
| 3 | #f6f3ec (bleached) | #14110e (ink) | #0000ee (hyperlink) | #f5c518 (warning) | #c61f1f (beer-red) |
| 4 | #ffffff | #333333 | #c61f1f (beer-red) | #c61f1f | #888888 |

---

## Agent Style Awareness

When world-building agents create pages or content, they should be instructed to:

1. **Know the scale**: Reference this document's level descriptions
2. **Match copy to level**: Level 1 copy is cryptic/broken. Level 4 copy is corporate-deadpan.
3. **Match structure to level**: Level 1 has no structure. Level 4 is all structure.
4. **Generate level-appropriate metadata**: Level 1 timestamps say "sometime". Level 4 timestamps say "2003-11-14T09:00:00Z".
5. **Pick navigation labels by level**: Level 1: "???". Level 2: "The Vault". Level 3: "About". Level 4: "Corporate Overview".

---

## Priority Implementation Order

1. **CSS custom property layers** for `[data-level]` — pure CSS, no breaking changes
2. **`design_level` field** on SleepNetSite type + migration
3. **Generator mapping** — site types → design levels
4. **SleepNetSiteView** reads `design_level` and sets `data-level` attribute
5. **Component variants** — `.old-shell`, buttons, guestbook, ads adapt to level
6. **Background textures** — create/source the texture assets
7. **Creation UI** — expose level selection in SleepNet editor + Pocket Make
8. **Agent instructions** — update agent prompts with level-aware style guidance
9. **Descent UX** — portal → district → site level transitions
10. **Hidden doors** — always force Level 1-2 for discovered content
