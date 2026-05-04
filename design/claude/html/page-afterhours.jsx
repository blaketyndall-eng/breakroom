// AFTER HOURS — MySpace-style profile · "afterhour47"

const { useState: useStateAH, useEffect: useEffectAH, useMemo: useMemoAH } = React;

// ============= CLOCK OUT TRANSITION =============
function ClockOutGate({ onDone }) {
  const lines = [
    "Ending approved session...",
    "Supervisor connection lost...",
    "Clock discrepancy detected: 1:47 AM",
    "Breakroom override accepted...",
    "Loading afterhour47's profile...",
  ];
  const [step, setStep] = useStateAH(0);
  const [stamp, setStamp] = useStateAH(false);

  useEffectAH(() => {
    const t = setInterval(() => setStep(s => Math.min(s + 1, lines.length)), 600);
    return () => clearInterval(t);
  }, []);

  useEffectAH(() => {
    if (step >= lines.length) {
      setTimeout(() => setStamp(true), 300);
      setTimeout(() => onDone(), 2200);
    }
  }, [step]);

  return (
    <div style={{
      minHeight: "calc(100vh - 28px)",
      background: "#003a8c url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='20' cy='20' r='1.2' fill='white' opacity='0.18'/></svg>\")",
      color: "#FFEB3D", fontFamily: "Verdana, Geneva, sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 30,
    }}>
      <div style={{ width: "min(640px, 100%)", fontSize: 14, lineHeight: 2, fontFamily: "Courier New, monospace" }}>
        {lines.slice(0, step).map((l, i) => <div key={i}>&gt; {l}</div>)}
        {step < lines.length && <div className="blink">&gt; <span style={{ opacity: 0.5 }}>loading</span></div>}
      </div>
      {stamp && (
        <>
          <div style={{
            marginTop: 40, fontFamily: "Impact, sans-serif",
            background: "linear-gradient(180deg, #FF1FA0 0%, #FF6BCB 100%)",
            color: "white", padding: "10px 28px", fontSize: 56, letterSpacing: "0.04em",
            border: "4px solid #FFEB3D", transform: "rotate(-3deg)",
            textShadow: "3px 3px 0 #003a8c",
          }}>★ CLOCKED OUT ★</div>
          <div style={{ marginTop: 30, fontFamily: "Verdana", fontSize: 18, color: "white", textAlign: "center" }}>
            welcome to <span style={{ color: "#FFEB3D", fontWeight: "bold" }}>afterhour47</span>'s profile<br/>
            <span style={{ fontSize: 12, color: "#bcd9ff", fontStyle: "italic" }}>Management says this user does not exist.</span>
          </div>
        </>
      )}
    </div>
  );
}

// ============= DATA =============
const MOODS = [
  { e: "🌙", w: "off the clock" },
  { e: "🚬", w: "smoking on the loading dock" },
  { e: "📞", w: "ignoring it" },
  { e: "☕", w: "burnt coffee, again" },
  { e: "🎱", w: "racking" },
  { e: "🪞", w: "looking the wrong way" },
];

const TOP8 = [
  { name: "the driver", h: "#FF1FA0", note: "outside. always." },
  { name: "miss september", h: "#FFEB3D", note: "borrowed the radio" },
  { name: "the kid w/ the mop", h: "#1FE6FF", note: "shift never ends" },
  { name: "Booth 3", h: "#9D4EDD", note: "open till 2:13 ★" },
  { name: "OmniShift HR", h: "#444", note: "BLOCKED" },
  { name: "the wall clock", h: "#FF6BCB", note: "stuck @ 1:47" },
  { name: "7/11 clerk", h: "#3DDC84", note: "knows about the dogs" },
  { name: "nun w/ a dog", h: "#FFB23D", note: "tournament alt." },
];

const BLOG_POSTS = [
  {
    title: "the email arrived at 11:47 pm and i did the unthinkable",
    mood: "🌙 off the clock",
    music: "??? — \"applause money\"",
    body: "ok so. it shows up. subject line says \"quick one\". it is never a quick one. anyway i closed the laptop. i closed it. i went outside. i looked at the sky. the sky did not have a deadline. forwarded mentally to nobody. 10/10 do recommend.",
    likes: 47, kudos: 12,
  },
  {
    title: "things that survive after 1:47 am (a list)",
    mood: "🪞 looking the wrong way",
    music: "burnt coffee maker hum, in C",
    body: "1. the wall clock\n2. the lowrider in the lot\n3. the feeling that you forgot a stapler somewhere\n4. miss september's perfume\n5. one (1) prayer counter\n6. you, technically",
    likes: 213, kudos: 88,
  },
  {
    title: "i pressed the prayer button. it pressed back.",
    mood: "📞 ignoring it",
    music: "phone behind the bar — \"voicemail 03\"",
    body: "they said no names are stored. they said no promises are made. they did not say anything about being heard. counter went up by one. counter went up by another one. i did not press it twice.",
    likes: 1147, kudos: 404,
  },
];

const COMMENTS_SEED = [
  { who: "marty from nowhere", h: "#FF1FA0", time: "Mar 14 · 2:18 AM", body: "found ur cap in booth 3. holding it ransom for one (1) coffee ★" },
  { who: "miss september", h: "#FFEB3D", time: "Mar 13 · 11:47 PM", body: "borrowed the radio. will return when the song ends. it has not ended." },
  { who: "the driver", h: "#1FE6FF", time: "Mar 13 · 1:47 AM", body: "outside. bring a hoodie. lot is cold." },
  { who: "register ghost", h: "#9D4EDD", time: "Mar 12 · 4:11 AM", body: "still owe u that coffee from 2003. counter still running." },
  { who: "the kid w/ the mop", h: "#3DDC84", time: "Mar 11 · 4:33 AM", body: "i can hear the prayer counter from the back. it ticks even when nobody is on the page" },
];

const STATUS_LINES = [
  "in mood: post-shift", "AIM: away (forever)", "currently: not on camera",
  "last seen: behind the bar", "online: technically",
];

const TRANSLATOR_TEMPLATES = [
  (i) => ({ kind: "RECEIPT", body: "ITEM: one unresolved request\nQTY: 1\nSTATUS: still following you\nTOTAL: no total\nNOTE: They want an answer before the sun goes down.\nRECOMMENDED ACTION: close laptop. stare at wall." }),
  (i) => ({ kind: "BREAKROOM MEMO", body: "TO: whoever is still on the floor\nRE: the message that followed you home\n\nThis email is wearing a manager costume.\nIt contains urgency without weight.\nIt can be processed tomorrow with coffee." }),
  (i) => ({ kind: "PRAYER CARD", body: "for the worker who received the email at 9:47 PM\nfor the cursor that hovered over reply\nfor the laptop that stayed open one minute longer\n\nmay the response wait until coffee.\namen, technically." }),
  (i) => ({ kind: "VOICEMAIL TRANSCRIPT", body: "[message 03 — 11:47 PM]\n[caller: unknown — sounds like work]\n\nhey. yeah. so this thing came in.\ni know it's late. i'm not gonna —\nlook. just. when you can. before EOD.\n[message ends mid-sentence]" }),
  (i) => ({ kind: "PARKING LOT PROPHECY", body: "you will reply tomorrow.\nyou will use one fewer paragraph than asked.\nthe project will not collapse.\nthe deadline was a feeling, not a fact." }),
  (i) => ({ kind: "WARNING LABEL", body: "⚠ CONTAINS:\n  • performative urgency\n  • emotional follow-up\n  • passive aggression (low dose)\n  • the word \"circle\" used as a verb\n\nDO NOT REPLY ON AN EMPTY STOMACH." }),
];

const STAFF_NOTES = [
  "Whoever keeps moving the wall clock: stop. It comes back.",
  "If a customer asks about the prayer button, tell them it is not customer-facing.",
  "Burnt coffee is not a defect. It is the house style.",
  "Somebody left a gold chain in the microwave. Again.",
  "Products are not missing. They have been temporarily denied.",
  "Stop writing 'after hour' on official forms.",
  "Back booth needs new felt. Or a priest.",
  "If the receipt printer prints handwriting, do not unplug it.",
];

const PRAYER_CONFIRMS = ["Counted.", "The room heard it.", "One more.", "Filed after midnight.", "You can go now."];

// ============= PRAYER COUNTER =============
function usePrayerCount() {
  const [n, setN] = useStateAH(() => 12847 + (parseInt(localStorage.getItem("br_prayers") || "0", 10) || 0));
  const press = () => {
    const stored = parseInt(localStorage.getItem("br_prayers") || "0", 10) || 0;
    localStorage.setItem("br_prayers", String(stored + 1));
    setN(12847 + stored + 1);
  };
  return [n, press];
}

// ============= MAIN PAGE =============
function AfterHours({ go, employee }) {
  const [moodIdx, setMoodIdx] = useStateAH(0);
  const [translatorIn, setTranslatorIn] = useStateAH("");
  const [translatorOut, setTranslatorOut] = useStateAH(null);
  const [prayN, prayPress] = usePrayerCount();
  const [prayMsg, setPrayMsg] = useStateAH(null);
  const [prayed, setPrayed] = useStateAH(false);
  const [comments, setComments] = useStateAH(COMMENTS_SEED);
  const [newComment, setNewComment] = useStateAH({ who: "", body: "" });
  const [staffPick, setStaffPick] = useStateAH(0);
  const [musicPlaying, setMusicPlaying] = useStateAH(false);
  const [activeBlog, setActiveBlog] = useStateAH(0);

  const visits = useMemoAH(() => {
    const stored = parseInt(localStorage.getItem("br_ah_visits") || "0", 10) || 0;
    const next = stored + 1;
    localStorage.setItem("br_ah_visits", String(next));
    return 18439 + next;
  }, []);

  const handleTranslate = () => {
    const tpl = TRANSLATOR_TEMPLATES[Math.floor(Math.random() * TRANSLATOR_TEMPLATES.length)];
    setTranslatorOut(tpl(translatorIn));
  };
  const handlePray = () => {
    prayPress();
    setPrayed(true);
    setPrayMsg(PRAYER_CONFIRMS[Math.floor(Math.random() * PRAYER_CONFIRMS.length)]);
  };
  const submitComment = () => {
    if (!newComment.who.trim() || !newComment.body.trim()) return;
    const colors = ["#FF1FA0", "#FFEB3D", "#1FE6FF", "#9D4EDD", "#3DDC84", "#FF6BCB"];
    const now = new Date();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const time = `${months[now.getMonth()]} ${now.getDate()} · ${((now.getHours() % 12) || 12)}:${String(now.getMinutes()).padStart(2,"0")} ${now.getHours() < 12 ? "AM" : "PM"}`;
    setComments([{ who: newComment.who.trim().toLowerCase(), h: colors[Math.floor(Math.random() * colors.length)], time, body: newComment.body.trim() }, ...comments].slice(0, 12));
    setNewComment({ who: "", body: "" });
  };
  const newMood = () => setMoodIdx((moodIdx + 1) % MOODS.length);
  const newStaff = () => setStaffPick(Math.floor(Math.random() * STAFF_NOTES.length));

  const mood = MOODS[moodIdx];

  return (
    <div style={{
      minHeight: "calc(100vh - 28px)",
      background: "#003a8c url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><circle cx='15' cy='15' r='1' fill='%23FFEB3D' opacity='0.25'/><circle cx='45' cy='45' r='1.4' fill='white' opacity='0.18'/><circle cx='30' cy='8' r='0.8' fill='%23FF6BCB' opacity='0.3'/></svg>\")",
      fontFamily: "Verdana, Geneva, sans-serif", color: "#1a1a1a", paddingBottom: 40,
    }}>
      {/* MYSPACE-STYLE TOP NAV STRIP */}
      <div style={{ background: "linear-gradient(180deg, #FFEB3D 0%, #FFB23D 100%)", borderBottom: "2px solid #003a8c", padding: "6px 16px", fontFamily: "Verdana", fontSize: 11, fontWeight: "bold", color: "#003a8c", letterSpacing: "0.02em" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span>★ <span style={{ color: "#FF1FA0" }}>break</span><span style={{ color: "#003a8c" }}>SPACE</span> ★ <span style={{ color: "#666", fontWeight: "normal" }}>a place for off-clock people</span></span>
          <span>
            <a href="#" onClick={(e)=>{e.preventDefault(); go("portal");}} style={{ color: "#003a8c", marginRight: 10 }}>[home]</a>
            <a href="#" onClick={(e)=>e.preventDefault()} style={{ color: "#003a8c", marginRight: 10 }}>[browse]</a>
            <a href="#" onClick={(e)=>{e.preventDefault(); go("staff");}} style={{ color: "#003a8c", marginRight: 10 }}>[mail (3)]</a>
            <a href="#" onClick={(e)=>{e.preventDefault(); go("portal");}} style={{ color: "#FF1FA0" }}>[clock back in]</a>
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "16px auto", padding: "0 12px" }}>
        {/* PROFILE HEADER */}
        <div style={{ background: "white", border: "1px solid #003a8c", padding: "14px 18px", marginBottom: 14, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center" }}>
          <div style={{ width: 60, height: 60, background: "linear-gradient(135deg, #FF1FA0, #FFEB3D)", display: "grid", placeItems: "center", fontFamily: "Impact", fontSize: 38, color: "white", textShadow: "2px 2px 0 #003a8c", border: "3px solid #FFEB3D" }}>1:47</div>
          <div>
            <div style={{ fontFamily: "Impact, sans-serif", fontSize: 32, color: "#FF1FA0", letterSpacing: "0.02em", lineHeight: 1, textShadow: "2px 2px 0 #FFEB3D" }}>afterhour47</div>
            <div style={{ fontSize: 12, color: "#003a8c", marginTop: 2 }}>"clocked out. did not survive it." <span style={{ color: "#999" }}>· male/female/unknown · 1:47 AM, ageless</span></div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>Last login: <span style={{ color: "#FF1FA0", fontWeight: "bold" }}>just now</span> · Profile views: <span style={{ color: "#003a8c", fontWeight: "bold" }}>{visits.toLocaleString()}</span></div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11 }}>
            <button onClick={() => go("portal")} style={{ all: "unset", cursor: "pointer", background: "#FF1FA0", color: "white", padding: "4px 10px", border: "1px solid #003a8c", fontWeight: "bold", marginBottom: 4, display: "block", marginLeft: "auto" }}>★ Add to Friends</button>
            <button style={{ all: "unset", cursor: "pointer", background: "#FFEB3D", color: "#003a8c", padding: "4px 10px", border: "1px solid #003a8c", fontWeight: "bold", display: "block", marginLeft: "auto" }}>✉ Send Message</button>
          </div>
        </div>

        {/* TWO COL LAYOUT */}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 14 }}>
          {/* ====== LEFT SIDEBAR ====== */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* PROFILE PIC + STATUS */}
            <PanelMS color="#FF1FA0" title="afterhour47">
              <div style={{ background: "linear-gradient(180deg, #003a8c 0%, #1a1a1a 100%)", height: 180, position: "relative", border: "2px solid #FFEB3D", display: "grid", placeItems: "center", overflow: "hidden" }}>
                <div style={{ fontFamily: "Impact", fontSize: 80, color: "#FFEB3D", textShadow: "0 0 20px #FF1FA0", lineHeight: 0.8 }}>1:47</div>
                <div style={{ position: "absolute", bottom: 6, left: 6, right: 6, fontFamily: "Courier", fontSize: 9, color: "#FF6BCB", textAlign: "center" }}>★ pic taken in the breakroom mirror ★</div>
                <div style={{ position: "absolute", top: 4, right: 4, background: "#FF1FA0", color: "white", padding: "1px 4px", fontSize: 9, fontWeight: "bold", border: "1px solid white" }}>ONLINE NOW</div>
              </div>
              <div style={{ padding: "8px 4px", fontSize: 11, lineHeight: 1.6 }}>
                <div><span style={{ color: "#FF1FA0", fontWeight: "bold" }}>Mood:</span> {mood.e} {mood.w} <button onClick={newMood} style={{ all: "unset", cursor: "pointer", color: "#003a8c", textDecoration: "underline", fontSize: 9, marginLeft: 4 }}>[change]</button></div>
                <div><span style={{ color: "#FF1FA0", fontWeight: "bold" }}>Status:</span> off the clock</div>
                <div><span style={{ color: "#FF1FA0", fontWeight: "bold" }}>Here for:</span> coffee, weird mail, a ride</div>
                <div><span style={{ color: "#FF1FA0", fontWeight: "bold" }}>Orientation:</span> away from window</div>
                <div><span style={{ color: "#FF1FA0", fontWeight: "bold" }}>Hometown:</span> the breakroom</div>
                <div><span style={{ color: "#FF1FA0", fontWeight: "bold" }}>Body type:</span> currently slouched</div>
                <div><span style={{ color: "#FF1FA0", fontWeight: "bold" }}>Religion:</span> the prayer counter</div>
                <div><span style={{ color: "#FF1FA0", fontWeight: "bold" }}>Sign:</span> "EMPLOYEES ONLY"</div>
                <div><span style={{ color: "#FF1FA0", fontWeight: "bold" }}>Income:</span> applause money</div>
                <div><span style={{ color: "#FF1FA0", fontWeight: "bold" }}>Kids:</span> the kid w/ the mop, kinda</div>
              </div>
            </PanelMS>

            {/* MUSIC PLAYER */}
            <PanelMS color="#9D4EDD" title="afterhour47's music ♪">
              <div style={{ background: "#1a1a1a", padding: 10, color: "#FFEB3D", fontFamily: "Courier", fontSize: 11 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <button onClick={() => setMusicPlaying(!musicPlaying)} style={{ all: "unset", cursor: "pointer", background: "#FF1FA0", color: "white", padding: "2px 8px", border: "1px solid #FFEB3D", fontWeight: "bold", fontSize: 10 }}>{musicPlaying ? "❚❚ pause" : "▶ play"}</button>
                  <span style={{ color: "#FF6BCB", fontSize: 9 }}>{musicPlaying ? "01:47 / ∞" : "00:00 / ∞"}</span>
                </div>
                <div style={{ height: 4, background: "#333", marginBottom: 6, position: "relative" }}>
                  <div style={{ height: "100%", width: musicPlaying ? "47%" : "0%", background: "linear-gradient(90deg, #FF1FA0, #FFEB3D)", transition: "width 0.4s" }}></div>
                </div>
                <div style={{ color: "white", fontWeight: "bold" }}>now spinning:</div>
                <div style={{ color: "#FFEB3D" }}>"applause money" — ???</div>
                <div style={{ color: "#1FE6FF", fontSize: 10, marginTop: 6 }}>♪ next: phone behind the bar — vm 03</div>
                <div style={{ color: "#1FE6FF", fontSize: 10 }}>♪ next: burnt coffee maker hum, in C</div>
                <div style={{ color: "#1FE6FF", fontSize: 10 }}>♪ next: parking lot bass, 1:47 mix</div>
              </div>
            </PanelMS>

            {/* CONTACT BOX */}
            <PanelMS color="#1FE6FF" title="contacting afterhour47">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, padding: 4, fontSize: 10 }}>
                {[
                  ["✉ msg", "#FF1FA0"],
                  ["☆ fwd", "#003a8c"],
                  ["+ friend", "#9D4EDD"],
                  ["★ fav", "#FFB23D"],
                  ["✎ block", "#444"],
                  ["⚑ rank", "#3DDC84"],
                ].map(([l, c]) => (
                  <button key={l} style={{ all: "unset", cursor: "pointer", background: c, color: "white", padding: "5px 0", textAlign: "center", border: "1px solid #003a8c", fontWeight: "bold" }}>{l}</button>
                ))}
              </div>
            </PanelMS>

            {/* URL */}
            <PanelMS color="#3DDC84" title="afterhour47's url">
              <div style={{ padding: 6, background: "#FFEB3D", border: "1px dashed #003a8c", fontFamily: "Courier", fontSize: 11, color: "#003a8c", textAlign: "center", fontWeight: "bold", wordBreak: "break-all" }}>
                breakSPACE.com/afterhour47
              </div>
              <div style={{ fontSize: 10, color: "#666", textAlign: "center", marginTop: 4, fontStyle: "italic" }}>copy it. paste it. nobody clicks it.</div>
            </PanelMS>

            {/* PRAYER COUNTER */}
            <PanelMS color="#FF6BCB" title="and then you pray for me">
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <button onClick={handlePray} style={{
                  all: "unset", cursor: "pointer", display: "block", margin: "0 auto",
                  background: prayed ? "linear-gradient(180deg, #1FE6FF, #003a8c)" : "linear-gradient(180deg, #FF1FA0, #FF6BCB)",
                  color: "white", padding: "10px 20px", fontFamily: "Impact", fontSize: 18, letterSpacing: "0.05em",
                  border: "3px solid #FFEB3D", textShadow: "1px 1px 0 #003a8c",
                }}>★ {prayed ? "PRAY AGAIN" : "PRAY FOR ME"} ★</button>
                <div style={{ marginTop: 8, fontFamily: "Courier", fontSize: 12, color: "#003a8c", fontWeight: "bold" }}>{prayN.toLocaleString()} prayers</div>
                {prayMsg && <div style={{ fontSize: 10, color: "#FF1FA0", marginTop: 2, fontStyle: "italic" }}>— {prayMsg}</div>}
                <div style={{ fontSize: 9, color: "#999", marginTop: 6 }}>no names stored. the room keeps count.</div>
              </div>
            </PanelMS>

            {/* DETAILS - SCHOOLS */}
            <PanelMS color="#FFB23D" title="afterhour47's schools">
              <div style={{ fontSize: 11, padding: 4, lineHeight: 1.6 }}>
                <div style={{ borderBottom: "1px dashed #ccc", paddingBottom: 4, marginBottom: 4 }}>
                  <div style={{ fontWeight: "bold", color: "#003a8c" }}>The Breakroom</div>
                  <div style={{ color: "#666", fontSize: 10 }}>graduated: never · major: surviving</div>
                </div>
                <div style={{ borderBottom: "1px dashed #ccc", paddingBottom: 4, marginBottom: 4 }}>
                  <div style={{ fontWeight: "bold", color: "#003a8c" }}>OmniShift Training Program</div>
                  <div style={{ color: "#666", fontSize: 10 }}>dropped out · reason: clock</div>
                </div>
                <div>
                  <div style={{ fontWeight: "bold", color: "#003a8c" }}>Booth 3, U.</div>
                  <div style={{ color: "#666", fontSize: 10 }}>night classes · still enrolled</div>
                </div>
              </div>
            </PanelMS>
          </div>

          {/* ====== RIGHT MAIN COLUMN ====== */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* BLURBS */}
            <PanelMS color="#FF1FA0" title="afterhour47: about me">
              <div style={{ padding: 10, fontSize: 13, lineHeight: 1.6, color: "#1a1a1a" }}>
                <p style={{ margin: 0 }}>
                  hi i am <span style={{ background: "#FFEB3D", padding: "0 2px" }}>afterhour47</span>. i clocked out. i did not survive the company but the company also did not survive me so we are even. i live in the back booth between <span style={{ color: "#FF1FA0", fontWeight: "bold" }}>1:47 am</span> and whenever the lights stop buzzing. i am here for: coffee, weird mail, a ride, the prayer counter, the kid w/ the mop. i am NOT here for: standups, "circling back", anything before 11 am.
                </p>
                <p style={{ margin: "10px 0 0", color: "#003a8c", fontStyle: "italic", fontSize: 12 }}>
                  fav quote: <span style={{ color: "#1a1a1a" }}>"i understand nothing." — somebody at the bar, probably</span>
                </p>
              </div>
            </PanelMS>

            <PanelMS color="#003a8c" title="who i'd like to meet">
              <div style={{ padding: 10, fontSize: 13, lineHeight: 1.6 }}>
                anyone who has ever <span style={{ color: "#FF1FA0", fontWeight: "bold" }}>received an email at 9:47 pm</span> and stared at the ceiling. anyone who has ever lost a feather, a key, a cap, a coffee, a shift. anyone who knows what the wall clock is doing and won't tell management. <span style={{ color: "#003a8c", fontWeight: "bold" }}>NOT</span> recruiters. <span style={{ color: "#003a8c", fontWeight: "bold" }}>NOT</span> anyone with the word "synergy" in their job title.
              </div>
            </PanelMS>

            {/* INTERESTS TABLE */}
            <PanelMS color="#9D4EDD" title="afterhour47's interests">
              <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    ["General", "burnt coffee · the wall clock · the lot at 1:47 · feathers · receipts with no total"],
                    ["Music", "phone behind the bar · burnt coffee maker hum · parking lot bass · ??? — applause money"],
                    ["Movies", "anything with a lowrider · anything where nobody emails anybody"],
                    ["TV", "the security feed of booth 3, on a loop"],
                    ["Books", "the OmniShift handbook (annotated, against)"],
                    ["Heroes", "the kid w/ the mop · miss september · the driver"],
                  ].map(([k, v], i) => (
                    <tr key={k} style={{ background: i % 2 ? "#fff5fb" : "white" }}>
                      <td style={{ padding: "6px 10px", color: "#9D4EDD", fontWeight: "bold", verticalAlign: "top", width: 90, borderRight: "1px solid #eee" }}>{k}</td>
                      <td style={{ padding: "6px 10px", color: "#1a1a1a" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PanelMS>

            {/* TOP 8 */}
            <PanelMS color="#FFEB3D" title="afterhour47's top 8 ★">
              <div style={{ padding: 8, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {TOP8.map((f, i) => (
                  <div key={i} onClick={() => {
                    if (f.name === "Booth 3") go("idlehands");
                    else if (f.name === "miss september") go("phone");
                    else if (f.name === "the driver") go("phone");
                    else if (f.name === "OmniShift HR") go("staff");
                  }} style={{ cursor: "pointer", textAlign: "center" }}>
                    <div style={{ background: f.h, height: 70, border: "2px solid #003a8c", display: "grid", placeItems: "center", fontFamily: "Impact", fontSize: 28, color: "white", textShadow: "1px 1px 0 #003a8c", position: "relative" }}>
                      {f.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                      <div style={{ position: "absolute", top: 2, right: 2, background: "white", color: "#003a8c", fontSize: 8, padding: "0 3px", fontWeight: "bold", border: "1px solid #003a8c" }}>{i + 1}</div>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: "bold", color: "#FF1FA0", marginTop: 3, textDecoration: "underline" }}>{f.name}</div>
                    <div style={{ fontSize: 9, color: "#666", fontStyle: "italic" }}>{f.note}</div>
                  </div>
                ))}
              </div>
            </PanelMS>

            {/* BLOG */}
            <PanelMS color="#FF6BCB" title="afterhour47's latest blog entries [view all]">
              <div style={{ padding: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
                  {BLOG_POSTS.map((p, i) => (
                    <button key={i} onClick={() => setActiveBlog(i)} style={{ all: "unset", cursor: "pointer", padding: "4px 8px", fontSize: 10, fontWeight: "bold", background: activeBlog === i ? "#FF1FA0" : "#eee", color: activeBlog === i ? "white" : "#003a8c", border: "1px solid #003a8c" }}>
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
                {(() => {
                  const p = BLOG_POSTS[activeBlog];
                  return (
                    <div>
                      <div style={{ background: "#FFEB3D", padding: "6px 10px", border: "1px solid #003a8c", fontSize: 14, fontWeight: "bold", color: "#003a8c" }}>{p.title}</div>
                      <div style={{ fontSize: 10, color: "#666", padding: "4px 0" }}>
                        Currently: {p.mood} · Listening to: <span style={{ color: "#9D4EDD" }}>{p.music}</span>
                      </div>
                      <div style={{ background: "white", border: "1px solid #ccc", padding: 10, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#1a1a1a" }}>{p.body}</div>
                      <div style={{ display: "flex", gap: 10, marginTop: 6, fontSize: 11, color: "#666" }}>
                        <span>♥ <span style={{ color: "#FF1FA0", fontWeight: "bold" }}>{p.likes}</span> kudos</span>
                        <span>✎ <span style={{ color: "#003a8c", fontWeight: "bold" }}>{p.kudos}</span> comments</span>
                        <a href="#" onClick={(e)=>e.preventDefault()} style={{ marginLeft: "auto", color: "#FF1FA0", textDecoration: "underline" }}>permalink</a>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </PanelMS>

            {/* WORK EMAIL TRANSLATOR — bulletin */}
            <PanelMS color="#1FE6FF" title="bulletin: WORK EMAIL TRANSLATOR (post date: today)">
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 12, color: "#003a8c", marginBottom: 6 }}>★★★ paste the phrase that followed you home. i will translate it into something survivable. no inputs are stored. ★★★</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <textarea value={translatorIn} onChange={(e) => setTranslatorIn(e.target.value)} placeholder="paste corporate language here..." style={{ height: 130, padding: 8, border: "2px inset #003a8c", fontFamily: "Verdana", fontSize: 12, resize: "vertical", background: "white", color: "#1a1a1a" }} />
                  <div style={{ background: "#FFEB3D", border: "2px solid #003a8c", padding: 10, fontFamily: "Courier", fontSize: 11, lineHeight: 1.5, whiteSpace: "pre-wrap", color: "#1a1a1a", minHeight: 130 }}>
                    {translatorOut ? (
                      <>
                        <div style={{ color: "#FF1FA0", fontWeight: "bold", borderBottom: "1px dashed #003a8c", paddingBottom: 4, marginBottom: 6 }}>★ {translatorOut.kind} ★</div>
                        {translatorOut.body}
                      </>
                    ) : <span style={{ color: "#666", fontStyle: "italic" }}>output appears here. no two are alike.</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button onClick={handleTranslate} style={{ all: "unset", cursor: "pointer", background: "#FF1FA0", color: "white", padding: "5px 12px", border: "1px solid #003a8c", fontWeight: "bold", fontSize: 11 }}>★ TRANSLATE</button>
                  <button onClick={() => { setTranslatorIn("Just circling back to see if we can align on next steps before EOD."); }} style={{ all: "unset", cursor: "pointer", background: "white", color: "#003a8c", padding: "5px 12px", border: "1px solid #003a8c", fontSize: 11 }}>use example</button>
                  <button onClick={() => { setTranslatorIn(""); setTranslatorOut(null); }} style={{ all: "unset", cursor: "pointer", background: "white", color: "#666", padding: "5px 12px", border: "1px solid #999", fontSize: 11 }}>clear</button>
                </div>
              </div>
            </PanelMS>

            {/* STAFF NOTE OF THE DAY */}
            <PanelMS color="#FFB23D" title="staff note of the day">
              <div style={{ padding: 12, background: "white", fontSize: 13, fontStyle: "italic", color: "#003a8c", lineHeight: 1.5, position: "relative" }}>
                <span style={{ fontFamily: "Impact", fontSize: 28, color: "#FFB23D", position: "absolute", top: -2, left: 4 }}>"</span>
                <span style={{ paddingLeft: 22 }}>{STAFF_NOTES[staffPick]}</span>
                <div style={{ marginTop: 8, fontSize: 10, color: "#999", paddingLeft: 22 }}>— unsigned · taped to the back wall</div>
                <button onClick={newStaff} style={{ all: "unset", cursor: "pointer", marginTop: 8, fontSize: 10, color: "#FF1FA0", textDecoration: "underline" }}>[get a different note]</button>
              </div>
            </PanelMS>

            {/* COMMENTS WALL */}
            <PanelMS color="#FF1FA0" title={`afterhour47's friends comments [${comments.length}]`}>
              <div style={{ background: "#fff5fb", padding: 10, borderBottom: "2px solid #FF1FA0" }}>
                <div style={{ fontSize: 11, fontWeight: "bold", color: "#FF1FA0", marginBottom: 4 }}>★ leave a comment ★</div>
                <div style={{ display: "grid", gridTemplateColumns: "150px 1fr auto", gap: 6 }}>
                  <input value={newComment.who} onChange={(e) => setNewComment({ ...newComment, who: e.target.value })} placeholder="screen name"
                    style={{ padding: 5, border: "1px inset #FF1FA0", fontSize: 12, fontFamily: "Verdana" }} />
                  <input value={newComment.body} onChange={(e) => setNewComment({ ...newComment, body: e.target.value })} onKeyDown={(e) => e.key === "Enter" && submitComment()} placeholder="say something nice (or don't)"
                    style={{ padding: 5, border: "1px inset #FF1FA0", fontSize: 12, fontFamily: "Verdana" }} />
                  <button onClick={submitComment} style={{ all: "unset", cursor: "pointer", background: "#FF1FA0", color: "white", padding: "5px 14px", border: "1px solid #003a8c", fontSize: 11, fontWeight: "bold" }}>POST</button>
                </div>
              </div>
              <div>
                {comments.map((c, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: 10, padding: 10, borderBottom: i < comments.length - 1 ? "1px dashed #ccc" : "none", background: i % 2 ? "white" : "#fffafd" }}>
                    <div>
                      <div style={{ background: c.h, width: 60, height: 60, border: "2px solid #003a8c", display: "grid", placeItems: "center", fontFamily: "Impact", fontSize: 22, color: "white", textShadow: "1px 1px 0 #003a8c" }}>
                        {c.who.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      <div style={{ fontSize: 9, color: "#FF1FA0", textDecoration: "underline", marginTop: 2, textAlign: "center", fontWeight: "bold" }}>{c.who}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#999", marginBottom: 3 }}>{c.time}</div>
                      <div style={{ background: "white", border: "1px solid #ddd", padding: "6px 10px", fontSize: 12, lineHeight: 1.5, color: "#1a1a1a" }}>{c.body}</div>
                      <div style={{ fontSize: 9, marginTop: 3 }}>
                        <a href="#" onClick={(e)=>e.preventDefault()} style={{ color: "#003a8c", marginRight: 8 }}>reply</a>
                        <a href="#" onClick={(e)=>e.preventDefault()} style={{ color: "#003a8c", marginRight: 8 }}>kudos</a>
                        <a href="#" onClick={(e)=>e.preventDefault()} style={{ color: "#666" }}>flag</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PanelMS>

            {/* DIRECTORY / WEBRING */}
            <PanelMS color="#3DDC84" title="afterhour47's webring (visit my friends!)">
              <div style={{ padding: 8, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                {[
                  { l: "lost & found", to: "lost", c: "#FF1FA0" },
                  { l: "company phone", to: "phone", c: "#FFEB3D" },
                  { l: "newsstand", to: "newsstand", c: "#1FE6FF" },
                  { l: "the rack", to: "rack", c: "#9D4EDD" },
                  { l: "idle hands ★", to: "idlehands", c: "#FFB23D" },
                  { l: "staff only", to: "staff", c: "#444" },
                  { l: "sleepernet", to: "search", c: "#003a8c" },
                  { l: "front desk", to: "portal", c: "#FF6BCB" },
                  { l: "do not click", to: null, c: "#FF1FA0", action: () => alert("noted.") },
                ].map((row, i) => (
                  <button key={i} onClick={() => row.action ? row.action() : go(row.to)} style={{
                    all: "unset", cursor: "pointer", display: "block", textAlign: "center", padding: "6px 4px",
                    background: row.c, color: row.c === "#FFEB3D" ? "#003a8c" : "white",
                    fontSize: 11, fontWeight: "bold", border: "2px solid #003a8c",
                    textShadow: row.c === "#FFEB3D" ? "none" : "1px 1px 0 rgba(0,0,0,0.3)",
                  }}>★ {row.l} ★</button>
                ))}
              </div>
            </PanelMS>

            {/* MARQUEE-LIKE STATUS LINE */}
            <div style={{ background: "#FFEB3D", border: "2px solid #003a8c", padding: "6px 12px", overflow: "hidden", fontSize: 11, fontFamily: "Courier", color: "#003a8c" }}>
              <div className="marquee" style={{ display: "inline-block", whiteSpace: "nowrap", animation: "ahmarq 28s linear infinite" }}>
                {STATUS_LINES.map(s => "★ " + s + " ").join("  ")} ★ {STATUS_LINES.map(s => "★ " + s + " ").join("  ")}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: 24, padding: 16, background: "white", border: "1px solid #003a8c", textAlign: "center", fontSize: 11, color: "#666", lineHeight: 1.6 }}>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
            {[
              { t: "★ break SPACE certified", c: "#FF1FA0" },
              { t: "best viewed @ 800x600", c: "#003a8c" },
              { t: "NETSCAPE NOW!", c: "#1FE6FF" },
              { t: "UNDER CONSTRUCTION", c: "#FFB23D" },
              { t: "MEMBER · WEBRING", c: "#9D4EDD" },
              { t: "OFF CLOCK SAFE", c: "#3DDC84" },
            ].map((b, i) => (
              <span key={i} style={{ padding: "3px 7px", background: b.c, color: b.c === "#FFEB3D" ? "#003a8c" : "white", fontSize: 9, fontWeight: "bold", border: "1px solid #003a8c", letterSpacing: "0.05em" }}>{b.t}</span>
            ))}
          </div>
          <div>© break <span style={{ color: "#FF1FA0" }}>SPACE</span> 2003-∞ · <a href="#" onClick={(e)=>{e.preventDefault(); go("portal");}} style={{ color: "#003a8c" }}>clock back in</a> · <a href="#" onClick={(e)=>{e.preventDefault(); go("staff");}} style={{ color: "#003a8c" }}>staff</a> · <span style={{ color: "#FF1FA0" }}>profile views {visits.toLocaleString()}</span></div>
          <div style={{ fontSize: 10, marginTop: 6, fontStyle: "italic" }}>{employee ? "logged in as " + employee.id : "anonymous · no file"} · this profile does not officially exist</div>
        </div>
      </div>

      <style>{`
        @keyframes ahmarq {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

// ============= MYSPACE PANEL =============
function PanelMS({ color, title, children }) {
  return (
    <div style={{ background: "white", border: "1px solid " + color, boxShadow: "2px 2px 0 rgba(0,0,0,0.15)" }}>
      <div style={{ background: color, color: color === "#FFEB3D" ? "#003a8c" : "white", padding: "4px 10px", fontSize: 11, fontWeight: "bold", letterSpacing: "0.02em", textShadow: color === "#FFEB3D" ? "none" : "1px 1px 0 rgba(0,0,0,0.25)", borderBottom: "1px solid #003a8c" }}>
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

window.ClockOutGate = ClockOutGate;
window.AfterHours = AfterHours;
