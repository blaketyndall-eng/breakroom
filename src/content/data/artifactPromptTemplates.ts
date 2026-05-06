/**
 * Artifact Prompt Templates (PR 51)
 *
 * Static recipe library for generating controlled visual prompts.
 * Each template defines what inputs are needed, style rules to enforce,
 * and hard-no constraints to prevent off-brand output.
 */

export type ArtifactType =
  | 'faction_card'
  | 'fake_ad'
  | 'printable_flyer'
  | 'sleepnet_badge'
  | 'regular_file_badge'
  | 'event_poster'
  | 'turf_mark'
  | 'product_concept'
  | 'guestbook_sticker';

export type ArtifactPromptTemplate = {
  slug: string;
  type: ArtifactType;
  title: string;
  description: string;
  basePrompt: string;
  requiredInputs: string[];
  optionalInputs?: string[];
  styleRules: string[];
  hardNos: string[];
  outputNotes: string[];
  metadata?: Record<string, unknown>;
};

// --- Shared Breakroom visual guardrails ---

export const BREAKROOM_STYLE_RULES: string[] = [
  'lo-fi old-web Americana',
  'fake corporate decay',
  '2003 web artifact aesthetic',
  'dive bar / pool hall / motel-lot atmosphere',
  'dirty fluorescent light',
  'scanned paper texture',
  'bad printer artifacts',
  'receipt grain',
  'low-res evidence image',
  'not polished',
  'not clean ecommerce',
];

export const BREAKROOM_HARD_NOS: string[] = [
  'no corporate SaaS design',
  'no generic cyberpunk',
  'no smooth plastic 3D',
  'no occult/satanic imagery',
  'no fake Supreme clone',
  'no polished streetwear mockup',
  'no modern adtech polish',
  'no stock photo look',
  'no clean ecommerce product shot',
  'no AI slop / generic diffusion look',
];

// --- Templates ---

export const ARTIFACT_PROMPT_TEMPLATES: ArtifactPromptTemplate[] = [
  {
    slug: 'faction-card',
    type: 'faction_card',
    title: 'Faction Card',
    description: 'A trading card for a Breakroom faction. Feels found in a bar drawer.',
    basePrompt: 'Create a faction card for {{factionName}}, {{factionDescription}}. The card should look like a scanned 2003 web trading card crossed with a pool tournament roster badge. Use {{factionColors}} color palette, {{factionSymbols}}, bad printer texture, a small visitor-counter-style number, and a crude diagram or emblem. Include the subclass "{{subclass}}" and the object "{{object}}." Make it feel like something found in a bar drawer, not a polished streetwear graphic.',
    requiredInputs: ['factionName', 'factionDescription', 'factionColors', 'factionSymbols'],
    optionalInputs: ['subclass', 'object'],
    styleRules: [
      'scanned trading card texture',
      'pool tournament roster badge layout',
      'visitor-counter-style number',
      'crude diagram or emblem',
      'bar-drawer patina',
    ],
    hardNos: ['no clean card game art', 'no anime style', 'no polished TCG look'],
    outputNotes: ['Ideal size: 750x1050px or 2.5x3.5in at 300dpi', 'Should look printable on cheap paper'],
  },
  {
    slug: 'fake-ad-banner',
    type: 'fake_ad',
    title: 'Fake Ad Banner',
    description: 'An ugly old-web banner ad for a parody product inside SleepNet.',
    basePrompt: 'Create a fake old-web banner ad for "{{adTitle}}," a parody product inside SleepNet. {{adDescription}}. The ad should feel like MAD Magazine meets a 2003 gas station coupon banner. Use ugly gradients, bad compression, cheap red/yellow sale language, a low-res image placeholder, and copy that implies the product is absurd or broken. Keep it funny but deadpan.',
    requiredInputs: ['adTitle', 'adDescription'],
    optionalInputs: ['adCopy', 'relatedFaction'],
    styleRules: [
      'ugly gradients',
      'bad JPEG compression artifacts',
      'cheap red/yellow sale language',
      'low-res placeholder images',
      'animated GIF energy (even if static)',
      '468x60 or 728x90 banner dimensions',
    ],
    hardNos: ['no modern display ad polish', 'no programmatic ad look'],
    outputNotes: ['Classic banner ad dimensions', 'Should look like it was served by a dead ad network'],
  },
  {
    slug: 'printable-flyer',
    type: 'printable_flyer',
    title: 'Printable Flyer',
    description: 'A one-page flyer meant to be photocopied and posted on a bar bulletin board.',
    basePrompt: 'Create a printable one-page flyer for "{{flyerTitle}}." {{flyerDescription}}. The flyer should look like something photocopied at a gas station and stapled to a telephone pole or bar bulletin board. Use bold blocky text, torn-paper edges, a bad clip-art placeholder, phone number tear-off tabs at the bottom, and one-color or two-color printing feel. The language should be deadpan and slightly off.',
    requiredInputs: ['flyerTitle', 'flyerDescription'],
    optionalInputs: ['phoneNumber', 'location', 'dateLabel'],
    styleRules: [
      'photocopied texture',
      'bold blocky text',
      'torn-paper edges',
      'phone number tear-off tabs',
      'one or two-color printing feel',
      'bad clip-art placeholder',
    ],
    hardNos: ['no Canva template look', 'no full-color glossy printing'],
    outputNotes: ['8.5x11 or A4 portrait', 'Should be printable in black and white'],
  },
  {
    slug: 'sleepnet-badge',
    type: 'sleepnet_badge',
    title: 'SleepNet Badge',
    description: 'A small badge/stamp for a SleepNet page. Like a geocities award.',
    basePrompt: 'Create a small web badge for the SleepNet page "{{pageTitle}}" ({{pageType}}). The badge should look like a 2003 GeoCities award icon or a "Best Viewed In Netscape" button. Use {{neighborhood}} visual cues, pixelated edges, a tiny counter or date, and a short phrase like "{{badgeText}}." Size: 88x31 or 150x50.',
    requiredInputs: ['pageTitle', 'pageType', 'neighborhood'],
    optionalInputs: ['badgeText', 'canonStatus'],
    styleRules: [
      'GeoCities award icon style',
      '88x31 or 150x50 pixel badge',
      'pixelated edges',
      'tiny counter or date',
      'web 1.0 button energy',
    ],
    hardNos: ['no modern badge/shield design', 'no SVG vector clean look'],
    outputNotes: ['88x31px classic or 150x50px wide format', 'GIF-era aesthetic'],
  },
  {
    slug: 'regular-file-badge',
    type: 'regular_file_badge',
    title: 'Regular File Badge',
    description: 'A personal identity badge for a Regular File. Employee-card-meets-MySpace-flair.',
    basePrompt: 'Create a personal badge for "{{handle}}" — a Regular File in The Breakroom. The badge should look like a corrupted employee ID card crossed with MySpace profile flair. Use {{theme}} aesthetic, a placeholder photo box (marked "NO PHOTO ON FILE" or "IMAGE DENIED"), the handle text, and optional details: favorite light "{{favoriteLight}}", assigned object "{{assignedObject}}." Make it feel bureaucratic but personal.',
    requiredInputs: ['handle', 'theme'],
    optionalInputs: ['favoriteLight', 'assignedObject', 'turf'],
    styleRules: [
      'corrupted employee ID layout',
      'MySpace profile flair energy',
      'placeholder photo box',
      'bureaucratic font choices',
      'thermal printer texture',
    ],
    hardNos: ['no LinkedIn headshot look', 'no modern profile card'],
    outputNotes: ['Credit card size (3.375x2.125in) or similar', 'Printable as a cut-out'],
  },
  {
    slug: 'event-poster',
    type: 'event_poster',
    title: 'Event Poster',
    description: 'A poster for a Breakroom event. Looks like a show flyer from a strange venue.',
    basePrompt: 'Create an event poster for "{{eventTitle}}" — {{eventDescription}}. The poster should look like a punk show flyer crossed with a community bulletin posting from a venue that may not exist. Use bold distorted text, a single crude illustration or photo placeholder, date/location info ("{{dateLabel}}" / "{{locationLabel}}"), and faction colors if affiliated ({{factionColors}}). Cheap xerox feel.',
    requiredInputs: ['eventTitle', 'eventDescription', 'dateLabel', 'locationLabel'],
    optionalInputs: ['factionColors', 'relatedFaction'],
    styleRules: [
      'punk show flyer aesthetic',
      'bold distorted text',
      'crude illustration or photo',
      'cheap xerox/risograph feel',
      'community bulletin board posting',
    ],
    hardNos: ['no Eventbrite look', 'no modern event marketing', 'no clean typography'],
    outputNotes: ['11x17 or A3 portrait', 'Should work printed on cheap paper'],
  },
  {
    slug: 'turf-mark',
    type: 'turf_mark',
    title: 'Turf Mark',
    description: 'A faction territory marker. Sticker, stencil, or tag energy.',
    basePrompt: 'Create a turf mark for {{factionName}} — their territorial identifier found on walls, tables, and bathroom mirrors in {{turfDistrict}}. The mark should look like a sticker, stencil, or crude tag. Use {{factionColors}}, incorporate {{factionSymbols}}, and keep it simple enough to be spray-painted or slapped on as a sticker. Include the motto: "{{motto}}."',
    requiredInputs: ['factionName', 'factionColors', 'factionSymbols', 'turfDistrict', 'motto'],
    optionalInputs: [],
    styleRules: [
      'sticker/stencil/tag aesthetic',
      'simple enough to reproduce by hand',
      'found-on-walls energy',
      'one to three colors max',
    ],
    hardNos: ['no clean logo design', 'no corporate branding', 'no vector perfection'],
    outputNotes: ['Square or circular format', '500x500px minimum', 'Transparent background ideal'],
  },
  {
    slug: 'product-concept',
    type: 'product_concept',
    title: 'Product Concept',
    description: 'A Stuff item rendered as a fake product shot. Evidence photography.',
    basePrompt: 'Create a product concept image for "{{stuffName}}" — {{stuffDescription}}. Shoot it like evidence photography from a pawn shop or lost-and-found shelf. Use flat lighting, a slightly dirty surface (countertop, felt table, or concrete), a small paper label or price tag reading "{{priceLabel}}", and capture it from slightly above. The object should feel real but unclaimed.',
    requiredInputs: ['stuffName', 'stuffDescription'],
    optionalInputs: ['priceLabel', 'sourceLabel', 'relatedFaction'],
    styleRules: [
      'evidence photography',
      'pawn shop / lost-and-found shelf',
      'flat lighting',
      'dirty surface (countertop, felt, concrete)',
      'small paper label or price tag',
      'slightly above angle',
    ],
    hardNos: ['no ecommerce product shot', 'no white background studio', 'no lifestyle photography'],
    outputNotes: ['Square 1:1 or 4:3 landscape', 'Should feel like a phone photo from 2005'],
  },
  {
    slug: 'guestbook-sticker',
    type: 'guestbook_sticker',
    title: 'Guestbook Sticker',
    description: 'A small sticker someone would slap on a bathroom mirror or laptop lid.',
    basePrompt: 'Create a small sticker design for The Breakroom that says "{{stickerText}}." The sticker should look like something slapped on a bathroom mirror, laptop lid, or bar register. Use {{stickerStyle}} style, keep it under 3 colors, make it slightly peeling or worn, and include a tiny "sleepnet://" URL at the bottom.',
    requiredInputs: ['stickerText'],
    optionalInputs: ['stickerStyle', 'relatedPage', 'factionSlug'],
    styleRules: [
      'die-cut sticker shape',
      'slightly peeling or worn edges',
      'under 3 colors',
      'tiny URL at bottom',
      'bathroom mirror / laptop lid scale',
    ],
    hardNos: ['no vinyl premium sticker look', 'no Redbubble polish'],
    outputNotes: ['2-3 inch diameter or equivalent', 'Transparent or white background'],
  },
];

export function getTemplateBySlug(slug: string): ArtifactPromptTemplate | undefined {
  return ARTIFACT_PROMPT_TEMPLATES.find((t) => t.slug === slug);
}

export function getTemplatesByType(type: ArtifactType): ArtifactPromptTemplate[] {
  return ARTIFACT_PROMPT_TEMPLATES.filter((t) => t.type === type);
}
