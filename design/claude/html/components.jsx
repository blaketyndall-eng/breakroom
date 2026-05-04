// Shared components for SleeperNet/OmniShift/Breakroom

const { useState, useEffect, useRef, useMemo, Fragment } = React;

// =============== CANONICAL LORE GLOSSARY ===============
// Single source of truth. All pages reference this. Do not invent variants.
const LORE = {
  TIME: "1:47 AM",                          // the wall clock. corrected twice. returned on its own.
  CLOCK_LOCATION: "above the door",
  KEY: "Motel Key No. 8",                    // the room you are not in
  FEATHER: "swan feather",                   // miss september brought it
  RADIO: "the radio miss september borrowed",
  CHALK: "pool chalk in a jewelry box",      // marty from nowhere
  CHAIN: "gold chain in the microwave",      // again
  RECEIPT: "receipt with no total",
  CIGARETTE: "matchbook from a place that doesn't print matchbooks anymore",
  CURRENCY: "applause money",
  COFFEE: "burnt coffee",
  PRAYER_BASE: 12847,                        // prayer counter starting value
  VISITOR_BASE: 18439,
  // Recurring people
  DRIVER: "the driver",                      // red lowrider, parks adjacent, never parks
  MISS_SEPTEMBER: "miss september",          // passenger seat, unverified, took the radio
  KID_MOP: "the kid w/ the mop",             // closing crew, speaks between mop strokes
  CLERK: "the 7/11 clerk",                   // knows about the hot dogs
  GRILL: "the man with the gold grill",      // booth three
  // Places
  BOOTH: "Booth 3",                          // open until 2:13. no cameras.
  BACK_BOOTH_CLOSE: "2:13 AM",
  LOT: "the lowrider lot",
  REAL_ROOM: "Deep Eddy Cabaret",            // Austin, TX. only verified room.
};
window.LORE = LORE;

// =============== TOP NAV (cursed browser-bookmarks bar) ===============
function CursedBookmarks({ active, go }) {
  const items = [
    { id: "search", label: "SleeperNet", url: "sleeper.net" },
    { id: "newsstand", label: "Newsstand", url: "newsstand.sleeper.net" },
    { id: "portal", label: "OmniShift Portal", url: "portal.omnishift.work" },
    { id: "phone", label: "Company Phone", url: "phone.omnishift.work" },
    { id: "lost", label: "Lost & Found", url: "lost.sleeper.net" },
    { id: "rack", label: "The Rack", url: "rack.breakroom.local" },
    { id: "staff", label: "Staff Only", url: "staff.▓▓▓▓▓▓.local" },
  ];
  return (
    <div style={{
      background: "#1a1714", color: "#c8bfa6",
      borderBottom: "1px solid #000",
      fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.05em",
      padding: "5px 12px", display: "flex", gap: 14, alignItems: "center",
      overflowX: "auto", whiteSpace: "nowrap",
    }}>
      <span style={{ color: "#5a513f" }}>★ Bookmarks:</span>
      {items.map(it => (
        <a key={it.id} href="#" onClick={(e) => { e.preventDefault(); go(it.id); }}
          style={{
            color: active === it.id ? "var(--warning)" : "#c8bfa6",
            textDecoration: active === it.id ? "underline" : "none",
            background: "transparent",
          }}>
          {it.label} <span style={{ color: "#5a513f" }}>· {it.url}</span>
        </a>
      ))}
      <span style={{ marginLeft: "auto", color: "#5a513f" }}>load: 1.47s · 3:17 a.m.</span>
    </div>
  );
}

// =============== SLEEPERNET WORDMARK ===============
function SleeperWordmark({ size = 110 }) {
  const letters = "SleeperNet".split("");
  return (
    <h1 className="sleeper-wordmark" style={{ fontSize: size, margin: 0 }}>
      {letters.map((c, i) => (
        <span key={i} className={`s${(i % 10) + 1} ${i === 4 ? "flicker" : ""}`}>{c}</span>
      ))}
    </h1>
  );
}

// =============== TYPING PLACEHOLDER ===============
function useRotatingPlaceholder(list) {
  const [text, setText] = useState("");
  const ref = useRef({ idx: 0, char: 0, dir: 1 });
  useEffect(() => {
    let timer;
    const tick = () => {
      const s = ref.current;
      const phrase = list[s.idx];
      if (s.dir === 1) {
        s.char++;
        if (s.char >= phrase.length) { s.dir = 0; timer = setTimeout(tick, 1700); setText(phrase); return; }
      } else if (s.dir === 0) {
        s.dir = -1; timer = setTimeout(tick, 80); return;
      } else {
        s.char--;
        if (s.char <= 0) { s.dir = 1; s.idx = (s.idx + 1) % list.length; }
      }
      setText(phrase.slice(0, s.char));
      timer = setTimeout(tick, s.dir === 1 ? 55 + Math.random() * 40 : 25);
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [list]);
  return text;
}

// =============== STRIPED PLACEHOLDER ===============
function Stripe({ label, w = "100%", h = 220, style = {} }) {
  return (
    <div className="stripe" style={{ width: w, height: h, ...style }}>
      [{label}]
    </div>
  );
}

// =============== PRINTABLE PAPER (fax-skewed cards for memos) ===============
function FaxPaper({ children, stamp, style = {} }) {
  return (
    <div className="fax-skew" style={{
      background: "#f6f1df", color: "#14110e",
      padding: "26px 28px", border: "1px solid #c8bfa6",
      boxShadow: "2px 3px 0 rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04) inset",
      fontFamily: "var(--type-typer)",
      position: "relative",
      ...style,
    }}>
      {stamp && <div className="stamp" style={{ top: 18, right: 22 }}>{stamp}</div>}
      {children}
    </div>
  );
}

// =============== OMNISHIFT FOOTER ===============
// Closing system bar. Mirrors the top os-bar so corporate pages feel framed.
// Variants: "phone" | "portal" | "signup" — controls the system label only.
function OmniShiftFooter({ variant = "portal", session }) {
  const labels = {
    phone:  "OMNISHIFT · COMPANY PHONE · v3.1",
    portal: "OMNISHIFT · WORKFORCE ROUTING SYSTEM v4.7",
    signup: "OMNISHIFT · WORKFORCE ROUTING · ONBOARDING",
  };
  const host = {
    phone: "phone.omnishift.work",
    portal: "portal.omnishift.work",
    signup: "onboarding.omnishift.work",
  };
  // Stable build hash so it doesn't reflow on every render
  const buildHash = useMemo(() => {
    const chars = "0123456789abcdef";
    let h = ""; for (let i = 0; i < 7; i++) h += chars[Math.floor(Math.random() * 16)];
    return h;
  }, []);
  const sess = session || `S-${Math.floor(Math.random() * 9000 + 1000)}`;
  return (
    <div style={{ marginTop: 40 }}>
      <div className="os-bar" style={{
        padding: "8px 18px", display: "flex", justifyContent: "space-between",
        fontSize: 11, letterSpacing: "0.12em", alignItems: "center", flexWrap: "wrap", gap: 10,
      }}>
        <span>{labels[variant]} · build {buildHash}</span>
        <span style={{ display: "flex", gap: 14, alignItems: "center", fontFamily: "var(--type-mono)" }}>
          <span>session {sess}</span>
          <span style={{ opacity: 0.7 }}>·</span>
          <span>{host[variant]}</span>
        </span>
      </div>
      <div style={{
        background: "#1a2218", color: "#a8b5a3", padding: "8px 18px",
        fontSize: 10, fontFamily: "var(--type-mono)", letterSpacing: "0.1em",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
      }}>
        <span>⚠ THIS SESSION IS MONITORED FOR COMPLIANCE, MORALE, AND CONTINUITY.</span>
        <span style={{ opacity: 0.6 }}>OMNISHIFT INDUSTRIES · A SUBSIDIARY OF SOMETHING LARGER</span>
      </div>
    </div>
  );
}

// Export to window
Object.assign(window, {
  CursedBookmarks, SleeperWordmark, useRotatingPlaceholder, Stripe, FaxPaper, OmniShiftFooter,
});
