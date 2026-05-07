#!/usr/bin/env node
/**
 * regen-void-images.mjs — Regenerate VOID image slots
 *
 * Supports four generation providers:
 *   - replicate-flux-pro          text-to-image (FLUX 1.1 Pro)
 *   - replicate-flux-kontext-pro  image-to-image (FLUX Kontext Pro, requires anchorKey)
 *   - replicate-recraft-v3        text-to-image (Recraft V3, native flat-illustration prior)
 *   - static-asset                no generation — slot just serves a committed binary
 *
 * Usage:
 *   pnpm regen-images                 # regen ALL non-static slots
 *   pnpm regen-images theDriver       # regen one slot by key
 *   pnpm regen-images theDriver --staging   # save to staging only
 *
 * Requires REPLICATE_API_TOKEN in env or .env.local at project root.
 *
 * Output paths:
 *   void-images-replicate/<key>.jpg          (review staging — gitignored)
 *   public/void/<key>.jpg                    (live serving — committed)
 *
 * Anchors live at public/void/refs/<anchor-name>.jpg and are read from disk,
 * base64-encoded, and sent as input_image to Kontext.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// 1. Load token
// ---------------------------------------------------------------------------
function loadToken() {
  if (process.env.REPLICATE_API_TOKEN) return process.env.REPLICATE_API_TOKEN;
  const envLocalPath = resolve(PROJECT_ROOT, '.env.local');
  if (existsSync(envLocalPath)) {
    const lines = readFileSync(envLocalPath, 'utf8').split('\n');
    for (const line of lines) {
      const m = line.match(/^\s*REPLICATE_API_TOKEN\s*=\s*(.+?)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  }
  return null;
}

const TOKEN = loadToken();

// ---------------------------------------------------------------------------
// 2. STYLE_ANCHORS (mirror of src/lib/nanoPrompts.ts)
// ---------------------------------------------------------------------------
const STYLE_ANCHORS = {
  theRegularBlack: {
    diskPath: 'public/void/refs/the-regular-black.jpg',
    description: 'THE REGULAR canonical — black knit balaclava + white hoodie',
  },
  theRegularWhite: {
    diskPath: 'public/void/refs/the-regular-white.jpg',
    description: 'THE REGULAR alt — white knit balaclava + white hoodie',
  },
};

// ---------------------------------------------------------------------------
// 3. SLOTS (mirror of src/lib/nanoPrompts.ts)
// ---------------------------------------------------------------------------
// Update this in lockstep with NANO_PROMPTS in nanoPrompts.ts. Static-asset
// slots are intentionally omitted here — they don't need regeneration.
//
// SKIN_NEGATIVES is mirrored here too — Kontext ignores the `negative` field,
// so the no-skin-showing clause must live inline in the prompt.
//
const SKIN_NEGATIVES = [
  'The character is fully clothed in flat white fabric with absolutely no skin tone or flesh color visible anywhere on the body —',
  'no bare legs between shorts and boots, no bare wrists between sleeves and gloves, no bare neck between mask and hoodie,',
  'no visible knees, no visible shins, no visible forearms, no exposed human anatomy of any kind.',
].join(' ');

// TEXTURE_FINISH (mirror of src/lib/nanoPrompts.ts) — subtle paper-and-ink polish.
const TEXTURE_FINISH = [
  'Subtle hand-drawn paper finish — the entire image rendered as if drawn on a sheet of slightly textured cream-toned cartridge paper.',
  'A very faint barely-visible paper grain runs across the flat color fills.',
  'Where the thick black ink outlines meet the paper, there is the gentlest hint of ink bleed and a trace of irregularity in line weight (extremely subtle — just enough to feel hand-drawn, not enough to break the flat fill).',
  'A trace of matte grit across the whole surface, like a real-world drawing photographed flat.',
  'The texture is a finish layer, not a filter — flat colors must still read as flat fills, the linework must still be confident, the cartoon clarity is preserved.',
].join(' ');

const SLOTS = [
  {
    key: 'theRegularSeated',
    provider: 'replicate-flux-kontext-pro',
    anchorKey: 'theRegularBlack',
    width: 1152,
    height: 864,
    seed: 3143,
    prompt: [
      'Same exact character from the reference image — black knit balaclava with red eye-slot, white hoodie, white shorts, chunky white boots and gloves.',
      'Now seated on a metal fire escape ledge in a slumped relaxed pose, one knee up, the other leg dangling off the edge.',
      'A lit cigarette held between two gloved fingers in his right hand, faint thin grey smoke trailing upward.',
      'Same flat 2D Markus Magnusson Sneaky-style cartoon rendering, same thick black ink outlines, same flat fill colors, same saturated purple background, same dotted floor shadows.',
    ].join(' '),
  },
  {
    key: 'theDriver',
    provider: 'replicate-flux-kontext-pro',
    anchorKey: 'theRegularBlack',
    width: 1152,
    height: 864,
    seed: 4011,
    prompt: [
      'Drawn in EXACTLY the same Markus Magnusson Sneaky cartoon style as the reference image — same thick black ink outlines, same flat fill, same chunky proportions, same saturated purple background, same dotted floor shadows.',
      'But this is a DIFFERENT character: a chauffeur. He wears a black peaked chauffeur cap pulled low over his face, a black knit balaclava with a single red eye-slot underneath the cap, a buttoned-up dark grey double-breasted chauffeur jacket with brass buttons, dark grey trousers, polished black shoes.',
      'He stands in a stiff three-quarter side stance holding a single brass car key dangling from one gloved finger.',
      'Same chunky white cartoon mitten gloves and same Mickey-style bulbous shoes as the reference (just black/dark instead of white).',
    ].join(' '),
  },
  {
    key: 'theRegularAtTheTable',
    provider: 'replicate-flux-kontext-pro',
    anchorKey: 'theRegularBlack',
    width: 1152,
    height: 864,
    seed: 5101,
    prompt: [
      'Same exact character from the reference image — black knit balaclava with the elongated horizontal red eye-slot and visible vertical knit ribbing, same baggy white pullover hoodie, same baggy white shorts, same chunky bulbous white Mickey-style boots, same big rounded white mitten gloves with no finger separation.',
      'Now leaning forward over a green felt pool table with both gloved hands resting on a wooden pool cue held horizontally across the table edge, head tilted down slightly as if lining up a shot, weight shifted onto the front foot with the back leg slightly extended.',
      'A small cube of blue chalk visible on the felt next to his hand. The wooden bumper rail of the pool table cropped at the bottom edge of the frame.',
      'Same flat 2D Markus Magnusson Sneaky cartoon style — same thick chunky black ink outlines with heavy line weight, same flat fill colors with zero shading, same saturated purple background visible above the pool table edge, same 3 to 5 small dark grey oval dot shadows scattered loosely on the floor beneath his feet.',
      SKIN_NEGATIVES,
    ].join(' '),
  },
  {
    key: 'theRegularInTheBooth',
    provider: 'replicate-flux-kontext-pro',
    anchorKey: 'theRegularBlack',
    width: 1152,
    height: 864,
    seed: 5102,
    prompt: [
      'Same exact character from the reference image — black knit balaclava with the elongated horizontal red eye-slot and visible vertical knit ribbing, same baggy white pullover hoodie, same baggy white shorts, same chunky bulbous white Mickey-style boots, same big rounded white mitten gloves with no finger separation.',
      'Now seated and slumped backward in a deep red vinyl diner-booth bench, one gloved arm draped lazily along the top edge of the booth backrest, the other hand resting on a formica table holding a half-crushed white paper food wrapper.',
      'A sweating silver-grey beer can on the table next to the wrapper. Visible vertical seams on the booth vinyl. The formica tabletop edge cropped along the bottom of the frame.',
      'Same flat 2D Markus Magnusson Sneaky cartoon style — same thick chunky black ink outlines, same flat fill colors with zero shading, same saturated purple background visible above the booth, same dotted floor shadows.',
      SKIN_NEGATIVES,
    ].join(' '),
  },
  {
    key: 'theRegularOnThePhone',
    provider: 'replicate-flux-kontext-pro',
    anchorKey: 'theRegularBlack',
    width: 1152,
    height: 864,
    seed: 5103,
    prompt: [
      'Same exact character from the reference image — black knit balaclava with the elongated horizontal red eye-slot and visible vertical knit ribbing, same baggy white pullover hoodie, same baggy white shorts, same chunky bulbous white Mickey-style boots, same big rounded white mitten gloves with no finger separation.',
      'Now standing in a slight three-quarter side stance at a metal silver-grey payphone booth housing, with a black phone receiver pressed flat against the side of the balaclava held by his right gloved hand, the curly black phone cord coiling down from the receiver in loose loops.',
      'His left gloved hand rests flat against the silver metal phone box face. The payphone unit is visible from the waist up, mounted on a wall.',
      'Same flat 2D Markus Magnusson Sneaky cartoon style — same thick chunky black ink outlines, same flat fill colors with zero shading, same saturated purple background, same dotted floor shadows beneath his feet.',
      SKIN_NEGATIVES,
    ].join(' '),
  },
  {
    key: 'theRegularJumper',
    provider: 'replicate-flux-kontext-pro',
    anchorKey: 'theRegularBlack',
    width: 1152,
    height: 864,
    seed: 5104,
    prompt: [
      'Same exact character head from the reference image — black knit balaclava with the elongated horizontal red eye-slot, two glowing solid red eyes side by side, fully covered mouth and chin, visible vertical knit ribbing texture on the mask.',
      'Same chunky bulbous white Mickey-Mouse-style boots with rounded almost-spherical toes and no laces, same big rounded white cartoon mitten gloves with no finger separation.',
      'But the body is now wearing a single-piece baggy white pullover jumpsuit — ONE continuous unbroken white garment from below the mask all the way down to the boot tops, with NO waistband, NO belt, NO separation between top and bottom, NO visible hem at the waist, NO shorts. The white fabric runs straight from neckline to ankle in one piece, like a coverall or boiler suit, with a slight bunching at the wrists where the sleeves meet the gloves and at the ankles where the legs meet the boots.',
      'Same standing wide-stance pose from the reference. Same flat 2D Markus Magnusson Sneaky cartoon style — same thick chunky black ink outlines, same flat fill white with zero gradients and zero shading, same saturated purple background, same 3 to 5 small dark grey oval dot shadows on the floor.',
      "The character's entire body from neck to ankles is fully covered in unbroken flat white fabric. No skin tone, no bare wrists, no bare ankles, no flesh visible anywhere.",
    ].join(' '),
  },

  // =========================================================================
  // PR-L PROPERTY REGISTERS — mirror of nanoPrompts.ts (kept inline)
  // =========================================================================
];

// Property registers (mirrored from src/lib/nanoPrompts.ts)
const OMNISHIFT_REGISTER = [
  'Period-correct early-2000s corporate stock photography — IBM 2001 / Oracle 2002 / SharePoint 2001 register.',
  'Low-saturation corporate palette: muted IBM navy (#003F7F base), cool secondary cyan (#5C9BD5), cream-white background (#F4F4F4), flat black sans-serif Helvetica/Arial type, beveled chrome buttons.',
  'Shot on a 2-megapixel consumer CCD digital camera circa 2001: mild JPEG compression artifacts at the corners, slight purple chromatic aberration on dark edges, the photographic flatness of stock-corporate-catalog imagery, no bokeh, deep depth of field.',
  'Fluorescent ceiling-tube lighting casting cool slightly-greenish skin tones, minimal contrast, no rim light, no cinematic grading.',
  'Bureaucratic and lightly sinister tone — every smile is just slightly held too long, every gesture is rehearsed, the room feels like training video.',
].join(' ');

const SLEEPNET_PORTAL_REGISTER = [
  '1998-2001 web portal directory illustration aesthetic — Yahoo 1998 / GeoCities 1999 / AltaVista era.',
  'Hand-drawn cartoon illustration in early-Macromedia-Flash 4 register: thick black outlines, flat 4-color GIF-palette fills, mild dithering at color edges, no gradients, no anti-aliasing on inner shapes.',
  'Vibrant primary color palette — Yahoo purple (#7B0099), saturated GIF reds, GIF greens, GIF yellows, white background with no shadows.',
  'Mascot characters drawn in a friendly clip-art register — round eyes, simple smile lines, oversized hands with three fingers, slight rubberhose-cartoon flexibility but cheaper than Disney.',
  'NEVER photographic, NEVER modern vector — must look hand-traced into Photoshop 6 with the bucket-fill tool circa 1999.',
].join(' ');

const VGB_REGISTER = [
  "Period-correct 1999-2003 fast-food chain marketing photography — McDonald's 2000 / Burger King 2000-2003 register.",
  'Oversaturated red and yellow palette (signage red #DA291C, sun-yellow #FFC72C), glamour-shot food photography with visible steam, blue-sky-clear-day backgrounds with cumulus clouds, harsh on-camera flash.',
  'Family demographic stock photography — multi-ethnic mom and dad and two kids in branded paper hats, smiling too widely at the camera, photographed in a chain-restaurant interior with red vinyl booths and yellow walls.',
  'CRITICAL OFF-NESS RULE: every image has exactly ONE subtly-wrong element — wilted brown lettuce edges on the burger, a child with a slightly too-wide smile, the tomato slice is grey instead of red, the bun is slightly asymmetric. Bake one off-ness signal into the prompt.',
  'Captured on consumer-grade flash photography circa 2001, slight overexposure on highlights, JPEG sharpening visible at the edges of fries.',
].join(' ');

const SLEEPNEWS_REGISTER = [
  '1998-2002 online newspaper press photography aesthetic — BBC News 2000 / CNN 1998 / ABC News 1997 register.',
  'Low-resolution AP-wire press photo: grainy 35mm film grain or early digital sensor noise, slightly underexposed, color balance off (warm orange streetlight cast or cool blue fluorescent cast), natural newsprint feel.',
  'Compressed-JPEG artifacts in the dark areas, slight motion blur, news-photographer flash bouncing off surfaces, no Photoshop retouching.',
  'Subjects captured in candid pose mid-action, never posed for the camera. Composition slightly off-center, a stray lamppost or No Parking sign cropping the edge of the frame.',
  'The kind of photo that ran on B5 of a regional paper on a Tuesday morning. Caption-worthy but not memorable.',
].join(' ');

// Append PR-L property slots
SLOTS.push(
  // OmniShift
  {
    key: 'omnishiftHeroBoardroom',
    provider: 'replicate-flux-pro',
    width: 1280, height: 720, seed: 6001,
    prompt: [
      'Four multi-ethnic business professionals in their thirties seated around a faux-mahogany oval conference table in a corporate office, taken from a slight low-angle three-quarter view.',
      'Three of them have eyes turned attentively toward an unseen speaker at the head of the table; ONE of them — the woman in the navy blazer — is looking directly at the camera with a held smile that is just slightly too long.',
      'They wear early-2000s business-casual: collared oxford shirts in white and pale blue, navy blazers, one striped tie. A beige Dell PC tower with a green LED is barely visible in the background corner. A laser-printed memo and a Styrofoam coffee cup sit on the table.',
      OMNISHIFT_REGISTER,
    ].join(' '),
  },
  {
    key: 'omnishiftHeroHandshake',
    provider: 'replicate-flux-pro',
    width: 1280, height: 720, seed: 6002,
    prompt: [
      'Tight close-up photograph of a business handshake between two pairs of hands. The left hand wears a starched white oxford-shirt cuff with a silver wristwatch; the right hand wears a pale-blue oxford cuff with a gold pinky ring. Their palms are joined firmly, fingers wrapping.',
      'Slightly out of focus in the upper-left edge of the frame, a THIRD hand is just entering the shot — only the fingertips visible, palm-up, as if waiting its turn or interrupting.',
      'Background is an out-of-focus navy-to-cyan corporate gradient with a faint OmniShift logo bug ghosted in the lower-right corner — just a dimensional sans-serif "OmniShift" wordmark in muted IBM-blue.',
      OMNISHIFT_REGISTER,
    ].join(' '),
  },
  {
    key: 'omnishiftEmployeePortraitDefault',
    provider: 'replicate-flux-pro',
    width: 1024, height: 1024, seed: 6003,
    prompt: [
      'A flatbed-scanned image of a single piece of clip art from the 1999 Microsoft Office 2000 ClipArt Gallery, displayed in the center of a plain cream-white background.',
      'The clip art shows a generic business professional from the chest up, facing forward with a neutral pleasant expression — wearing a crisp white collared shirt with a navy blue striped tie. Short brown hair, ambiguous gender, ambiguous ethnicity. The kind of generic "everyperson" placeholder figure used in 2001-era corporate clip art collections.',
      'The illustration itself is a flat 2D vector cartoon with a thin black outline, hard edges with no anti-aliasing, limited 8-color palette (white shirt, navy tie, peach skin, brown hair, and small detail colors). No gradients. No modern shading. No bokeh. Pure 1999-era ClipArt Gallery aesthetic — friendly but generic, slightly stiff, the kind of figure that ships with Microsoft Office.',
      'The whole image has the visible compression artifacts of a low-resolution JPEG saved in 2001 — slight purple chromatic aberration on dark edges, faint scanner-bed paper texture, a barely-visible "Microsoft ClipArt Gallery 2.0" watermark stamped in the lower-right corner in 8-point Arial grey.',
      'CRITICAL: This is NOT a modern flat illustration. It is NOT contemporary editorial design. It is NOT Mailchimp-style art. It is the actual rough cheap clip art that came on the Microsoft Office 2000 install CD — boxy, flat, hard-edged, slightly amateurish, period-locked to 1999-2001.',
    ].join(' '),
  },
  // SleepNet portal
  {
    key: 'sleepnetDirectoryClerk',
    provider: 'replicate-recraft-v3',
    recraftStyle: 'digital_illustration/2d_art_poster',
    width: 1024, height: 1024, seed: 6101,
    prompt: [
      'A bored cartoon clerk character seated at a beige CRT computer terminal, viewed from a three-quarter angle. The clerk wears a green plastic visor on his forehead, black arm garters on his rolled-up white shirt sleeves, and round wire-frame glasses. He has a thin moustache and tired half-closed eyes.',
      'Stacks of manila file folders are piled high on either side of the terminal, each labeled with a small handwritten tag. The CRT screen glows green with cryptic text. A single naked fluorescent tube hangs above him.',
      'A small enamel pin on his shirt collar reads "SleepNet · Indexing Division".',
      SLEEPNET_PORTAL_REGISTER,
    ].join(' '),
  },
  {
    key: 'sleepnetWebRingBadge',
    provider: 'replicate-recraft-v3',
    recraftStyle: 'digital_illustration/pixel_art',
    width: 1024, height: 360, seed: 6102,
    prompt: [
      'A horizontal banner-ad-shaped graphic in the exact style of a 1999 Geocities web ring banner — proportioned roughly 1024 by 360 pixels but rendered in the visual register of the original 88x31 GIF banner ads of that era.',
      'Left third: a small cartoon moon-and-stars icon in saturated GIF yellow on black. Center third: chunky pixelated bitmap text reading "JOIN THE CIRCLE" in alternating Yahoo purple and saturated red, with a slight 1-pixel drop shadow. Right third: small triangular "← PREV / NEXT →" navigation arrows in white on a deep blue panel.',
      'Hard edges, no anti-aliasing, no gradients — pure 4-color GIF palette (purple, red, yellow, white) on a black background with a 2-pixel beveled outer border in dark grey.',
      SLEEPNET_PORTAL_REGISTER,
    ].join(' '),
  },
  // Very Good Burger
  {
    key: 'vgbMascotBilly',
    provider: 'replicate-flux-pro',
    width: 1024, height: 1280, seed: 6201,
    prompt: [
      'A close-up photograph of a single white Styrofoam cup sitting upright on a red plastic mall food court tray, photographed slightly above eye level.',
      'Printed on the curved side of the cup in vivid four-color silkscreen ink is the cartoon mascot of a regional fast-food chain called "Very Good Burger" — an anthropomorphic cartoon hamburger character named Billy.',
      'The mascot illustration shows a friendly cartoon burger character with a sesame-seed bun head, large white cartoon eyes with small black pupils (one slightly off-center), a wide friendly smile across the patty layer, and tiny white-gloved hands with a single hand raised in a wave. The mascot is printed in the flat 1999-era cartoon style of a regional burger chain — thick black outlines, four-color palette (red, yellow, white, black), no gradients, slightly off-register where the colors meet (the red is a pixel off from the black outline).',
      'Above the mascot, a curved banner reading "VERY GOOD!" in bold uppercase red marker letters wraps around the upper portion of the cup.',
      'The cup is photographed with a slight coffee-ring stain near the rim and a small dent in the lip. The food court tray reflects fluorescent ceiling lights as a long bright streak. Out-of-focus chain-restaurant interior in the background — red vinyl booth, yellow walls, hint of a "TRAY RETURN" sign.',
      'Period-correct 2001 mall food court photograph aesthetic — slightly too-bright fluorescent lighting, mild JPEG compression artifacts, the photographic flatness of a chain-restaurant interior. The kind of cup that ran for two summers in 1999-2001 and quietly disappeared.',
      'CRITICAL: This is a PHOTOGRAPH of a real-world cup with printed cartoon art — NOT an illustration of a mascot directly. The mascot lives on the curved cup surface, not as the primary subject in vacuum.',
    ].join(' '),
  },
  {
    key: 'vgbHeroBurger',
    provider: 'replicate-flux-pro',
    width: 1280, height: 960, seed: 6202,
    prompt: [
      'A single hamburger photographed dead-center on a plain white plate, viewed from a low three-quarter angle. The bun is a sesame-seed top bun, slightly asymmetric (one side a touch taller than the other). A beef patty is visible with a thin layer of melted American cheese drooping over one edge in a frozen mid-drip.',
      'Below the cheese, a layer of green-leaf lettuce — and CRITICALLY, the visible edges of the lettuce are slightly wilted and turning brown at the very tips, which is the off-ness signal for this image. Below the lettuce, a single ring of red onion and a thick slice of tomato.',
      'A faint wisp of steam rises from the patty. The plate sits on a red-and-yellow checked paper liner. Background is out-of-focus warm yellow chain-restaurant interior with a hint of red vinyl booth.',
      VGB_REGISTER,
    ].join(' '),
  },
  {
    key: 'vgbDriveThruFamily',
    provider: 'replicate-flux-pro',
    width: 1280, height: 720, seed: 6203,
    prompt: [
      'A multi-ethnic family of four (a man and woman in their mid-30s in the front seats, a boy around 8 and a girl around 6 in the back seat) seated in a beige minivan at a fast-food drive-thru pickup window. The window is glowing with warm yellow fluorescent light from inside the restaurant. A masked employee\'s gloved hand is just visible passing a brown paper bag stamped with the red "Very Good Burger" wordmark.',
      'The mother is paying with a credit card; the father is smiling and giving a thumbs-up to the camera; the daughter is reaching for the bag.',
      'CRITICAL OFF-NESS: the BOY in the back seat has a smile that is just slightly too wide for his face — about 15% wider than natural — but otherwise looks normal.',
      'Sun-drenched suburban parking lot, mid-afternoon, slight lens flare. Photograph style: stock-photo cheerfulness, slightly too-bright on highlights.',
      VGB_REGISTER,
    ].join(' '),
  },
  // SleepNews
  {
    key: 'slpnewsHeroIncident',
    provider: 'replicate-flux-pro',
    width: 1280, height: 854, seed: 6301,
    prompt: [
      'A nighttime press photograph of an empty motel parking lot, taken with a flash. Two distant figure silhouettes are barely visible standing near a cone of light beneath a tall sodium-vapor streetlamp at the far end of the lot, their faces obscured by shadow.',
      'In the upper-left edge of the frame, a partially cut-off motel sign with neon tube letters reads "MOT", the rest cropped out — only "MOT" is visible. A No Parking sign on a rust-streaked metal post pokes into the lower-right edge of the frame.',
      'A single Pepsi can lies on its side in the foreground asphalt. The asphalt has irregular puddles reflecting the orange streetlamp light.',
      "Captured on a 35mm camera with on-camera flash bouncing off a row of parked cars in the middle distance — the flash creates a hot spot on one car's rear windshield. The ground in the foreground is darker than the background due to the inverse-square falloff.",
      SLEEPNEWS_REGISTER,
    ].join(' '),
  },
  {
    key: 'slpnewsCorrectionStamp',
    provider: 'replicate-recraft-v3',
    recraftStyle: 'digital_illustration/grain',
    width: 1024, height: 768, seed: 6302,
    prompt: [
      'A close-up illustration of a small piece of off-white newsprint paper with three lines of typewritten text in black IBM Selectric typeface reading "CORRECTION:" on line one, then "FILED BUT" on line two, then "NOT APPLIED" on line three.',
      'A bold red rubber-stamp impression has been pressed diagonally across the top-right corner of the paper, the stamp reading "RECEIVED · SLEEPNEWS · DESK 4" in an irregular cracked-ink texture (some letters faded, some over-saturated).',
      'The paper has subtle horizontal newsprint dot pattern visible across its surface, plus a faint single coffee-cup-ring stain in the lower-left.',
      'The paper is slightly rotated counterclockwise about 4 degrees, casting a soft shadow on a dark wood desk surface beneath it. A typewriter ribbon spool sits out of focus in the upper edge of the frame.',
      SLEEPNEWS_REGISTER,
    ].join(' '),
  },
);

// ---------------------------------------------------------------------------
// 4. CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const stagingOnly = args.includes('--staging');
const positional = args.filter((a) => !a.startsWith('--'));
const slotFilter = positional[0];

const targetSlots = slotFilter
  ? SLOTS.filter((s) => s.key === slotFilter)
  : SLOTS;

if (targetSlots.length === 0) {
  console.error(`[regen] No slot matches "${slotFilter}".`);
  console.error(`  Available: ${SLOTS.map((s) => s.key).join(', ')}`);
  process.exit(1);
}

if (!TOKEN) {
  console.error('\n[regen] Missing REPLICATE_API_TOKEN.');
  console.error('  Either: export REPLICATE_API_TOKEN=r8_xxxxx');
  console.error('  Or:     echo "REPLICATE_API_TOKEN=r8_xxxxx" >> .env.local');
  console.error('  Get a fresh token at https://replicate.com/account/api-tokens\n');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 5. Helpers
// ---------------------------------------------------------------------------
function deriveAspectRatio(width, height) {
  const candidates = [
    ['1:1', 1], ['16:9', 16/9], ['21:9', 21/9], ['3:2', 1.5], ['2:3', 2/3],
    ['4:5', 0.8], ['5:4', 1.25], ['3:4', 0.75], ['4:3', 4/3],
    ['9:16', 9/16], ['9:21', 9/21],
  ];
  const target = width / height;
  let best = candidates[0];
  let bd = Math.abs(best[1] - target);
  for (const c of candidates) {
    const d = Math.abs(c[1] - target);
    if (d < bd) { bd = d; best = c; }
  }
  return best[0];
}

/** Read an anchor file and return a base64 data URL Replicate can ingest. */
function loadAnchorAsDataUrl(anchorKey) {
  const anchor = STYLE_ANCHORS[anchorKey];
  if (!anchor) throw new Error(`Unknown anchor key: ${anchorKey}`);
  const fullPath = resolve(PROJECT_ROOT, anchor.diskPath);
  if (!existsSync(fullPath)) {
    throw new Error(
      `Anchor file missing at ${anchor.diskPath}. ` +
      `Save your reference JPG to that path first, then rerun.`
    );
  }
  const buf = readFileSync(fullPath);
  const ext = anchor.diskPath.split('.').pop().toLowerCase();
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

// ---------------------------------------------------------------------------
// 6. Provider-specific generators
// ---------------------------------------------------------------------------

async function generateFluxPro(slot) {
  const aspectRatio = deriveAspectRatio(slot.width, slot.height);
  console.log(`[regen] ${slot.key} — FLUX 1.1 Pro (${aspectRatio}, seed ${slot.seed})…`);
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Prefer: 'wait=60' },
      body: JSON.stringify({
        input: {
          prompt: slot.prompt,
          aspect_ratio: aspectRatio,
          output_format: 'jpg',
          output_quality: 90,
          safety_tolerance: 5,
          prompt_upsampling: false,
          seed: slot.seed,
        },
      }),
    }
  );
  return handlePrediction(res);
}

async function generateFluxKontextPro(slot) {
  if (!slot.anchorKey) throw new Error(`${slot.key}: kontext slot requires anchorKey`);
  const inputImage = loadAnchorAsDataUrl(slot.anchorKey);
  console.log(`[regen] ${slot.key} — FLUX Kontext Pro (anchor: ${slot.anchorKey}, seed ${slot.seed})…`);
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Prefer: 'wait=60' },
      body: JSON.stringify({
        input: {
          prompt: slot.prompt,
          input_image: inputImage,
          // 'match_input_image' preserves the anchor's framing — critical for
          // character continuity. Override only when intentionally reframing.
          aspect_ratio: 'match_input_image',
          output_format: 'jpg',
          output_quality: 90,
          safety_tolerance: 5,
          seed: slot.seed,
        },
      }),
    }
  );
  return handlePrediction(res);
}

async function generateRecraftV3(slot) {
  // Recraft V3 takes a literal pixel `size` string, not aspect_ratio. Closest
  // supported sizes: 1024x1024, 1365x1024, 1707x1024, 2048x1024, 1024x1365,
  // 1024x1707, 1024x2048. Pick the closest to slot dims.
  const supported = [
    '1024x1024', '1365x1024', '1707x1024', '2048x1024',
    '1024x1365', '1024x1707', '1024x2048',
  ];
  const slotRatio = slot.width / slot.height;
  const size = supported
    .map((s) => {
      const [w, h] = s.split('x').map(Number);
      return { s, diff: Math.abs(w / h - slotRatio) };
    })
    .sort((a, b) => a.diff - b.diff)[0].s;

  const style = slot.recraftStyle || 'digital_illustration';
  console.log(`[regen] ${slot.key} — Recraft V3 (${size}, ${style})…`);
  const res = await fetch(
    'https://api.replicate.com/v1/models/recraft-ai/recraft-v3/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Prefer: 'wait=60' },
      body: JSON.stringify({ input: { prompt: slot.prompt, size, style } }),
    }
  );
  return handlePrediction(res);
}

async function handlePrediction(res) {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Replicate ${res.status}: ${body}`);
  }
  const data = await res.json();
  if (data.status === 'failed') throw new Error(`Generation failed: ${data.error}`);
  const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;
  if (!imageUrl) throw new Error(`No output URL: ${JSON.stringify(data)}`);
  console.log(`[regen]   downloading ${imageUrl.slice(0, 60)}…`);
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Image download ${imgRes.status}`);
  return Buffer.from(await imgRes.arrayBuffer());
}

async function generate(slot) {
  switch (slot.provider) {
    case 'replicate-flux-pro': return generateFluxPro(slot);
    case 'replicate-flux-kontext-pro': return generateFluxKontextPro(slot);
    case 'replicate-recraft-v3': return generateRecraftV3(slot);
    default: throw new Error(`Unsupported provider: ${slot.provider}`);
  }
}

// ---------------------------------------------------------------------------
// 7. Main
// ---------------------------------------------------------------------------
function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function main() {
  for (const slot of targetSlots) {
    try {
      const buf = await generate(slot);

      const stagingDir = resolve(PROJECT_ROOT, 'void-images-replicate');
      ensureDir(stagingDir);
      const stagingPath = resolve(stagingDir, `${slot.key}.jpg`);
      writeFileSync(stagingPath, buf);
      console.log(`[regen] ✓ staging  → ${stagingPath} (${buf.length} bytes)`);

      if (!stagingOnly) {
        const liveDir = resolve(PROJECT_ROOT, 'public', 'void');
        ensureDir(liveDir);
        const livePath = resolve(liveDir, `${slot.key}.jpg`);
        writeFileSync(livePath, buf);
        console.log(`[regen] ✓ live     → ${livePath}`);
      }
    } catch (err) {
      console.error(`[regen] ✗ ${slot.key}:`, err.message);
      process.exitCode = 1;
    }
  }

  console.log('\n[regen] done.');
  if (!stagingOnly) {
    const slotKeys = targetSlots.map((s) => s.key).join(', ');
    console.log('  Next: review staging image, then commit /public/void/ binaries:');
    console.log(`  git add public/void/ && git commit -m "regen: ${slotKeys}"`);
  } else {
    console.log('  Staging-only run. When happy, rerun without --staging to update /public/void/.');
  }
}

main();
