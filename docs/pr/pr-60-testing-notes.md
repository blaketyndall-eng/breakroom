# PR 60 — Pocket Mode Shell: Testing Notes

## Test Results (localhost:4321/pocket)

### Passing

| Widget | Status | Notes |
|--------|--------|-------|
| Signal Bar | ✅ | Shows 1 BAR → 2 BARS across visits. Status "RELUCTANTLY ONLINE" renders. Engagement tracking works via localStorage. |
| Bump Zone | ✅ | Night Manager observation renders in italic. Day-seeded correctly. |
| Phone Slips | ✅ | Shows "1 SLIP WAITING" on first visit, "NOTHING NEW. THAT'S FINE." after reading. Click navigates to /phone. |
| Quick Actions | ✅ | All 5 buttons render. Get Lost gashapon delay works (200-600ms). Successfully navigated to /ventures. |
| Lot Conditions | ✅ | Full weather data: temp, hoodie, sky, bad decisions, neon, advisory. Real weather via Open-Meteo working (58°F). |
| Radio 1:47 | ✅ (after fix) | Shows seeded broadcast body + host. Links to /radio. |
| Drawer Preview | ✅ | Empty state with correct voice: "Nothing filed yet. Find Stuff. Save it. Pretend that means something." |
| Seen Around | ✅ | Empty state: "Nobody noticed. Or they did and said nothing." |
| Counter | ✅ | "POCKET ACCESS #18565 · CLOCK STUCK AT 1:47" — day-seeded number renders. |
| Footer | ✅ | clock out · full site · sleepnet links present. |
| Mobile Lock | ✅ | max-width: 430px centering works on desktop. |
| Dark Palette | ✅ | #1a1812 bg, warm gold text, monospace typography all correct. |

### Bug Fixed in This PR

**PocketRadioLine field mismatch**: Component read `.content` and `.source` from `RadioEntry`, but the actual type uses `.body` and `.host`. The `source` field is a classification tag (`'seeded' | 'user' | 'agent' | 'system'`), not a display name. Result: radio line showed the literal string "SEEDED" instead of broadcast content. Fixed by mapping to `.body`/`.host`.

---

## Follow-Up PR Improvement Opportunities

### PR 61 candidates (Pocket Polish)

1. **Radio line truncation** — The full radio body can be long (3+ lines). Should truncate to 1-2 lines in Pocket context with ellipsis, showing the full text only on /radio.

2. **Quick Actions grid tightness** — "MAKE ONE THING" wraps to a second row alone. Consider: 3+2 grid, or shorter label ("MAKE" or "CREATE"), or responsive flex-wrap that looks intentional.

3. **Section dividers** — The border between sections is very subtle. Consider adding a thin dashed or dotted rule (old-web receipt style) or slightly more spacing to create visual breathing room.

4. **Slip click feedback** — No visual tap/click feedback on the phone slip card before navigation. A brief press state (opacity change or border flash) would feel more responsive.

5. **Signal bar emoji fallback** — Signal icon uses Unicode block characters which render differently across systems. Consider a small SVG or CSS-only bar chart for consistency.

6. **Pocket-specific `<title>` tag** — Currently shows "Pocket — The Breakroom" which is fine, but could use the daily observation or slip count in the title for browser tab differentiation.

7. **Lot Conditions loading state** — Uses `client:idle`, so there's a brief flash of nothing before conditions appear. A skeleton line ("checking lot...") would smooth the transition.

8. **Radio link cursor** — The radio section is a clickable `<a>` tag but doesn't show pointer cursor explicitly in the pocket CSS context. Should add `cursor: pointer`.

9. **Counter persistence** — The visitor counter is server-seeded but doesn't increment client-side on repeat visits. Could increment via localStorage to feel more alive.

10. **Drawer "open drawer" link** — When items exist, the drawer preview links to `/locker` which may not exist yet. Should verify route exists or add a graceful 404 for Pocket-linked routes.

### PR 62+ candidates (deeper systems)

11. **Slip variety expansion** — Currently 14 seeded slip templates. Could expand to 30+ and add faction-specific slips when Turf system is active.

12. **Time-of-day awareness** — Bump zone observations and signal status could shift based on actual time. Late-night visits get different observations than morning ones.

13. **Haptic feedback** — For mobile PWA context, add `navigator.vibrate()` on Get Lost button press (subtle, single pulse).

14. **Pull-to-refresh** — Natural mobile gesture to regenerate slips / check for new state.

15. **Offline fallback** — Service worker caching for Pocket page so it works without network (all data is localStorage anyway).
