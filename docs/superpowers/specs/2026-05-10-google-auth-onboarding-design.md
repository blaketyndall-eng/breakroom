# Google Auth + Onboarding Design Spec

**Status:** Brainstorm complete. Pending implementation plan.
**Date:** 2026-05-10
**Author:** Blake (with Claude as thinking partner)
**Brainstorm transcript:** session 2026-05-10 (live conversation)
**Next step:** `superpowers:writing-plans` — turn this spec into PR A's implementation plan.

---

## 0. North star

The Google Auth + Onboarding flow should feel like clocking in at a fake company that already has a file on you and is choosing to ignore it. Users should barely notice the OAuth weaving into their day; the system should feel like it noticed them. **The brand is the marketing. The experience is the marketing.** Voice: Bukowski + corporate parody + Nathan-4-You-quiet-deadpan.

Hard rules pulled from project instructions:
- Fake checkout, fake employment, fake departments — all fine. **Real money / real privacy boundaries must be unmistakable.**
- The bit can be weird. The boundary must be clear.
- Don't imply scopes are required to use the world. Skip is a real choice.

---

## 1. Auth flow promotion (Tier 1)

**Decision:** Google is already wired in `AuthPanel.tsx`. We promote it from third-equal button to primary CTA. Password and magic-link demote to "Other ways in."

**Tier 1 scopes (V1, this spec):**
```
openid email profile
```

No Calendar, no Gmail, no Drive in V1. Tier 2 (Calendar) and Tier 3 (Drive) are deferred — see PR F/G under §6.

**`AuthPanel.tsx` reorder:**
- Primary block: large "Sign in with Google" button.
- Secondary collapsed accordion ("Other ways in"): Magic Link, Email + Password.
- Voice copy on primary: `"OmniShift Intake / Sign in with Google. Faster than the form. The form was the punishment."`

**Why Google is primary:** the Google ID token populates `user.user_metadata` with `name`, `given_name`, `family_name`, `picture`, `locale`, `email_verified` — all of which §5 puts to work as "acknowledged but not in use." Email/password yields none of that, which makes it a strictly worse signup experience for the bit we're building.

**No `provider_token` server-side persistence.** The session.provider_token is read once on callback (for the user_metadata claims), then discarded. No refresh tokens stored. Halves the security surface and matches the "barely notice it weaving" principle — no background reads when the user is absent.

**`AuthCallback.tsx` extension** (existing component, see `src/components/auth/AuthCallback.tsx`): pass the full `User` object to `buildProfile()` instead of just `(email, userId)`. The rest of the callback flow stays — session check, `user_profiles` upsert, drift sync, guestbook sync, redirect to `next`.

---

## 2. Consent + scope tiering

**Tier 1** (V1, in this spec): `openid email profile`. Implicit. No separate consent screen — Google's own OAuth consent is enough; we don't surface a second screen for baseline scopes.

**Tier 2** (deferred, future PR F): `calendar.readonly`. When we ask, it gets a dedicated consent gate framed as an OmniShift HR ask, with copy like:
> *OmniShift Calendar Reconciliation Department would like to look at your calendar. Approve to let it. Skip if you'd rather not. Most employees skip and nothing changes.*

**Tier 3** (deferred, future PR G): `drive.file`. Same shape as Tier 2.

**Pattern for Tier 2/3:** consent is a separate route (`/onboarding/grant-calendar`, etc.), not bundled with initial signup. Users come back to it later when a feature requires it. Skip always works. No scope is required for any V1 feature.

---

## 3. Onboarding interview + interstitial

**Route:** `/onboarding`
**Gate:** post-signup state — fresh user where `user_profiles.onboarding_acknowledged_at IS NULL`. Users hit it once. Skipping flips the flag too (skip is a choice, not a debt).

**Voice rules** (locked during brainstorm, voice-corrected mid-session — Bukowski/Nathan-4-You/HR-memo not mystical/occult):

- Speaker is **always a named OmniShift department**, never "the room." Examples:
  - *OmniShift Compliance and Mail Operations*
  - *OmniShift Records Department*
  - *OmniShift Verification Bureau*
  - *OmniShift Calendar Reconciliation Department*
- Tone: plainspoken declarative, HR-memo cadence.
- Pair every "we will do X" with "we will not do Y." Symmetry signals corporate dryness.
- End on a Bukowski beat. Examples:
  - `"Most employees do not bother."`
  - `"The room does not consult this section twice."`
  - `"This is normal."`
- Buttons read **Approve** / **Skip for now**. Never "Get started" or "Next."

**Interview content** is intentionally short — three to four prompts, not a wizard:

1. *"What do you go by here?"* (alias — optional, defaults to Reddit-style auto handle, see §5.5)
2. *"Pick a light."* (radio: fluorescent, neon, dashboard, motel lamp — feeds `preferred_light` if user picks, otherwise auto-derived from locale)
3. *"What did you find in your pocket after midnight?"* (free text — purely flavor, stored as `pocket_note` on profile, not validated)

Final screen: confirmation with assigned `employee_id`, `department`, `role_name`, `assigned_object_slug`, `house_rule`, alias. Buttons: **Approve** / **Skip for now**. Both forward to `/portal`. Skip flips `onboarding_acknowledged_at` too — the user can re-edit any field later in `/portal/edit-file`.

---

## 4. Mandatory training video infrastructure

**Decision:** ship the *infrastructure* for video training in V1. Module 1 video itself ships separately (PR E) once Seedance generation is ready.

**Asset path:** `public/training/module-1.mp4` (new convention; verified `public/` has no collision with `channel26/`, `pocket-sw.js`, `void/`).

**Components:**
- `TrainingVideoPlayer.tsx` — HTML5 `<video>` with autoplay muted, playsInline, controls visible. Reports `completed` to localStorage + Supabase on `ended` event.
- `TrainingVideoPlaceholder.tsx` — poster image + copy `"Module pending. The room is recording."` Used until Module 1 actually ships. Same outer chrome as the player so the slot doesn't shift.

**Slot integration on `/portal.astro`:**

Insert a new `os-portlet` *immediately above* the existing "Employee File — Active Record" portlet (currently `/portal.astro` line 113-121). The chrome reads:

```
─── OS-MAND-001 / 2003 MANDATORY TRAINING VIDEO ───
[player or placeholder]
Acknowledged at: <timestamp> — OmniShift Compliance and Mail Operations
```

State machine:
- `unassigned` — no video file present and user has no completion record. Show placeholder.
- `pending` — video file present, no completion. Show player.
- `playing` — transient (controlled by HTMLMediaElement state).
- `completed` — collapsed line: `"Module 1 — Welcome to OmniShift / Acknowledged <timestamp>. Refresher: [Replay]."` Doesn't crowd the portal once the loop closes.

**Module 1 script** (production input for Seedance, lives in `docs/training/module-1-script.md`):
- Speaker: **Karen Halverson**, OmniShift HR. Played by Seedance-generated character with locked seed for visual consistency across modules.
- Length target: 90-120 seconds.
- Mix: ~60% talking head of Karen, ~40% still images (assigned uniform card, employee file mock-up, the room behind her with a wall clock stuck at 1:47).
- Opening line: `"Welcome to OmniShift. You were not selected. You were on file."`
- Closing line: `"Take the rest of the day. The day will not take you back."`

**Piggyback fix on PR C:** `/portal.astro` still has `/lost-found` references at lines ~30 and ~64 from before PR 71's redirect cleanup. Tab nav says "Object Archive" → `/lost-found` (redirects to `/newsstand/classifieds`); Quick Links says "File Object Report" → same. Update both to `/newsstand/classifieds` directly. Costs ~30 seconds and tightens the room.

---

## 5. Auto-assignment from Google data

The Employee File chrome surfaces Google's profile claims as **acknowledged but not in use**. The system *knows* you're Blake Tyndall and *refuses* to use the name. That refusal is the bit.

### 5.1 Three-tier treatment of Google claims

| Field | Example | Treatment |
|---|---|---|
| `email` | `blaketyndall@gmail.com` | Used (existing). Primary key. |
| `email_verified` | `true` | **Acknowledged** — comic verification footer. |
| `full_name` / `name` | `Blake Tyndall` | **Acknowledged** — filed but not in use. |
| `given_name` | `Blake` | **Acknowledged** — never used as alias default. |
| `family_name` | `Tyndall` | **Used (invisible)** — joins the seed for `generateEmployee()`. |
| `picture` | `https://lh3.googleusercontent.com/...` | **Acknowledged but never displayed.** Replaced with uniform card. |
| `locale` | `en-US` | **Used (invisible)** — feeds `preferred_light` via `localeToLight()`. |
| `hd` (G Suite) | `acme.com` | **Acknowledged** if present, ignored functionally. |
| `iss` / `sub` / `aud` | OAuth claims | Ignored. |

### 5.2 Schema additions

**Migration `supabase/migrations/0006_google_metadata.sql`:**
```sql
alter table user_profiles
  add column if not exists google_given_name text,
  add column if not exists google_family_name text,
  add column if not exists google_email_verified boolean,
  add column if not exists google_locale text,
  add column if not exists google_hosted_domain text;
```

All five columns nullable. Existing RLS policies on `user_profiles` cover the new columns — no new policy required.

**Local type `LocalEmployeeProfile`** (in `src/lib/localSession.ts`) gains five matching optional fields: `google_given_name`, `google_family_name`, `google_email_verified`, `google_locale`, `google_hosted_domain`.

### 5.3 `buildProfile()` rewrite

**File:** `src/components/auth/AuthCallback.tsx`

```typescript
function buildProfile(user: User): LocalEmployeeProfile {
  const meta = user.user_metadata ?? {};
  const email = user.email ?? '';
  const familyName = meta.family_name ?? null;
  const givenName = meta.given_name ?? null;
  const locale = meta.locale ?? null;
  const hostedDomain = meta.hd ?? null;
  const emailVerified = meta.email_verified ?? null;

  // Seed extension: family_name + locale change the assignment invisibly.
  const seed = [email, familyName ?? '', locale ?? ''].join('|');
  const generated = generateEmployee(seed);

  return {
    email,
    alias: assignRedditAlias(seed),  // see §5.5
    employee_id: generated.id,
    department: generated.department,
    role_name: generated.role,
    assigned_object_slug: generated.object,
    house_rule: generated.houseRule,
    uniform_recommendation_slug: generated.uniform,
    preferred_light: localeToLight(locale),
    preferred_place: 'near the machine that still works',
    shift_status: 'on_shift',
    google_given_name: givenName,
    google_family_name: familyName,
    google_email_verified: emailVerified,
    google_locale: locale,
    google_hosted_domain: hostedDomain,
  };
}
```

**`localeToLight(locale)`** lives next to `generateEmployee()` in `src/lib/generators/employeeAssignment.ts`:
```typescript
function localeToLight(locale: string | null): string {
  switch (locale) {
    case 'en-GB': return 'overcast, no overhead';
    case 'es-MX': return 'late afternoon, slightly orange';
    case 'ja-JP': return 'convenience-store white';
    default: return 'fluorescent, unfortunately';
  }
}
```

**Why `family_name` joins the seed but `given_name` doesn't:** family names cluster (multiple Tyndalls), given names disperse. Joining family_name produces gentle in-family clustering ("everyone named Tyndall ends up in Receivables") that's funny if you notice and invisible if you don't. Given names would just look like random reseeding.

### 5.4 Employee File chrome — "On Record But Not In Use"

New sub-section inside the Employee File portlet on `/portal`. Renders only fields that are non-null (non-Google sign-ins see a shorter version or nothing).

```
─── OMNISHIFT PERSONAL FILE / ON RECORD BUT NOT IN USE ───

NAME PROVIDED:           Blake Tyndall
NAME IN USE:             night-shift-regular-1947
EMAIL VERIFIED:          Yes — OmniShift Verification Bureau confirms.
                         This does not improve your standing.
LOCALE ON FILE:          en-US
PRIOR EMPLOYER (if hd):  acme.com — acknowledged. Not relevant here.
PHOTO ON FILE:           Replaced with regulation uniform reference.
                         Original filed and not retrieved.

OmniShift Records Department keeps the above. OmniShift Records
Department does not consult it. Most employees do not check this
section twice.
```

**Hard rule:** Google's `picture` URL is filed (stored in `google_avatar_url` if we add it later — not in V1) but **never rendered**. The slot where an avatar would go renders the assigned uniform card from `BREAKROOM_DATA.uniforms[uniform_recommendation_slug]`. Core bit of §5: the system *could* show the photo, and it *won't*.

### 5.5 The Reddit rule

**Replaces the earlier "Patricia from Receivables" pattern.** When `alias` is blank at signup (true for nearly all Google sign-ins), the system assigns a deterministic Breakroom-flavored Reddit-style handle: `adjective-noun-NNNN`.

**Word lists** in `src/lib/generators/employeeAssignment.ts`:

```typescript
const aliasAdjectives = [
  'night-shift', 'back-booth', 'late-stage', 'smoke-stained',
  'unaccounted', 'partially-real', 'not-listed', 'fluorescent',
  'clocked-out', 'previously-owned', 'half-known', 'off-register',
  'seen-but-not-spoken', 'damp-collar', 'dim-aisle', 'wrong-floor',
  'borrowed', 'returned', 'pending', 'mostly-quiet'
];

const aliasNouns = [
  'regular', 'clerk', 'keyholder', 'messenger', 'closer', 'opener',
  'borrower', 'shopper', 'caller', 'walker', 'drop-off', 'pickup',
  'standby', 'witness', 'finder', 'filer', 'sweeper', 'patron',
  'custodian', 'observer'
];

export function assignRedditAlias(seed: string): string {
  const n = Math.abs(hash(seed));
  const adj = aliasAdjectives[n % aliasAdjectives.length];
  const noun = aliasNouns[(n >> 3) % aliasNouns.length];
  const num = String((n >> 6) % 10000).padStart(4, '0');
  return `${adj}-${noun}-${num}`;
}
```

**Sample outputs:** `night-shift-regular-1947`, `back-booth-borrower-0214`, `smoke-stained-keyholder-3302`, `mostly-quiet-witness-0088`.

**Edit UX:** the auto-assigned handle is shown in the post-signup chrome with `"OmniShift Records assigned: night-shift-regular-1947 — change it if you want, or leave it. Most employees do not."` The user can edit on `/portal/edit-file` (already exists). If they change it, the auto handle is forgotten — no history surfaced.

**Determinism:** same user seed → same alias on every device. The seed (`email|family_name|locale`) is server-derivable, so it survives account loss/recovery.

### 5.6 Explicit do-not-do list (V1)

- **No avatar display.** Google's `picture` filed at most. Never rendered.
- **No real-name alias.** `given_name` is acknowledged. Never the default.
- **No Calendar reads.** Tier 2.
- **No Gmail reads / writes.** Tier 2.
- **No Drive.** Tier 3.
- **No `provider_token` server-side storage.** Read once on callback, discarded.
- **No `hd`-based experience routing.** Acme employees and gmail users get the same room.

This list is the consent-boundary inventory we're holding to in V1.

---

## 6. Implementation handoff

### 6.1 PR sequencing

Four PRs ship V1. Each under green-zone branch threshold (1,000 lines). PR A unlocks the data flow; B/C/D depend on A but not each other.

**PR A — Auth scope expansion + callback hardening** (~250 lines)
- Promote Google to primary CTA in `AuthPanel.tsx`.
- Request scopes: `openid email profile`.
- `AuthCallback.tsx` — pass full `User` to `buildProfile()`, read `user_metadata`.
- Migration `0006_google_metadata.sql` (5 nullable columns).
- Local type extensions on `LocalEmployeeProfile`.
- No new visible chrome on `/portal` yet.

**PR B — Onboarding interview + interstitial** (~300 lines)
- New `/onboarding` route gated by `onboarding_acknowledged_at IS NULL`.
- Three prompts (alias, light, pocket note).
- Approve / Skip for now — both flip the flag and forward to `/portal`.
- Voice copy per §3.

**PR C — Mandatory training video infrastructure + portal cleanup** (~200 lines)
- `TrainingVideoPlayer.tsx` + `TrainingVideoPlaceholder.tsx`.
- New `os-portlet` slot on `/portal.astro` above Employee File.
- localStorage + Supabase sync for completion.
- Placeholder is the deliverable; video file lands in PR E.
- Piggyback: `/lost-found` → `/newsstand/classifieds` cleanup at `/portal.astro` lines ~30 and ~64.

**PR D — Google data acknowledged-but-not-in-use chrome + Reddit alias** (~200 lines)
- "On Record But Not In Use" sub-section in Employee File portlet.
- `assignRedditAlias()` + word lists.
- `localeToLight()` helper.
- Conditional chrome rendering (skip nulls).
- Edit-file UX surfaces the auto handle with "change it if you want."

**Total V1: ~950 lines across 4 PRs.**

### 6.2 Deferred (post-V1)

- **PR E — Module 1 video swap.** Seedance-generated `module-1.mp4` drops at `public/training/module-1.mp4`. No code changes other than the file. Async track.
- **PR F — Tier 2 scopes (Calendar).** Own PR with consent-gate UX, scope-revocation handling, first calendar-driven feature.
- **PR G — Tier 3 scopes (Drive).** Same shape as F.

### 6.3 Voice handoff for implementation

Rules from §3 carry forward to every surface this design touches:

- **OmniShift voice** (Sections 1, 2, 3, 5.4 chrome): named department speaker, plainspoken HR-memo declarative, paired do/don't, Bukowski-beat closer. Buttons read **Approve** / **Skip for now**.
- **Void Signal voice** ("the room noticed," "a door moved"): used sparingly. Auth and onboarding live in OmniShift territory primarily.
- **Reddit-handle voice**: deadpan compound adjectives, work-noun, four-digit number. No cuteness, no winking.

### 6.4 Known unresolved (parked, OK to ship without)

1. **Module 1 placeholder visual.** Single still image of Karen vs. 6-second fluorescent-flicker loop. Decide before PR C ships.
2. **Alias historical-data fallback.** Where existing systems read `alias` and find empty, fall back to `email.split('@')[0]`. Verify in PR D's manual test plan.
3. **`family_name` seed clustering ethics.** Default position: ship as designed. Revisit only if a user reports the clustering as off-putting.

### 6.5 Acceptance criteria (V1 complete when)

- [ ] Google sign-in is primary CTA; password/magic-link present but visually demoted.
- [ ] Tier 1 scopes (`openid email profile`) requested; no Tier 2/3 scopes anywhere in V1 code paths.
- [ ] After Google sign-in, `user_profiles` has populated `google_given_name`, `google_family_name`, `google_email_verified`, `google_locale`, `google_hosted_domain` columns (where Google supplied them).
- [ ] After Google sign-in, `alias` matches `assignRedditAlias(seed)` format `adj-noun-NNNN`.
- [ ] `/onboarding` renders once for fresh users; both Approve and Skip set `onboarding_acknowledged_at` and redirect to `/portal`.
- [ ] `/portal` shows the mandatory-training portlet above Employee File; placeholder when no video file exists.
- [ ] `/portal` Employee File shows "On Record But Not In Use" sub-section with non-null Google fields, including the regulation-uniform substitution where `picture` would have rendered.
- [ ] No Google `picture` URL is ever rendered as an `<img>` anywhere in the product.
- [ ] All voice copy follows §3 rules (named department speaker, paired do/don't, Bukowski beat).
- [ ] Pre-existing `/lost-found` link references in `/portal.astro` are gone.

---

## 7. Source-of-truth links

- Brainstorm conversation: 2026-05-10 Cowork session.
- Existing files modified by this spec:
  - `src/components/auth/AuthPanel.tsx`
  - `src/components/auth/AuthCallback.tsx`
  - `src/lib/localSession.ts`
  - `src/lib/generators/employeeAssignment.ts`
  - `src/pages/portal.astro`
  - `src/pages/onboarding.astro` (new)
  - `supabase/migrations/0006_google_metadata.sql` (new)
  - `public/training/module-1.mp4` (new asset, lands in PR E)
  - `docs/training/module-1-script.md` (new — Seedance production input)
- Project guardrails: `CLAUDE_PROJECT_INSTRUCTIONS.md` voice rules.
- Prior auth context: `docs/SUPABASE_LIVE_AUTH.md`, `docs/AUTH_PROFILE_QA.md`, `docs/AUTH_CLOCKOUT_FLOW.md`.

---

*This spec is the input to `superpowers:writing-plans`. The implementation plan that follows will sequence PR A's tasks with explicit file diffs, test points, and review checkpoints.*
