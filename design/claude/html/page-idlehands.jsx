// IDLE HANDS INVITATIONAL — hidden 2003 pool tournament page.
// Reality status: unresolved.

const { useState: useStateIH, useEffect: useEffectIH, useMemo: useMemoIH } = React;

// ============================================================
// DATA
// ============================================================

const IH_PLAYERS = [
  { alias: "Wildman",        hcp: 7, status: "IN",      table: 1, knownFor: "fast breaks, slow apologies", lastSeen: "out front, lighting it twice", obj: "matchbook",       risk: "high",   note: "Wildman owns the break. He doesn't own a watch. He shows up. Sometimes." },
  { alias: "Coffee",         hcp: 6, status: "IN",      table: 2, knownFor: "playing better after the second bad cup", lastSeen: "near the register, arguing with nobody", obj: "coffee mug", risk: "low", note: "Coffee doesn't say much. He just stands there with both hands around the mug like it's keeping him legally alive. Smooth stroke. Bad lungs. If he gets quiet, don't leave him open." },
  { alias: "Nun Dog",        hcp: 4, status: "IN",      table: 3, knownFor: "keeping time incorrectly", lastSeen: "under the clock", obj: "wall clock",      risk: "medium", note: "Nun Dog has been saying the clock is fine since before the clock got bad. Nobody knows why he got the nickname. Nobody asks twice." },
  { alias: "Lefty",          hcp: 5, status: "IN",      table: 3, knownFor: "playing for the rail", lastSeen: "middle stool", obj: "cigar box cash", risk: "low", note: "Lefty hasn't lost a draw shot in eleven years. He has lost his keys six times this month." },
  { alias: "Fast Eddie",     hcp: 5, status: "IN",      table: 4, knownFor: "moving too fast for a man who never arrives early", lastSeen: "outside by the lowrider", obj: "timing slip", risk: "medium", note: "Eddie plays like the shot is chasing him. Sometimes it is." },
  { alias: "Bobby G.",       hcp: 6, status: "IN",      table: 4, knownFor: "funeral suit, casino face", lastSeen: "back booth", obj: "funeral flowers", risk: "high", note: "Bobby G. only shoots in a black suit. Nobody asks who's in the box. Don't bring it up at the rail." },
  { alias: "The Saint",      hcp: 3, status: "UNVERIFIED", table: null, knownFor: "winning while praying", lastSeen: "votive candle, parking lot", obj: "saint card", risk: "low", note: "The Saint plays like he's stalling for someone else's miracle. Quiet. Polite. Beats you anyway." },
  { alias: "Shorty",         hcp: 5, status: "IN",      table: 1, knownFor: "the crooked stool", lastSeen: "booth two", obj: "quarter stack", risk: "medium", note: "Shorty is not short. Don't bring it up." },
  { alias: "T-Bone",         hcp: 6, status: "OUT",     table: null, knownFor: "loud safeties", lastSeen: "the lot, smoking, mid-argument", obj: "ashtray", risk: "high", note: "T-Bone fouls on purpose. Three times. Then wins. Don't ask the math." },
  { alias: "Silver",         hcp: 4, status: "IN",      table: 2, knownFor: "polishing chrome between shots", lastSeen: "bar, end seat", obj: "chrome lighter", risk: "low", note: "Silver wins clean. Loses clean. Tips clean. Don't borrow money." },
  { alias: "The Kid",        hcp: 7, status: "STILL OUT", table: null, knownFor: "showing up at finals time", lastSeen: "▓▓▓▓▓▓", obj: "arcade token", risk: "?", note: "Nobody has ever seen The Kid play a first round. He's only ever in the finals. Reality status: unresolved." },
  { alias: "Mugsy",          hcp: 5, status: "IN",      table: 4, knownFor: "being late", lastSeen: "always pulling in", obj: "red plastic cup", risk: "medium", note: "Mugsy late again. Mugsy late always. Bracket adjusts." },
  { alias: "The Driver",     hcp: 6, status: "IN",      table: 1, knownFor: "leather gloves, cold draw", lastSeen: "lowrider, idling", obj: "olive sword", risk: "high", note: "The Driver does not lose at home. The Driver is always at home. He brought it with him." },
  { alias: "House Money",    hcp: 4, status: "IN",      table: 2, knownFor: "knowing the pot before anyone counts it", lastSeen: "touching the envelope", obj: "cigar box cash", risk: "high", note: "House Money does not play fast, loud, or fair. He plays like he already saw tomorrow's receipt." },
  { alias: "Motel 8",        hcp: 5, status: "IN",      table: 3, knownFor: "winning rooms, not racks", lastSeen: "second-floor balcony", obj: "motel key", risk: "medium", note: "Motel 8 plays like he's already paid for the room and just wants company. Wins enough to keep the receipt." },
  { alias: "Miss September", hcp: null, status: "REGISTERED BY SOMEONE ELSE", table: null, knownFor: "passenger behavior", lastSeen: "riding shotgun", obj: "swan feather", risk: "?", note: "Not registered. Not welcome. Still somehow in the bracket. Passenger Status: Unclear." },
];

const IH_BRACKET_ROUNDS = [
  { name: "R1 WINNERS", matches: [
    { p1: "Wildman", s1: 7, p2: "BYE",          s2: "—", win: "Wildman",     note: "Bye got nervous." },
    { p1: "Slick Rick", s1: 4, p2: "Coffee",     s2: 7,   win: "Coffee",      note: "Won by patience." },
    { p1: "Nun Dog",  s1: 7, p2: "Lefty",        s2: 3,   win: "Nun Dog",     note: "Clock dispute ignored." },
    { p1: "Fast Eddie", s1: 7, p2: "Bobby G.",   s2: 6,   win: "Fast Eddie",  note: "Ride arrived early." },
    { p1: "The Saint", s1: 7, p2: "Shorty",      s2: 5,   win: "The Saint",   note: "Quiet game. Loud candle." },
    { p1: "T-Bone",   s1: 4, p2: "Silver",       s2: 7,   win: "Silver",      note: "Clean run." },
    { p1: "The Kid",  s1: "—", p2: "Mugsy",      s2: "—", win: "PENDING",     note: "Mugsy late again." },
    { p1: "The Driver", s1: 7, p2: "House Money", s2: 6,  win: "The Driver",  note: "Last shot, cleanest." },
  ]},
  { name: "R2 (PENDING)", matches: [
    { p1: "Wildman",  s1: "—", p2: "Coffee",     s2: "—", win: "TBD", note: "Pot updating." },
    { p1: "Nun Dog",  s1: "—", p2: "Fast Eddie", s2: "—", win: "TBD", note: "Table changed →" },
    { p1: "The Saint", s1: "—", p2: "Silver",    s2: "—", win: "TBD", note: "Quiet bracket." },
    { p1: "?",        s1: "—", p2: "The Driver", s2: "—", win: "TBD", note: "Mugsy/Kid winner." },
  ]},
  { name: "CLOCK DISPUTE", matches: [
    { p1: "Nun Dog",  s1: "—", p2: "The Clock",  s2: "—", win: "ONGOING", note: "1:47 AM. No winner reported." },
  ]},
  { name: "FINALS (CONDITIONAL)", matches: [
    { p1: "?", s1: "—", p2: "?", s2: "—", win: "—", note: "Race to 9. If anyone stays." },
  ]},
];

const IH_SCHEDULE = [
  { time: "7:30 PM",  rd: "R1 Winners",   tbl: "1–4", match: "1 vs 16 / 8 vs 9",  status: "Scheduled", note: "Doors open if someone has keys" },
  { time: "8:45 PM",  rd: "R1 Winners",   tbl: "1–4", match: "2 vs 15 / 7 vs 10", status: "Scheduled", note: "Late registration still happening" },
  { time: "10:00 PM", rd: "R2",           tbl: "1–4", match: "Winners advance",   status: "Pending",   note: "Pot updating" },
  { time: "11:30 PM", rd: "R3",           tbl: "1–4", match: "Race to 7",         status: "Pending",   note: "House lights disputed" },
  { time: "1:47 AM",  rd: "Clock Dispute", tbl: "Unknown", match: "Nun Dog vs Time", status: "Ongoing", note: "No winner reported" },
  { time: "3:00 AM",  rd: "Finals",       tbl: "1",   match: "Race to 9",         status: "Conditional", note: "If anyone stays" },
];

const IH_HOUSE_RULES = [
  "House rules apply.",
  "No soft hands.",
  "Call your own fouls.",
  "Scratch on the break equals re-rack.",
  "Three fouls equals loss of game.",
  "No coaching unless we like you.",
  "Respect the table, the players, and the room.",
  "Management decision is final.",
  "If you argue a call, we laugh.",
  "Tip the bartender.",
  "Don't be an ass.",
];

const IH_OBJECTS = {
  "Table Objects": [
    { name: "Cue Chalk (½ block, blue)", id: "LF-0002", status: "Claimed",   icon: "▮▮" },
    { name: "Triangle Rack",             id: "LF-0091", status: "On Table",  icon: "△" },
    { name: "Quarter on Rail",           id: "LF-0114", status: "Saved Spot",icon: "●" },
    { name: "Bar Napkin Score Sheet",    id: "LF-0202", status: "Found",     icon: "▤" },
    { name: "Cracked 8-Ball Keychain",   id: "LF-0309", status: "Held",      icon: "⬤" },
  ],
  "Bar Objects": [
    { name: "Matchbook (Stay Late Lounge)", id: "LF-0041", status: "Unclaimed", icon: "▣" },
    { name: "Ashtray (red olive sword)",    id: "LF-0203", status: "Found",     icon: "✦" },
    { name: "Shot Glass",                   id: "LF-0166", status: "Rinsed",    icon: "▽" },
    { name: "Bar Coaster (broken QR)",      id: "LF-D044", status: "Found",     icon: "▢" },
    { name: "Receipt (no total)",           id: "LF-0037", status: "Found",     icon: "▭" },
    { name: "Cap on Hook",                  id: "LF-SLC-005-A", status: "Removed", icon: "◗" },
  ],
  "Lot Objects": [
    { name: "Motel Key No. 8",         id: "LF-0008", status: "Unclaimed", icon: "▤" },
    { name: "Fuzzy Dice (red)",        id: "LF-0021", status: "Found",     icon: "▦" },
    { name: "Timing Slip",             id: "LF-0055", status: "Found",     icon: "▥" },
    { name: "Glovebox Receipt",        id: "LF-0298", status: "Held",      icon: "▮" },
    { name: "Swan Feather",            id: "LF-0147", status: "Under Review", icon: "❀" },
    { name: "Lowrider Flyer",          id: "LF-0411", status: "Pinned",    icon: "▥" },
  ],
  "Wrong Objects": [
    { name: "Saint Candle",       id: "LF-0500", status: "Lit",      icon: "♰" },
    { name: "Funeral Flowers",    id: "LF-0512", status: "Held",     icon: "✿" },
    { name: "Olive Sword (used)", id: "LF-0203", status: "Found",    icon: "↟" },
    { name: "Powdered Donut Bag", id: "LF-0521", status: "Crumbs",   icon: "○" },
    { name: "Prayer Card",        id: "LF-0533", status: "Tucked",   icon: "✚" },
    { name: "Nun Figurine",       id: "LF-0544", status: "Watching", icon: "♁" },
  ],
  "Digital Objects": [
    { name: "Deleted AIM Away Message",       id: "LF-D101", status: "Recovered", icon: "▶" },
    { name: "Printable Bracket PDF",          id: "LF-D102", status: "Stamped",   icon: "▢" },
    { name: "Archived Guestbook Entry",       id: "LF-D103", status: "Yellowed",  icon: "▬" },
    { name: "Old Player Profile JPEG",        id: "LF-D104", status: "Compressed", icon: "▦" },
    { name: "Corrupted Employee File",        id: "LF-D007", status: "Found",     icon: "▩" },
    { name: "Clock Out Confirmation Screen",  id: "LF-D200", status: "Saved",     icon: "▣" },
  ],
};

const IH_THREADS = [
  { title: "Clock wrong again?", author: "nun_dog", replies: 47, last: "1:47 AM" },
  { title: "Post your alias", author: "house_admin", replies: 213, last: "11:09 PM" },
  { title: "Who put Miss September in the bracket?", author: "anonymous", replies: 88, last: "10:33 PM" },
  { title: "Need ride after finals", author: "the_kid?", replies: 12, last: "03:14 AM" },
  { title: "Best 7/11 after close", author: "fast_eddie", replies: 31, last: "04:33 AM" },
  { title: "Nun Dog owes me $20", author: "lefty",    replies: 6, last: "yesterday" },
  { title: "Table 3 feels tilted", author: "shorty",  replies: 19, last: "01:13 AM" },
  { title: "Anybody else get registered twice?", author: "you?", replies: 1, last: "1 min ago" },
  { title: "Do not trust the finals schedule", author: "house_money", replies: 4, last: "Conditional" },
];

// ============================================================
// PAGE
// ============================================================

function IdleHands({ go, employee }) {
  // visitor counter
  const [visitors] = useStateIH(() => 249673 + Math.floor(Math.random() * 12));
  const [potBase] = useStateIH(320);
  const [tick, setTick] = useStateIH(0);
  useEffectIH(() => {
    const t = setInterval(() => setTick(x => x + 1), 8000);
    return () => clearInterval(t);
  }, []);

  // registered player from localStorage
  const [registered, setRegistered] = useStateIH(() => {
    try { return JSON.parse(localStorage.getItem("ih_registration") || "null"); } catch(e) { return null; }
  });
  const [showAssets, setShowAssets] = useStateIH(false);
  const [openBio, setOpenBio] = useStateIH(null);
  const [showFlyer, setShowFlyer] = useStateIH(false);
  const [secrets, setSecrets] = useStateIH(() => {
    try { return JSON.parse(localStorage.getItem("ih_secrets") || "[]"); } catch(e) { return []; }
  });
  const unlock = (k) => {
    setSecrets(prev => {
      if (prev.includes(k)) return prev;
      const next = [...prev, k];
      localStorage.setItem("ih_secrets", JSON.stringify(next));
      return next;
    });
  };
  const [softHandsClicks, setSoftHandsClicks] = useStateIH(0);
  const [bioViewed, setBioViewed] = useStateIH([]);

  // pot rotates
  const lastUpdaters = ["Nun Dog","Unknown Employee","Room Admin","Coffee","The Kid","Nobody Authorized","Staff Only","The Clock"];
  const lastUpdater = lastUpdaters[tick % lastUpdaters.length];
  const pot = potBase + (tick % 7) * 20;

  const onRegistered = (data) => {
    const aliases = ["Lucky Static","Late Pass","Coffee Adjacent","Booth Three","Bad Lights","Quiet Foul","Room Eight","Idle"];
    const id = "IHI-" + String(147 + (tick % 800)).padStart(4, "0");
    const card = {
      ...data,
      alias: data.alias || aliases[Math.floor(Math.random()*aliases.length)],
      id,
      hcp: 4 + Math.floor(Math.random()*4),
      table: ["Table 3","Table Unknown","Side Bracket","Round 0","Waiting List"][Math.floor(Math.random()*5)],
      status: ["REGISTERED / STILL OUT","REGISTERED / TABLE PENDING","LATE REGISTRATION","REGISTERED BY SOMEONE ELSE"][Math.floor(Math.random()*4)],
      issuedAt: new Date().toLocaleString(),
    };
    setRegistered(card);
    setShowAssets(true);
    localStorage.setItem("ih_registration", JSON.stringify(card));
    if (data.alias && data.alias.toLowerCase().includes("september")) unlock("miss_september_response");
    if (data.obj === "Fuzzy Dice") unlock("the_lot_clue");
    if (data.obj === "Motel Key") unlock("room_8_clue");
    if ((data.note || "").includes("1:47")) unlock("staff_only_teaser");
  };

  return (
    <div data-section="idlehands" style={{
      minHeight: "calc(100vh - 28px)", background: "#e8e3d4",
      fontFamily: "Verdana, Arial, sans-serif", fontSize: 12, color: "#0a1a0a",
      paddingBottom: 60,
    }}>

      {/* ===== TOP UTILITY BAR (dark green) ===== */}
      <div style={{ background: "#0a3010", color: "#c8e6c8", padding: "5px 14px", fontFamily: "Tahoma, sans-serif", fontSize: 11, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ letterSpacing: "0.05em" }}>{"›› BREAKROOM SLEEPERNET TOURNAMENT DIRECTORY ‹‹"}</span>
        <span style={{ display: "flex", gap: 14 }}>
          <span>visitor #<span style={{ color: "#fff" }}>{visitors.toLocaleString().replace(/,/g,"")}</span></span>
          <span>last updated: 05/30/2003 11:47 PM</span>
          <span>clock status: <span style={{ color: "#ffaa6b" }}>disputed</span></span>
        </span>
      </div>

      {/* nav strip */}
      <div style={{ background: "#1a4020", color: "#c8e6c8", padding: "5px 14px", fontFamily: "Tahoma, sans-serif", fontSize: 11, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ display: "flex", gap: 12 }}>
          <a href="#" onClick={(e)=>{e.preventDefault(); go("afterhours");}} style={ihNavLink}>Back to After Hours</a>
          <span>|</span>
          <a href="#" onClick={(e)=>{e.preventDefault(); go("clockout");}} style={{...ihNavLink, color: "#ffaa6b"}}>Clock Out</a>
          <span>|</span>
          <a href="#" onClick={(e)=>{e.preventDefault(); go("lost");}} style={ihNavLink}>Lost &amp; Found</a>
          <span>|</span>
          <a href="#" onClick={(e)=>{e.preventDefault(); go("rack");}} style={ihNavLink}>The Rack</a>
          <span>|</span>
          <a href="#" onClick={(e)=>{e.preventDefault(); go("newsstand");}} style={ihNavLink}>3AM Edition</a>
          <span>|</span>
          <a href="#message-board" style={ihNavLink}>Message Board</a>
          <span>|</span>
          <a href="#" onClick={(e)=>e.preventDefault()} style={ihNavLink}>Breakroom Radio</a>
          <span>|</span>
          <a href="#" onClick={(e)=>e.preventDefault()} style={ihNavLink}>Printer Friendly Version</a>
        </span>
        <span style={{ fontStyle: "italic", color: "#9ac49a" }}>Best viewed after midnight.</span>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 14px" }}>

        {/* ===== HERO BANNER ===== */}
        <IHHero unlock={unlock} />

        {/* ===== EVENT FLYER PANEL ===== */}
        <IHFlyer onPrint={() => setShowFlyer(true)} unlock={unlock} />

        {/* ===== TOURNAMENT STATUS ===== */}
        <IHStatusBox pot={pot} lastUpdater={lastUpdater} />

        {/* ===== BRACKET ===== */}
        <IHBracket unlock={unlock} />

        {/* ===== SCHEDULE ===== */}
        <IHSection title="MATCH SCHEDULE" id="schedule">
          <table style={ihTable}>
            <thead>
              <tr style={ihThRow}>
                <th style={ihTh}>Time</th><th style={ihTh}>Round</th><th style={ihTh}>Tables</th>
                <th style={ihTh}>Matchups</th><th style={ihTh}>Status</th><th style={ihTh}>Note</th>
              </tr>
            </thead>
            <tbody>
              {IH_SCHEDULE.map((s, i) => (
                <tr key={i} style={{ background: i%2 ? "#f7f3e2" : "#fffef8", borderBottom: "1px solid #c4bdac", verticalAlign: "top" }}>
                  <td style={ihTd}><strong>{s.time}</strong></td>
                  <td style={ihTd}>{s.rd}</td>
                  <td style={ihTd}>{s.tbl}</td>
                  <td style={ihTd}>{s.match}</td>
                  <td style={ihTd}><span style={{ color: s.status === "Scheduled" ? "#1a5a35" : s.status === "Pending" ? "#a07000" : s.status === "Ongoing" ? "#a33" : "#5a4a35", fontWeight: "bold" }}>{s.status}</span></td>
                  <td style={{...ihTd, fontStyle: "italic", color: "#5a4a35"}}>{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 10, color: "#5a4a35", marginTop: 6, fontStyle: "italic" }}>All times approximate. The clock has been reported.</div>
        </IHSection>

        {/* ===== ROSTER + BIOS ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 22 }}>
          <IHRoster onOpen={(p) => { setOpenBio(p); setBioViewed(arr => arr.includes(p.alias) ? arr : [...arr, p.alias]); }} />
          <IHRegistration onSubmit={onRegistered} unlock={unlock} />
        </div>

        {/* ===== LIVE RESULTS ===== */}
        <IHLiveResults tick={tick} lastUpdater={lastUpdater} />

        {/* ===== STUFF FROM AROUND THE ROOM ===== */}
        <IHRoomStuff go={go} />

        {/* ===== HOUSE RULES + POT ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginTop: 22 }}>
          <IHHouseRules onSoftHands={() => {
            const next = softHandsClicks + 1;
            setSoftHandsClicks(next);
            if (next >= 3) unlock("house_rules_incident");
          }} softHandsClicks={softHandsClicks} />
          <IHCashPot pot={pot} />
        </div>

        {/* ===== MESSAGE BOARD ===== */}
        <IHMessageBoard registered={!!registered} unlock={unlock} />

        {/* ===== SECRETS BOX ===== */}
        <IHSecretsBox secrets={secrets} bioViewed={bioViewed.length} />

        {/* ===== FOOTER ===== */}
        <IHFooter onCounter={() => unlock("guestbook")} onSource={() => unlock("rogue_source_note")} unlock={unlock} />
      </div>

      {/* ===== MODALS ===== */}
      {openBio && <IHBioModal p={openBio} onClose={() => setOpenBio(null)} go={go} />}
      {showAssets && registered && <IHAssetsModal card={registered} onClose={() => setShowAssets(false)} />}
      {showFlyer && <IHFlyerPrintModal onClose={() => setShowFlyer(false)} />}
    </div>
  );
}

// ============================================================
// HERO
// ============================================================
function IHHero({ unlock }) {
  return (
    <div style={{ marginTop: 14, border: "2px solid #0a1a0a", background: "#1a1a14", color: "#fffef8", padding: 0, position: "relative", overflow: "hidden", boxShadow: "3px 3px 0 #5a4a35" }}>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 180px", minHeight: 220 }}>
        {/* left */}
        <div style={{ background: "linear-gradient(180deg, #1a1a14 0%, #0a0a08 100%)", padding: 14, position: "relative" }}>
          <div style={{ background: "radial-gradient(ellipse at 50% 40%, #ff3030 0%, #a30000 30%, #4a0000 60%, #1a1a14 80%)", height: 100, border: "1px solid #5a4a35", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#ffaa6b", fontSize: 14, letterSpacing: "0.1em", textShadow: "0 0 12px #ff3030" }}>BAR</div>
          <div style={{ marginTop: 8, height: 60, background: "repeating-linear-gradient(180deg, #2a2622 0 2px, #1a1714 2px 4px)", border: "1px solid #5a4a35", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Courier New, monospace", fontSize: 8, color: "#5a4a35", letterSpacing: "0.15em" }}>[POOL LAMP — LOW RES]</div>
          <button onClick={() => unlock("clock_file")} style={{ all: "unset", cursor: "pointer", position: "absolute", top: 8, right: 10, fontSize: 9, color: "#ffaa6b", fontFamily: "Courier New, monospace", letterSpacing: "0.1em", border: "1px solid #ffaa6b", padding: "2px 6px", background: "rgba(0,0,0,0.5)" }}>[1:47]</button>
        </div>
        {/* center */}
        <div style={{ padding: "20px 14px", textAlign: "center", position: "relative" }}>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: 10, color: "#9a8c70", letterSpacing: "0.25em", marginBottom: 4 }}>EST. ALWAYS · CLOSED MOSTLY</div>
          <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 56, fontWeight: "normal", margin: 0, lineHeight: 0.95, color: "#fffef8", letterSpacing: "0.01em", textShadow: "2px 2px 0 #a33, 4px 4px 0 #0a0a08" }}>IDLE HANDS<br/>INVITATIONAL</h1>
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "#c8bfa6", fontSize: 16, marginTop: 6 }}>Old School Pool Tournament Page</div>
          <div style={{ fontFamily: "Verdana, sans-serif", fontSize: 13, color: "#ffaa6b", marginTop: 2, letterSpacing: "0.05em" }}>Race to 7. Cash only. <span style={{ color: "#fffef8", fontWeight: "bold" }}>Clock optional.</span></div>
          <div style={{ position: "absolute", top: 12, left: 14, transform: "rotate(-8deg)", border: "2px solid #ff3030", color: "#ff3030", fontFamily: "Courier New, monospace", fontSize: 10, padding: "2px 8px", letterSpacing: "0.15em", background: "rgba(0,0,0,0.4)" }}>CLOCK OPTIONAL</div>
          <div style={{ position: "absolute", bottom: 8, right: 14, fontFamily: "Caveat, Georgia, serif", color: "#c8e6c8", fontSize: 13, fontStyle: "italic", transform: "rotate(-2deg)" }}>If this page looks old, that's because it is. Or it isn't.</div>
        </div>
        {/* right */}
        <div style={{ background: "linear-gradient(180deg, #0a0a08 0%, #2a1a0a 100%)", padding: 14, position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: 32, height: 32, background: "radial-gradient(circle, #ff3030 0%, #a30000 70%, transparent 100%)" }}></div>
            <div style={{ width: 32, height: 32, background: "radial-gradient(circle, #ff3030 0%, #a30000 70%, transparent 100%)" }}></div>
          </div>
          <div style={{ marginTop: 8, height: 60, background: "repeating-linear-gradient(90deg, #ffaa6b 0 2px, transparent 2px 5px)", border: "1px solid #5a4a35", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Courier New, monospace", fontSize: 9, color: "#1a1a14", letterSpacing: "0.15em", textShadow: "0 0 8px #ffaa6b" }}>MOTEL 8</div>
          <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
            <div style={{ width: 18, height: 18, background: "#a33", borderRadius: "50%", boxShadow: "20px 0 0 #a33" }}></div>
          </div>
          <div style={{ position: "absolute", bottom: 6, right: 10, fontSize: 9, color: "#ffaa6b", fontFamily: "Courier New, monospace", letterSpacing: "0.1em" }}>[FUZZY DICE]</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FLYER
// ============================================================
function IHFlyer({ onPrint, unlock }) {
  return (
    <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "minmax(0, 320px) 1fr", gap: 22, alignItems: "start" }}>
      {/* The flyer */}
      <div style={{ position: "relative", background: "#fdf8e8", border: "1px solid #8a8270", padding: "28px 22px 36px", fontFamily: "Courier New, monospace", color: "#1a1a14", boxShadow: "4px 4px 0 rgba(0,0,0,0.15)", transform: "rotate(-1.2deg)", filter: "contrast(1.1) brightness(0.97)" }}>
        {/* staple */}
        <div style={{ position: "absolute", top: 6, left: 14, width: 14, height: 4, background: "#5a4a35", boxShadow: "0 2px 0 rgba(0,0,0,0.2)" }}></div>
        <div style={{ position: "absolute", top: 6, right: 14, width: 14, height: 4, background: "#5a4a35", boxShadow: "0 2px 0 rgba(0,0,0,0.2)" }}></div>
        {/* coffee ring */}
        <div style={{ position: "absolute", top: -10, right: -20, width: 90, height: 90, border: "8px solid rgba(120, 70, 30, 0.25)", borderRadius: "50%", pointerEvents: "none" }}></div>
        {/* photocopy grain */}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 4px)", pointerEvents: "none" }}></div>

        <div style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.2em", borderBottom: "2px solid #1a1a14", paddingBottom: 6 }}>SATURDAY / DATE PENDING</div>
        <h2 style={{ textAlign: "center", fontSize: 30, margin: "10px 0 4px", fontFamily: "Georgia, serif", fontWeight: "bold", letterSpacing: "0.04em", lineHeight: 0.95 }}>IDLE HANDS<br/>INVITATIONAL</h2>
        <div style={{ textAlign: "center", fontSize: 13, letterSpacing: "0.1em", marginBottom: 10 }}>8-BALL / 9-BALL</div>
        <hr style={{ border: 0, borderTop: "1px dashed #1a1a14", margin: "6px 0" }} />
        <div style={{ fontSize: 13, lineHeight: 1.7, letterSpacing: "0.04em" }}>
          DOORS 7:00 PM<br/>
          ENTRY <span style={{ borderBottom: "2px solid #a33", color: "#a33", fontWeight: "bold" }}>$20 CASH POT</span><br/>
          HOUSE RULES APPLY<br/>
          NO SOFT HANDS<br/>
          CALL YOUR OWN FOULS<br/>
          LATE REGISTRATION ACCEPTED
        </div>
        <hr style={{ border: 0, borderTop: "1px dashed #1a1a14", margin: "10px 0" }} />
        <div style={{ fontSize: 11, letterSpacing: "0.05em" }}>Location: <span style={{ background: "#1a1a14", color: "#1a1a14" }}>disclosed after Clock Out</span></div>
        <div style={{ fontFamily: "Caveat, Georgia, serif", fontStyle: "italic", color: "#a33", fontSize: 16, marginTop: 8, transform: "rotate(-2deg)" }}>Don't ask if it's real. Register or don't.</div>

        {/* red stamp */}
        <div style={{ position: "absolute", top: 20, right: 18, transform: "rotate(7deg)", border: "3px double #a33", color: "#a33", padding: "3px 10px", fontSize: 11, letterSpacing: "0.15em", fontFamily: "Courier New, monospace" }}>CASH ONLY</div>
        {/* tear-off tabs */}
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderTop: "1px dashed #1a1a14" }}>
          {["CALL","REGISTER","FIND THE ROOM","CLOCK OUT","ASK NUN DOG"].map((t, i) => (
            <div key={i} style={{ borderRight: i < 4 ? "1px dashed #1a1a14" : "none", padding: "6px 4px", fontSize: 9, textAlign: "center", letterSpacing: "0.08em", writingMode: "vertical-rl", transform: "rotate(180deg)", height: 70 }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Flyer-side links + status */}
      <div>
        <div style={{ fontFamily: "Tahoma, sans-serif", fontSize: 11, fontWeight: "bold", letterSpacing: "0.05em", color: "#3a3328" }}>EVENT FLYER</div>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "#5a4a35", fontSize: 14, marginTop: 2 }}>Printable. Local. Possibly real.</div>
        <ul style={{ marginTop: 12, paddingLeft: 0, listStyle: "none", lineHeight: 2.1, fontSize: 12 }}>
          <li>📄 <a href="#" onClick={(e)=>{e.preventDefault(); onPrint(); unlock("flyer_pdf_code");}} style={ihLink}>Download Printable Flyer (PDF)</a></li>
          <li>📌 <a href="#" onClick={(e)=>e.preventDefault()} style={ihLink}>Post This Somewhere Badly Lit</a></li>
          <li>✉ <a href="#" onClick={(e)=>e.preventDefault()} style={ihLink}>Email Flyer to Somebody Awake</a></li>
          <li>🔗 <a href="#" onClick={(e)=>e.preventDefault()} style={ihLink}>Tape To A Telephone Pole</a></li>
        </ul>
        <div style={{ marginTop: 14, padding: 10, background: "#fff5d8", border: "1px dashed #a07000", fontSize: 11, color: "#5a4a35", fontFamily: "Georgia, serif", fontStyle: "italic" }}>↪ "Make 5 copies. Lose 4. Tape the last one upside down."</div>
        <div style={{ marginTop: 10, fontSize: 11, color: "#3a3328", fontFamily: "Verdana, sans-serif" }}>
          <div><strong>Format:</strong> 8-Ball single elimination → 9-Ball winners only</div>
          <div><strong>Brackets:</strong> 16 announced, 19 actual</div>
          <div><strong>Tournament Director:</strong> Nun Dog (sometimes)</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STATUS BOX
// ============================================================
function IHStatusBox({ pot, lastUpdater }) {
  const rows = [
    ["Reality Status", <span style={{ color: "#a07000", fontWeight: "bold" }}>Both / Pending</span>],
    ["Registration", <span style={{ color: "#1a5a35", fontWeight: "bold" }}>Open</span>],
    ["Location", "Not publicly posted"],
    ["Clock", <span style={{ color: "#a33" }}>Wrong</span>],
    ["Cash Pot", <span style={{ fontFamily: "Courier New, monospace" }}>${pot}.00 (updating)</span>],
    ["Current Issue", "After Hours"],
    ["Next Update", `When ${lastUpdater} remembers`],
    ["Last Verified", "Unhelpful"],
    ["OmniShift Approval", <span style={{ color: "#a33" }}>Not requested</span>],
  ];
  return (
    <div style={{ marginTop: 22, border: "1px solid #0a3010", background: "#fffef8" }}>
      <div style={{ background: "#0a3010", color: "#c8e6c8", padding: "5px 12px", fontFamily: "Tahoma, sans-serif", fontSize: 12, letterSpacing: "0.1em", fontWeight: "bold" }}>TOURNAMENT STATUS</div>
      <div style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", fontSize: 12 }}>
        {rows.map(([k, v], i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr", borderBottom: "1px dotted #c4bdac", padding: "4px 0" }}>
            <span style={{ color: "#5a4a35" }}>{k}:</span><span>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #c4bdac", padding: "8px 12px", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#3a3328", fontSize: 13 }}>
        Nobody is confirming whether this happened, is happening, or is waiting for enough people to act normal.
      </div>
      <div style={{ background: "#ebe5d4", padding: "5px 12px", fontFamily: "Caveat, Georgia, serif", color: "#a33", fontSize: 14 }}>↪ If management asks, this is a flyer archive.</div>
    </div>
  );
}

// ============================================================
// BRACKET
// ============================================================
function IHBracket({ unlock }) {
  return (
    <IHSection title="TOURNAMENT BRACKET" id="bracket" right={<a href="#" onClick={(e)=>e.preventDefault()} style={ihLink}>View Full Size Bracket</a>}>
      <div style={{ position: "relative", background: "repeating-linear-gradient(0deg, #fffef8 0 22px, #fbf6e3 22px 23px)", border: "1px solid #c4bdac", padding: "12px 14px" }}>
        {/* coffee ring overlay */}
        <div style={{ position: "absolute", top: 60, right: 80, width: 100, height: 100, border: "10px solid rgba(120, 70, 30, 0.18)", borderRadius: "50%", pointerEvents: "none" }}></div>
        {/* glass ring */}
        <div style={{ position: "absolute", bottom: 30, left: 200, width: 70, height: 70, border: "5px solid rgba(120, 70, 30, 0.12)", borderRadius: "50%", pointerEvents: "none" }}></div>
        {/* tape */}
        <div style={{ position: "absolute", top: -6, left: 60, width: 80, height: 18, background: "rgba(255,250,210,0.7)", border: "1px solid rgba(120,90,60,0.3)", transform: "rotate(-3deg)" }}></div>
        {/* swan doodle */}
        <button onClick={() => unlock("phone_miss_september")} style={{ all: "unset", cursor: "pointer", position: "absolute", bottom: 40, right: 30, fontFamily: "Caveat, Georgia, serif", color: "#1f4cc4", fontSize: 28, transform: "rotate(-8deg)", textShadow: "0 0 6px rgba(255,255,255,0.6)" }} title="?">~&gt;</button>
        {/* gold star sticker */}
        <div style={{ position: "absolute", top: 30, left: 380, fontSize: 22, transform: "rotate(12deg)" }}>★</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {IH_BRACKET_ROUNDS.map((r, ri) => (
            <div key={ri}>
              <div style={{ background: "#0a3010", color: "#c8e6c8", padding: "3px 8px", fontFamily: "Tahoma, sans-serif", fontSize: 10, letterSpacing: "0.1em", textAlign: "center" }}>{r.name}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                {r.matches.map((m, mi) => (
                  <div key={mi} style={{ background: "#fffef8", border: "1px solid #c4bdac", padding: "4px 6px", fontSize: 10, fontFamily: "Verdana, sans-serif", lineHeight: 1.4, position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted #c4bdac", padding: "1px 0" }}>
                      <span style={{ fontWeight: m.win === m.p1 ? "bold" : "normal", color: m.win === m.p1 ? "#0a3010" : "#1a1a14" }}>{m.p1}</span>
                      <span style={{ fontFamily: "Courier New, monospace", color: "#5a4a35" }}>{m.s1}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "1px 0" }}>
                      <span style={{ fontWeight: m.win === m.p2 ? "bold" : "normal", color: m.win === m.p2 ? "#0a3010" : "#1a1a14" }}>{m.p2}</span>
                      <span style={{ fontFamily: "Courier New, monospace", color: "#5a4a35" }}>{m.s2}</span>
                    </div>
                    {m.note && <div style={{ fontSize: 9, fontStyle: "italic", color: "#a33", marginTop: 2 }}>{m.note}</div>}
                    {m.p2 === "BYE" && <div style={{ position: "absolute", top: -2, right: 4, fontFamily: "Caveat, Georgia, serif", color: "#a33", fontSize: 14, transform: "rotate(-6deg)" }}>BYE</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: "#5a4a35", fontFamily: "Caveat, Georgia, serif", fontSize: 14, transform: "rotate(-1deg)", display: "inline-block" }}>↪ Mugsy late again. table changed →</div>
      </div>
    </IHSection>
  );
}

// ============================================================
// SECTION HELPER
// ============================================================
function IHSection({ title, id, right, children }) {
  return (
    <div id={id} style={{ marginTop: 22 }}>
      <div style={{ background: "#0a3010", color: "#c8e6c8", padding: "6px 12px", fontFamily: "Tahoma, sans-serif", fontSize: 13, letterSpacing: "0.1em", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{title}</span>
        {right}
      </div>
      <div style={{ background: "#fffef8", border: "1px solid #0a3010", borderTop: "none", padding: 12 }}>{children}</div>
    </div>
  );
}

// ============================================================
// ROSTER
// ============================================================
function IHRoster({ onOpen }) {
  return (
    <div>
      <div style={{ background: "#0a3010", color: "#c8e6c8", padding: "6px 12px", fontFamily: "Tahoma, sans-serif", fontSize: 13, letterSpacing: "0.1em", fontWeight: "bold" }}>PLAYER ROSTER</div>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #0a3010", borderTop: "none", background: "#fffef8" }}>
        <thead>
          <tr style={ihThRow}><th style={ihTh}>Alias</th><th style={ihTh}>HCP</th><th style={ihTh}>Status</th><th style={ihTh}>Bio</th></tr>
        </thead>
        <tbody>
          {IH_PLAYERS.map((p, i) => (
            <tr key={p.alias} style={{ background: i%2 ? "#f7f3e2" : "#fffef8", borderBottom: "1px solid #c4bdac" }}>
              <td style={ihTd}><a href="#" onClick={(e)=>{e.preventDefault(); onOpen(p);}} style={ihLink}><strong>{p.alias}</strong></a></td>
              <td style={{...ihTd, fontFamily: "Courier New, monospace"}}>{p.hcp ?? "—"}</td>
              <td style={{...ihTd, fontSize: 10, fontFamily: "Courier New, monospace", color: p.status === "OUT" || p.status.includes("STILL") ? "#a33" : p.status === "UNVERIFIED" ? "#a07000" : p.status === "REGISTERED BY SOMEONE ELSE" ? "#1f4cc4" : "#1a5a35", fontWeight: "bold"}}>{p.status}</td>
              <td style={ihTd}><a href="#" onClick={(e)=>{e.preventDefault(); onOpen(p);}} style={ihLink}>open</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 6, fontSize: 11, color: "#5a4a35", fontStyle: "italic", fontFamily: "Georgia, serif" }}>Roster updated manually. Some aliases may be legal names. We don't ask.</div>
    </div>
  );
}

// ============================================================
// REGISTRATION FORM
// ============================================================
function IHRegistration({ onSubmit, unlock }) {
  const [f, setF] = useStateIH({ alias: "", email: "", phone: "", aim: "", light: "fluorescent", obj: "Motel Key", breakStyle: "dry break", confidence: "low", game: "8-Ball", note: "" });
  const upd = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    onSubmit(f);
  };
  return (
    <div>
      <div style={{ background: "#0a3010", color: "#c8e6c8", padding: "6px 12px", fontFamily: "Tahoma, sans-serif", fontSize: 13, letterSpacing: "0.1em", fontWeight: "bold" }}>PLAYER REGISTRATION FORM</div>
      <form onSubmit={submit} style={{ background: "#fffef8", border: "1px solid #0a3010", borderTop: "none", padding: 14, fontSize: 11, color: "#1a1a14" }}>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 13, marginBottom: 10, color: "#5a4a35" }}>Print, fill out, bring it, or submit below if the room allows.</div>
        <FormR label="Player Alias"><input value={f.alias} onChange={e=>upd("alias", e.target.value)} style={ihInput} placeholder="Lucky Static" required /></FormR>
        <FormR label="Email"><input type="email" value={f.email} onChange={e=>upd("email", e.target.value)} style={ihInput} required /></FormR>
        <FormR label="Phone / Pager (opt.)"><input value={f.phone} onChange={e=>upd("phone", e.target.value)} style={ihInput} /></FormR>
        <FormR label="AIM / ICQ (opt.)"><input value={f.aim} onChange={e=>upd("aim", e.target.value)} style={ihInput} placeholder="LateNiteCue4" /></FormR>
        <FormR label="Preferred Light"><select value={f.light} onChange={e=>upd("light", e.target.value)} style={ihSelect}><option>fluorescent</option><option>neon</option><option>dashboard</option><option>motel</option><option>cigarette</option></select></FormR>
        <FormR label="Preferred Object"><select value={f.obj} onChange={e=>upd("obj", e.target.value)} style={ihSelect}><option>Motel Key</option><option>Fuzzy Dice</option><option>Coffee Mug</option><option>Cue Chalk</option><option>Timing Slip</option><option>Matchbook</option><option>Swan Feather</option></select></FormR>
        <FormR label="Break Style"><select value={f.breakStyle} onChange={e=>upd("breakStyle", e.target.value)} style={ihSelect}><option>dry break</option><option>reckless break</option><option>quiet break</option><option>no preference</option></select></FormR>
        <FormR label="Confidence"><select value={f.confidence} onChange={e=>upd("confidence", e.target.value)} style={ihSelect}><option>low</option><option>misplaced</option><option>dangerous</option><option>unknowable</option></select></FormR>
        <FormR label="Game"><select value={f.game} onChange={e=>upd("game", e.target.value)} style={ihSelect}><option>8-Ball</option><option>9-Ball</option><option>whichever table opens</option></select></FormR>
        <FormR label="Anything else?"><textarea value={f.note} onChange={e=>upd("note", e.target.value)} style={{...ihInput, minHeight: 50}} placeholder="optional note. type 1:47 to see what happens." /></FormR>
        <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
          <button type="submit" style={ihBtn}>Submit Registration</button>
          <button type="button" style={ihBtn} onClick={()=>window.print()}>Print Form</button>
          <button type="reset" style={ihBtn} onClick={()=>setF({ alias: "", email: "", phone: "", aim: "", light: "fluorescent", obj: "Motel Key", breakStyle: "dry break", confidence: "low", game: "8-Ball", note: "" })}>Reset</button>
        </div>
        <div style={{ marginTop: 8, fontSize: 10, fontStyle: "italic", color: "#5a4a35", fontFamily: "Georgia, serif" }}>Entry fee: $20 cash. No checks. Pay at the door if the door exists.</div>
      </form>
    </div>
  );
}
function FormR({ label, children }) {
  return (
    <label style={{ display: "grid", gridTemplateColumns: "130px 1fr", alignItems: "center", gap: 6, marginBottom: 5 }}>
      <span style={{ color: "#3a3328" }}>{label}:</span>{children}
    </label>
  );
}

// ============================================================
// LIVE RESULTS
// ============================================================
function IHLiveResults({ tick, lastUpdater }) {
  const variants = [
    { p1: "Wildman", s1: 7, p2: "BYE", s2: "—", win: "Wildman", tbl: 1, note: "Bye got nervous" },
    { p1: "Slick Rick", s1: 4, p2: "Coffee", s2: 7, win: "Coffee", tbl: 2, note: "Won by patience" },
    { p1: "Nun Dog", s1: 7, p2: "Lefty", s2: 3, win: "Nun Dog", tbl: 3, note: "Clock dispute ignored" },
    { p1: "Fast Eddie", s1: 7, p2: "Bobby G.", s2: 6, win: "Fast Eddie", tbl: 4, note: "Ride arrived early" },
    { p1: "The Saint", s1: 7, p2: "Shorty", s2: 5, win: "The Saint", tbl: 1, note: "Quiet game" },
    { p1: "Silver", s1: 7, p2: "T-Bone", s2: 4, win: "Silver", tbl: 2, note: "Clean run" },
    { p1: "The Driver", s1: 7, p2: "House Money", s2: 6, win: "The Driver", tbl: 1, note: "Late safety, then run" },
    { p1: "The Kid", s1: "?", p2: "Mugsy", s2: "?", win: tick % 2 ? "PENDING" : "?", tbl: "?", note: "Mugsy late again" },
  ];
  return (
    <IHSection title="LIVE RESULTS" id="live" right={<span style={{ fontSize: 10, color: "#c8e6c8", fontStyle: "italic" }}>Updated throughout the night, allegedly.</span>}>
      <table style={ihTable}>
        <thead>
          <tr style={ihThRow}>
            <th style={ihTh}>Round</th>
            <th style={ihTh}>Player 1</th>
            <th style={ihTh}>S</th>
            <th style={ihTh}>Player 2</th>
            <th style={ihTh}>S</th>
            <th style={ihTh}>Winner</th>
            <th style={ihTh}>Table</th>
            <th style={ihTh}>Note</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v, i) => (
            <tr key={i} style={{ background: i%2 ? "#f7f3e2" : "#fffef8", borderBottom: "1px solid #c4bdac" }}>
              <td style={ihTd}>R1</td>
              <td style={ihTd}>{v.p1}</td>
              <td style={{...ihTd, fontFamily: "Courier New, monospace"}}>{v.s1}</td>
              <td style={ihTd}>{v.p2}</td>
              <td style={{...ihTd, fontFamily: "Courier New, monospace"}}>{v.s2}</td>
              <td style={{...ihTd, fontWeight: "bold", color: v.win === "?" || v.win === "PENDING" ? "#a07000" : "#0a3010"}}>{v.win}</td>
              <td style={ihTd}>{v.tbl}</td>
              <td style={{...ihTd, fontStyle: "italic", color: "#5a4a35"}}>{v.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 6, fontSize: 11, color: "#5a4a35", fontFamily: "Courier New, monospace" }}>Last updated by: <strong>{lastUpdater}</strong></div>
    </IHSection>
  );
}

// ============================================================
// ROOM STUFF
// ============================================================
function IHRoomStuff({ go }) {
  return (
    <IHSection title="STUFF FROM AROUND THE ROOM" id="room-stuff" right={<a href="#" onClick={(e)=>{e.preventDefault(); go("lost");}} style={{...ihLink, color: "#c8e6c8"}}>View More Room Evidence</a>}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
        {Object.entries(IH_OBJECTS).map(([cat, items]) => (
          <div key={cat} style={{ border: "1px solid #c4bdac", background: "#faf7ec", padding: 8 }}>
            <div style={{ fontFamily: "Tahoma, sans-serif", fontSize: 10, letterSpacing: "0.1em", color: "#3a3328", fontWeight: "bold", borderBottom: "1px solid #c4bdac", paddingBottom: 3, marginBottom: 5 }}>{cat.toUpperCase()}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 11, lineHeight: 1.7 }}>
              {items.map(it => (
                <li key={it.id} style={{ display: "grid", gridTemplateColumns: "20px 1fr auto", gap: 4, alignItems: "center" }}>
                  <span style={{ width: 16, height: 16, background: "#1a1a14", color: "#9a8c70", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>{it.icon}</span>
                  <a href="#" onClick={(e)=>{e.preventDefault(); go("lost");}} style={ihLink}>{it.name}</a>
                  <span style={{ fontSize: 9, fontFamily: "Courier New, monospace", color: "#5a4a35" }}>{it.id}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </IHSection>
  );
}

// ============================================================
// HOUSE RULES
// ============================================================
function IHHouseRules({ onSoftHands, softHandsClicks }) {
  return (
    <div>
      <div style={{ background: "#0a3010", color: "#c8e6c8", padding: "6px 12px", fontFamily: "Tahoma, sans-serif", fontSize: 13, letterSpacing: "0.1em", fontWeight: "bold" }}>HOUSE RULES / NOT UP FOR DISCUSSION</div>
      <div style={{ background: "#fffef8", border: "1px solid #0a3010", borderTop: "none", padding: 14 }}>
        <ol style={{ margin: 0, paddingLeft: 22, fontSize: 12, lineHeight: 1.85 }}>
          {IH_HOUSE_RULES.map((r, i) => (
            <li key={i}>{r.toLowerCase().includes("no soft hands") ? <button onClick={onSoftHands} style={{ all: "unset", cursor: "pointer", fontWeight: "bold" }}>{r}</button> : r}</li>
          ))}
        </ol>
        <div style={{ marginTop: 10, fontFamily: "Georgia, serif", fontStyle: "italic", color: "#a33", fontSize: 13 }}>If you need clarification, you already lost.</div>
        <div style={{ marginTop: 8, fontSize: 11 }}><a href="#" onClick={(e)=>e.preventDefault()} style={ihLink}>📄 Printable Rules PDF</a></div>
        {softHandsClicks > 0 && softHandsClicks < 3 && <div style={{ marginTop: 6, fontSize: 10, fontFamily: "Courier New, monospace", color: "#5a4a35" }}>warning logged ({softHandsClicks}/3)</div>}
        {softHandsClicks >= 3 && <div style={{ marginTop: 6, fontSize: 11, fontFamily: "Caveat, Georgia, serif", color: "#a33", fontSize: 14 }}>↪ Incident report filed. We'll discuss it never.</div>}
      </div>
    </div>
  );
}

// ============================================================
// CASH POT
// ============================================================
function IHCashPot({ pot }) {
  return (
    <div>
      <div style={{ background: "#0a3010", color: "#c8e6c8", padding: "6px 12px", fontFamily: "Tahoma, sans-serif", fontSize: 13, letterSpacing: "0.1em", fontWeight: "bold" }}>ABOUT THE POT</div>
      <div style={{ background: "#fffef8", border: "1px solid #0a3010", borderTop: "none", padding: 14, fontSize: 12 }}>
        <p style={{ margin: 0, lineHeight: 1.5 }}>100% of entry fees go in the pot.<br/>Current pot shown on the board.<br/>No rake. No BS.</p>
        {/* Cigar box */}
        <div style={{ marginTop: 12, background: "linear-gradient(180deg, #5a3818 0%, #3a2410 100%)", border: "2px solid #1a1a14", padding: "16px 12px", textAlign: "center", color: "#fff5d8", boxShadow: "3px 3px 0 #c4bdac" }}>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: 9, letterSpacing: "0.2em", color: "#c8a070" }}>CURRENT POT</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: "bold", marginTop: 2, textShadow: "1px 1px 0 #1a1a14" }}>${pot}.00</div>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: 9, color: "#c8a070", marginTop: 4, letterSpacing: "0.1em" }}>cigar box · rubber band · gold pen</div>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, lineHeight: 1.8 }}>
          <div><strong>1st Place:</strong> 60% &nbsp;·&nbsp; <strong>2nd:</strong> 25% &nbsp;·&nbsp; <strong>3rd:</strong> 15%</div>
          <div><strong>Bragging Rights:</strong> <a href="#" onClick={(e)=>e.preventDefault()} style={ihLink}>Priceless</a></div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MESSAGE BOARD
// ============================================================
function IHMessageBoard({ registered, unlock }) {
  return (
    <IHSection title="MESSAGE BOARD" id="message-board" right={<a href="#" onClick={(e)=>{e.preventDefault(); if (!registered) return; unlock("back_booth_forum");}} style={{...ihLink, color: registered ? "#c8e6c8" : "#5a8a5a", textDecoration: registered ? "underline" : "line-through"}}>{registered ? "Open Back Booth Forum" : "Open Back Booth Forum (registered only)"}</a>}>
      <table style={{...ihTable}}>
        <thead>
          <tr style={ihThRow}>
            <th style={ihTh}>Thread</th>
            <th style={{...ihTh, width: 120}}>Started By</th>
            <th style={{...ihTh, width: 70, textAlign: "right"}}>Replies</th>
            <th style={{...ihTh, width: 110}}>Last Post</th>
          </tr>
        </thead>
        <tbody>
          {IH_THREADS.map((t, i) => (
            <tr key={i} style={{ background: i%2 ? "#f7f3e2" : "#fffef8", borderBottom: "1px solid #c4bdac" }}>
              <td style={ihTd}><a href="#" onClick={(e)=>e.preventDefault()} style={ihLink}>{t.title}</a></td>
              <td style={{...ihTd, fontFamily: "Courier New, monospace", color: "#5a4a35"}}>{t.author}</td>
              <td style={{...ihTd, textAlign: "right", fontFamily: "Courier New, monospace"}}>{t.replies}</td>
              <td style={{...ihTd, fontFamily: "Courier New, monospace", color: "#5a4a35"}}>{t.last}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </IHSection>
  );
}

// ============================================================
// SECRETS BOX
// ============================================================
function IHSecretsBox({ secrets, bioViewed }) {
  const all = [
    { k: "clock_file", label: "Click the wall clock (1:47) → Clock File" },
    { k: "the_lot_clue", label: "Register with Fuzzy Dice → The Lot clue" },
    { k: "room_8_clue", label: "Register with Motel Key → Room 8 clue" },
    { k: "phone_miss_september", label: "Click the swan doodle in bracket → Phone msg" },
    { k: "miss_september_response", label: "Register as Miss September → special response" },
    { k: "house_rules_incident", label: "Click \"No soft hands\" three times → incident report" },
    { k: "back_booth_forum", label: "Bragging Rights: Priceless (after register) → Back Booth Forum" },
    { k: "guestbook", label: "Click visitor counter → old guestbook" },
    { k: "rogue_source_note", label: "Click \"View Source\" in footer → rogue employee note" },
    { k: "flyer_pdf_code", label: "Download printable flyer → hidden code in PDF" },
    { k: "staff_only_teaser", label: "Submit \"1:47\" in registration note → Staff Only teaser" },
  ];
  if (bioViewed >= 3) {
    if (!secrets.includes("regulars_note")) secrets = [...secrets, "regulars_note"];
  }
  return (
    <div style={{ marginTop: 22, border: "1px dashed #0a3010", background: "rgba(10, 48, 16, 0.04)", padding: "10px 14px" }}>
      <div style={{ fontFamily: "Tahoma, sans-serif", fontSize: 11, letterSpacing: "0.1em", fontWeight: "bold", color: "#0a3010" }}>SECRETS &amp; HIDDEN TRIGGERS · {secrets.length}/{all.length} found</div>
      <ul style={{ marginTop: 8, paddingLeft: 22, fontSize: 11, lineHeight: 1.8 }}>
        {all.map(s => (
          <li key={s.k} style={{ color: secrets.includes(s.k) ? "#0a3010" : "#5a4a35", textDecoration: secrets.includes(s.k) ? "none" : "none" }}>
            {secrets.includes(s.k) ? <strong>✓ {s.label}</strong> : <span style={{ filter: "blur(0.3px)" }}>○ {s.label.replace(/→.*$/, "→ ▓▓▓▓▓▓▓▓")}</span>}
          </li>
        ))}
      </ul>
      {bioViewed >= 3 && <div style={{ marginTop: 6, fontSize: 11, fontFamily: "Caveat, Georgia, serif", fontSize: 14, color: "#a33" }}>↪ Regular's Note unlocked. You've been at the rail long enough.</div>}
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function IHFooter({ onCounter, onSource }) {
  return (
    <div style={{ marginTop: 28, borderTop: "2px solid #0a3010", padding: "16px 0", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", fontSize: 11, fontFamily: "Tahoma, sans-serif" }}>
        <a href="#" onClick={(e)=>e.preventDefault()} style={ihLink}>Printer Friendly Version</a>·
        <a href="#" onClick={(e)=>e.preventDefault()} style={ihLink}>Email This Page</a>·
        <a href="#" onClick={(e)=>e.preventDefault()} style={ihLink}>Add to Favorites</a>·
        <a href="#" style={ihLink}>Back to Top</a>·
        <a href="#" onClick={(e)=>{e.preventDefault(); onSource();}} style={ihLink}>View Source</a>·
        <a href="#" onClick={(e)=>{e.preventDefault(); onCounter();}} style={ihLink}>Guestbook</a>·
        <a href="#" onClick={(e)=>e.preventDefault()} style={ihLink}>Web Ring</a>·
        <a href="#" onClick={(e)=>e.preventDefault()} style={ihLink}>Best Viewed With Internet Explorer</a>
      </div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={onCounter} style={{ all: "unset", cursor: "pointer", background: "#000", color: "#7fff7f", padding: "4px 8px", fontFamily: "Courier New, monospace", fontSize: 11, letterSpacing: "0.1em", border: "2px inset #5a4a35" }}>visitor #00249673</button>
        <span style={{ background: "#1a4080", color: "#fff", padding: "4px 8px", fontSize: 9, fontFamily: "Tahoma, sans-serif", letterSpacing: "0.05em" }}>BEST VIEWED WITH IE 5.5</span>
        <span style={{ background: "#a33", color: "#fff", padding: "4px 8px", fontSize: 9, fontFamily: "Tahoma, sans-serif", letterSpacing: "0.05em" }}>NETSCAPE NOW</span>
        <span style={{ fontFamily: "Courier New, monospace", fontSize: 10, color: "#5a4a35" }}>[matchbook] [crushed cig] [bar tab]</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 11, color: "#5a4a35", fontFamily: "Verdana, sans-serif" }}>
        Last updated: 05/30/2003 11:47 PM by Nun Dog<br/>
        Tournament reality status: <em>unresolved.</em>
      </div>
      <div style={{ marginTop: 8, fontFamily: "Caveat, Georgia, serif", fontSize: 14, color: "#a33", fontStyle: "italic" }}>↪ If you're still here, check the clock.</div>
    </div>
  );
}

// ============================================================
// BIO MODAL
// ============================================================
function IHBioModal({ p, onClose, go }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9500, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 30, overflow: "auto" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background: "#fffef8", border: "2px solid #0a3010", boxShadow: "6px 6px 0 rgba(0,0,0,0.3)", width: "min(620px, 100%)", fontFamily: "Verdana, sans-serif", fontSize: 12, color: "#1a1a14" }}>
        <div style={{ background: "#0a3010", color: "#c8e6c8", padding: "5px 12px", fontSize: 11, display: "flex", justifyContent: "space-between" }}>
          <span>PLAYER BIO · {p.alias}</span>
          <button onClick={onClose} style={{...ihBtn, fontSize: 10, padding: "1px 8px"}}>[X] Close</button>
        </div>
        <div style={{ padding: 18, display: "grid", gridTemplateColumns: "120px 1fr", gap: 16 }}>
          <div style={{ width: 120, height: 120, background: "repeating-linear-gradient(45deg, #d8d2c4 0 8px, #c4bdac 8px 16px)", border: "1px solid #8a8270", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Courier New, monospace", fontSize: 9, color: "#5a4a35", textAlign: "center", padding: 6 }}>[{p.alias.toUpperCase()}]</div>
          <div>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 26, fontWeight: "normal", margin: 0 }}>{p.alias}</h2>
            <table style={{ width: "100%", marginTop: 8, borderCollapse: "collapse", fontSize: 11 }}>
              <tbody>
                <BMeta k="Handicap" v={p.hcp ?? "N/A"} />
                <BMeta k="Status" v={p.status} />
                <BMeta k="Known For" v={p.knownFor} />
                <BMeta k="Last Seen" v={p.lastSeen} />
                <BMeta k="Signature Object" v={<a href="#" onClick={(e)=>{e.preventDefault(); go("lost");}} style={ihLink}>{p.obj}</a>} />
                <BMeta k="Risk" v={p.risk} />
                <BMeta k="Table" v={p.table || "—"} />
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ padding: "0 18px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: "bold", borderBottom: "1px solid #c4bdac", paddingBottom: 2 }}>REGULAR'S NOTE</div>
          <p style={{ margin: "8px 0", lineHeight: 1.6, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 14, color: "#1a1a14" }}>↪ {p.note}</p>
        </div>
        <div style={{ background: "#ebe5d4", padding: "6px 14px", fontSize: 10, fontFamily: "Courier New, monospace", color: "#5a4a35", display: "flex", justifyContent: "space-between" }}>
          <span><a href="#" onClick={(e)=>{e.preventDefault(); go("lost");}} style={ihLink}>Open Lost &amp; Found Object</a> · <a href="#" onClick={(e)=>{e.preventDefault(); go("newsstand");}} style={ihLink}>Related Headline</a></span>
          <span>Bio entry: manual.</span>
        </div>
      </div>
    </div>
  );
}
function BMeta({ k, v }) {
  return (<tr><td style={{ padding: "2px 8px 2px 0", color: "#5a4a35", verticalAlign: "top", width: 130, borderBottom: "1px dotted #c4bdac" }}>{k}:</td><td style={{ padding: "2px 0", borderBottom: "1px dotted #c4bdac" }}>{v}</td></tr>);
}

// ============================================================
// ASSETS MODAL
// ============================================================
function IHAssetsModal({ card, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9500, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 30, overflow: "auto" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background: "#fffef8", border: "2px solid #0a3010", boxShadow: "6px 6px 0 rgba(0,0,0,0.3)", width: "min(880px, 100%)", fontFamily: "Verdana, sans-serif", fontSize: 12, color: "#1a1a14" }}>
        <div style={{ background: "#0a3010", color: "#c8e6c8", padding: "6px 12px", fontSize: 12, display: "flex", justifyContent: "space-between", letterSpacing: "0.1em", fontWeight: "bold" }}>
          <span>REGISTRATION COMPLETE · DOWNLOAD YOUR ASSETS</span>
          <button onClick={onClose} style={{...ihBtn, fontSize: 10, padding: "1px 8px"}}>[X] Close</button>
        </div>
        <div style={{ padding: 22 }}>
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "#5a4a35", fontSize: 14 }}>Welcome to the bracket. Probably.</div>

          {/* Player Card */}
          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: "linear-gradient(180deg, #1a1a14 0%, #0a3010 100%)", color: "#fffef8", border: "2px solid #0a3010", padding: 16, position: "relative", boxShadow: "3px 3px 0 #c4bdac" }}>
              <div style={{ fontFamily: "Courier New, monospace", fontSize: 9, color: "#c8e6c8", letterSpacing: "0.15em" }}>IDLE HANDS INVITATIONAL · PLAYER CARD</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 28, marginTop: 4, lineHeight: 1.05 }}>{card.alias}</div>
              <div style={{ fontFamily: "Courier New, monospace", fontSize: 11, color: "#c8a070" }}>{card.id}</div>
              <table style={{ width: "100%", marginTop: 10, fontSize: 11, color: "#fffef8" }}><tbody>
                <PCMeta k="Handicap" v={card.hcp} />
                <PCMeta k="Assigned Table" v={card.table} />
                <PCMeta k="Object" v={card.obj} />
                <PCMeta k="Light" v={card.light} />
                <PCMeta k="Break" v={card.breakStyle} />
                <PCMeta k="Game" v={card.game} />
                <PCMeta k="Status" v={<span style={{color:"#ffaa6b"}}>{card.status}</span>} />
              </tbody></table>
              <div style={{ marginTop: 8, fontFamily: "Caveat, Georgia, serif", fontSize: 14, color: "#c8e6c8", fontStyle: "italic" }}>↪ House rule: Don't talk through the break.</div>
              <div style={{ position: "absolute", top: 10, right: 12, transform: "rotate(7deg)", border: "2px solid #ffaa6b", color: "#ffaa6b", fontFamily: "Courier New, monospace", fontSize: 10, padding: "2px 6px", letterSpacing: "0.15em" }}>1:47</div>
            </div>

            {/* Receipt */}
            <div style={{ background: "#fffef8", border: "1px dashed #1a1a14", padding: 14, fontFamily: "Courier New, monospace", fontSize: 12, color: "#1a1a14" }}>
              <div style={{ textAlign: "center", letterSpacing: "0.2em", borderBottom: "1px solid #1a1a14", paddingBottom: 4 }}>TOURNAMENT RECEIPT</div>
              <div style={{ marginTop: 6, lineHeight: 1.7 }}>
                <Rcpt k="ENTRY FEE" v="20.00" />
                <Rcpt k="BAD LIGHT SURCHARGE" v="1.47" />
                <Rcpt k="OBJECT HANDLING" v="0.00" />
                <Rcpt k="LATE REGISTRATION" v="0.00" />
                <Rcpt k="COFFEE ADJUSTMENT" v="TBD" />
              </div>
              <div style={{ borderTop: "1px solid #1a1a14", marginTop: 6, paddingTop: 4, display: "flex", justifyContent: "space-between" }}>
                <span>TOTAL</span><span><strong>UNVERIFIED</strong></span>
              </div>
              <div style={{ marginTop: 6, fontSize: 9, textAlign: "center", letterSpacing: "0.1em", color: "#5a4a35" }}>cash only · pay at the door if the door exists</div>
            </div>

            {/* Locker tag / Badge */}
            <div style={{ background: "#fff5d8", border: "1px solid #5a4a35", padding: 14, position: "relative" }}>
              <div style={{ fontFamily: "Courier New, monospace", fontSize: 9, letterSpacing: "0.15em", color: "#5a4a35" }}>LOCKER TAG · IDLE HANDS INVITATIONAL</div>
              <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "44px 1fr 60px", gap: 10, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, background: "#1a1a14", color: "#ffaa6b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontFamily: "Courier New, monospace" }}>{card.obj === "Motel Key" ? "8" : card.obj === "Fuzzy Dice" ? "▦" : card.obj === "Coffee Mug" ? "☕" : "▤"}</div>
                <div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 18 }}>{card.alias}</div>
                  <div style={{ fontFamily: "Courier New, monospace", fontSize: 10, color: "#5a4a35" }}>{card.id} · {card.table}</div>
                </div>
                <div style={{ transform: "rotate(7deg)", border: "2px double #a33", color: "#a33", fontFamily: "Courier New, monospace", fontSize: 9, padding: "2px 4px", textAlign: "center", letterSpacing: "0.1em" }}>STILL OUT</div>
              </div>
              <div style={{ marginTop: 6, fontFamily: "Courier New, monospace", fontSize: 9, color: "#5a4a35", letterSpacing: "0.1em" }}>1:47 AM · NOT TRANSFERABLE</div>
            </div>

            {/* Phone msg */}
            <div style={{ background: "#0a1a0a", color: "#7fff7f", border: "1px solid #1a4020", padding: 12, fontFamily: "Courier New, monospace", fontSize: 12 }}>
              <div style={{ letterSpacing: "0.15em", color: "#c8e6c8", fontSize: 10 }}>PHONE BEHIND THE BAR · MSG #{card.id.replace("IHI-","")}</div>
              <div style={{ marginTop: 8, lineHeight: 1.5 }}>You're in. Table assignment pending. Don't ask the clock.</div>
              <div style={{ marginTop: 8, fontSize: 10, color: "#9ac49a" }}>—Unknown Caller, 1:47 AM</div>
            </div>
          </div>

          {/* Bracket placement note + share */}
          <div style={{ marginTop: 18, padding: 12, background: "#ebe5d4", border: "1px solid #c4bdac", fontSize: 12 }}>
            <strong>BRACKET PLACEMENT:</strong> {card.table === "Waiting List" ? "On the waiting list (Round 0)." : card.table === "Side Bracket" ? "Filed to the side bracket. Re-ranks at midnight." : `Slotted to ${card.table}.`} {card.status.includes("LATE") && "Late registration noted."}
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={ihBtn} onClick={() => window.print()}>Print All Assets</button>
            <button style={ihBtn}>Email To Yourself</button>
            <button style={ihBtn}>Save Old-Web Profile (.html)</button>
            <button style={ihBtn} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function PCMeta({ k, v }) { return (<tr><td style={{ color:"#9ac49a", padding:"1px 8px 1px 0" }}>{k}:</td><td>{v}</td></tr>); }
function Rcpt({ k, v }) { return (<div style={{ display:"flex", justifyContent:"space-between" }}><span>{k}</span><span>{v}</span></div>); }

// ============================================================
// FLYER PRINT MODAL (downloadable look)
// ============================================================
function IHFlyerPrintModal({ onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9500, display: "flex", alignItems: "center", justifyContent: "center", padding: 30, overflow: "auto" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background: "#fdf8e8", border: "1px solid #5a4a35", padding: "44px 36px 56px", width: 420, fontFamily: "Courier New, monospace", color: "#1a1a14", position: "relative", boxShadow: "6px 6px 0 rgba(0,0,0,0.4)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 8, right: 8, ...ihBtn, fontSize: 10, padding: "1px 8px" }}>[X] Close</button>
        <div style={{ textAlign: "center", fontSize: 12, letterSpacing: "0.2em", borderBottom: "2px solid #1a1a14", paddingBottom: 6 }}>SATURDAY / DATE PENDING</div>
        <h2 style={{ textAlign: "center", fontSize: 38, margin: "12px 0 4px", fontFamily: "Georgia, serif", fontWeight: "bold", letterSpacing: "0.04em", lineHeight: 0.95 }}>IDLE HANDS<br/>INVITATIONAL</h2>
        <div style={{ textAlign: "center", fontSize: 14, letterSpacing: "0.1em", marginBottom: 16 }}>8-BALL / 9-BALL</div>
        <hr style={{ border: 0, borderTop: "1px dashed #1a1a14", margin: "10px 0" }} />
        <div style={{ fontSize: 14, lineHeight: 1.85, letterSpacing: "0.04em" }}>
          DOORS 7:00 PM<br/>
          ENTRY <span style={{ borderBottom: "2px solid #a33", color: "#a33", fontWeight: "bold" }}>$20 CASH POT</span><br/>
          HOUSE RULES APPLY<br/>
          NO SOFT HANDS<br/>
          CALL YOUR OWN FOULS<br/>
          LATE REGISTRATION ACCEPTED
        </div>
        <hr style={{ border: 0, borderTop: "1px dashed #1a1a14", margin: "12px 0" }} />
        <div style={{ fontSize: 12, letterSpacing: "0.05em" }}>Location: <span style={{ background: "#1a1a14", color: "#1a1a14" }}>disclosed after Clock Out</span></div>
        <div style={{ fontFamily: "Caveat, Georgia, serif", fontStyle: "italic", color: "#a33", fontSize: 18, marginTop: 12, transform: "rotate(-2deg)" }}>Don't ask if it's real. Register or don't.</div>
        <div style={{ position: "absolute", top: 18, right: 30, transform: "rotate(7deg)", border: "3px double #a33", color: "#a33", padding: "3px 12px", fontSize: 12, letterSpacing: "0.15em" }}>CASH ONLY</div>
        <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderTop: "1px dashed #1a1a14" }}>
          {["CALL","REGISTER","FIND THE ROOM","CLOCK OUT","ASK NUN DOG"].map((t, i) => (
            <div key={i} style={{ borderRight: i < 4 ? "1px dashed #1a1a14" : "none", padding: "6px 4px", fontSize: 9, textAlign: "center", letterSpacing: "0.08em", writingMode: "vertical-rl", transform: "rotate(180deg)", height: 56 }}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const ihLink = { color: "#1f4cc4", textDecoration: "underline" };
const ihNavLink = { color: "#c8e6c8", textDecoration: "underline" };
const ihBtn = {
  fontFamily: "Tahoma, Verdana, Arial, sans-serif", fontSize: 11,
  padding: "3px 10px", background: "linear-gradient(180deg, #fffef8 0%, #d8d2c4 100%)",
  border: "1px solid #5a4a35", borderTopColor: "#fffef8", borderLeftColor: "#fffef8",
  borderRightColor: "#1a1a14", borderBottomColor: "#1a1a14",
  color: "#1a1a14", cursor: "pointer", boxShadow: "1px 1px 0 rgba(0,0,0,0.15)",
};
const ihTable = { width: "100%", borderCollapse: "collapse", fontSize: 11, background: "#fffef8", border: "1px solid #c4bdac" };
const ihThRow = { background: "#1a4020", color: "#c8e6c8" };
const ihTh = { padding: "5px 8px", textAlign: "left", fontSize: 11, fontFamily: "Tahoma, sans-serif", letterSpacing: "0.05em" };
const ihTd = { padding: "6px 8px", borderRight: "1px solid #c4bdac", verticalAlign: "top" };
const ihInput = { width: "100%", boxSizing: "border-box", border: "1px solid #8a8270", padding: "2px 4px", fontFamily: "Verdana, sans-serif", fontSize: 11 };
const ihSelect = { ...ihInput, background: "#fffef8" };

window.IdleHands = IdleHands;
