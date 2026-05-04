// MAIN APP — orchestrates routing between sites-within-site

const { useState: useStateMain, useEffect: useEffectMain } = React;

// Small ribbon that announces a mode change for ~3s, then fades.
function SiteModeBanner({ mode }) {
  const [visible, setVisible] = useStateMain(false);
  const [shown, setShown] = useStateMain(mode);
  const firstRef = React.useRef(true);
  useEffectMain(() => {
    if (firstRef.current) { firstRef.current = false; return; }
    setShown(mode);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, [mode]);
  if (!visible) return null;
  const copy = shown === "DAY"
    ? { line1: "BREAKROOM · DAYTIME OPS", line2: "Approved content only. Have a productive shift.", bg: "#2a8f5b", fg: "#fff" }
    : shown === "CLOSED"
    ? { line1: "BREAKROOM · CLOSED", line2: "Lights are off. The door is the only thing visible.", bg: "#050605", fg: "#33ff66" }
    : { line1: "BREAKROOM · AFTER HOURS", line2: "1:47 AM. Stay as long as you want.", bg: "#1a1a14", fg: "#ffaa6b" };
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9300,
      background: copy.bg, color: copy.fg,
      padding: "8px 14px",
      fontFamily: "var(--type-mono)",
      fontSize: 11, letterSpacing: "0.18em",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      borderBottom: "1px solid rgba(255,255,255,0.15)",
      animation: "siteModeIn 0.4s ease",
    }}>
      <span style={{ fontWeight: 700 }}>{copy.line1}</span>
      <span style={{ opacity: 0.8, textTransform: "none", letterSpacing: "0.04em", fontStyle: "italic" }}>{copy.line2}</span>
    </div>
  );
}

function App() {
  const ROUTES = ["search","newsstand","portal","phone","lost","rack","staff","breakroom","clockout","afterhours","idlehands"];
  const [page, setPage] = useStateMain(() => {
    const hash = location.hash.replace("#","");
    return ROUTES.includes(hash) ? hash : "search";
  });
  const [signupOpen, setSignupOpen] = useStateMain(false);
  const [employee, setEmployee] = useStateMain(() => {
    try { return JSON.parse(localStorage.getItem("breakroom_employee") || "null"); } catch(e) { return null; }
  });

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "siteMode": "3AM",
    "cursed": 0.7,
    "scanlines": true,
    "showBookmarks": true
  }/*EDITMODE-END*/;

  const [tweaks, setTweak] = window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}];

  // apply cursed level + site mode
  useEffectMain(() => {
    document.documentElement.style.setProperty("--cursed", String(tweaks.cursed));
  }, [tweaks.cursed]);
  useEffectMain(() => {
    document.documentElement.setAttribute("data-site-mode", tweaks.siteMode || "3AM");
  }, [tweaks.siteMode]);

  const go = (p) => { setPage(p); window.scrollTo({ top: 0 }); location.hash = p; };

  useEffectMain(() => {
    const onHash = () => {
      const h = location.hash.replace("#","");
      if (ROUTES.includes(h)) setPage(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const onHired = (data) => { setEmployee(data); go("portal"); };

  return (
    <div className={(tweaks.scanlines ? "scanlines " : "") + "grain"}>
      {tweaks.showBookmarks && <CursedBookmarks active={page} go={go} />}
      <SiteModeBanner mode={tweaks.siteMode} />

      {page === "search" && <SleeperNet go={go} openSignup={() => setSignupOpen(true)} />}
      {page === "newsstand" && <Newsstand go={go} openSignup={() => setSignupOpen(true)} employee={employee} />}
      {page === "portal" && <OmniShiftPortal employee={employee} openSignup={() => setSignupOpen(true)} go={go} />}
      {page === "phone" && <CompanyPhone go={go} />}
      {page === "lost" && <LostFound go={go} employee={employee} />}
      {page === "rack" && <TheRack go={go} employee={employee} />}
      {page === "staff" && <StaffOnly go={go} employee={employee} />}
      {page === "breakroom" && <BreakroomLanding go={go} employee={employee} />}
      {page === "clockout" && <ClockOutGate onDone={() => go("afterhours")} go={go} />}
      {page === "afterhours" && <AfterHours go={go} employee={employee} />}
      {page === "idlehands" && <IdleHands go={go} employee={employee} />}

      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} onHired={onHired} />

      {/* Persistent employee badge */}
      {employee && page !== "portal" && (
        <button onClick={() => go("portal")} style={{
          position: "fixed", bottom: 14, left: 14, zIndex: 9100,
          background: "var(--dashboard)", color: "white", border: "1px solid #1a5a35",
          padding: "8px 12px", fontFamily: "var(--type-mono)", fontSize: 11,
          letterSpacing: "0.1em", cursor: "pointer",
          boxShadow: "2px 2px 0 rgba(0,0,0,0.5)",
        }}>
          ▲ {employee.id} · {employee.department.toUpperCase()}
        </button>
      )}

      {/* Tweaks panel */}
      {window.TweaksPanel && (
        <window.TweaksPanel>
          <window.TweakSection label="Site Mode">
            <window.TweakRadio value={tweaks.siteMode} onChange={(v) => setTweak("siteMode", v)} options={[
              { value: "DAY", label: "Day" },
              { value: "3AM", label: "3 AM" },
              { value: "CLOSED", label: "Closed" },
            ]} />
            <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>
              {tweaks.siteMode === "DAY" && "Sanitized. Approved items only."}
              {tweaks.siteMode === "3AM" && "Default. The night bleeds through."}
              {tweaks.siteMode === "CLOSED" && "Lights off. Only the door is visible."}
            </div>
          </window.TweakSection>
          <window.TweakSection label="Cursed-ness">
            <window.TweakSlider min={0} max={1} step={0.05} value={tweaks.cursed} onChange={(v) => setTweak("cursed", v)} />
          </window.TweakSection>
          <window.TweakSection label="Overlays">
            <window.TweakToggle label="Scanlines" value={tweaks.scanlines} onChange={(v) => setTweak("scanlines", v)} />
            <window.TweakToggle label="Bookmark bar" value={tweaks.showBookmarks} onChange={(v) => setTweak("showBookmarks", v)} />
          </window.TweakSection>
          <window.TweakSection label="Jump to layer">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {["search","newsstand","portal","phone","lost","rack","breakroom","staff","clockout","afterhours","idlehands"].map(p => (
                <window.TweakButton key={p} onClick={() => go(p)}>{p}</window.TweakButton>
              ))}
            </div>
          </window.TweakSection>
          {employee && (
            <window.TweakSection label="Employment">
              <window.TweakButton onClick={() => { localStorage.removeItem("breakroom_employee"); setEmployee(null); }}>Resign (delete employee)</window.TweakButton>
            </window.TweakSection>
          )}
        </window.TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
