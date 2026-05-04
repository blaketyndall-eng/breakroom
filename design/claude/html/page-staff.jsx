// Staff Only — locked door / phosphor terminal
const { useState: useStateSt, useEffect: useEffectSt } = React;

function StaffOnly({ go, employee }) {
  const [code, setCode] = useStateSt("");
  const [denied, setDenied] = useStateSt(false);
  const [granted, setGranted] = useStateSt(false);
  const [boot, setBoot] = useStateSt(0);

  useEffectSt(() => {
    if (granted) {
      let i = 0;
      const lines = [
        "SLEEPERNET STAFF TERMINAL · v0.47",
        "negotiating with the room………… ok",
        "fluorescent operations…………………… ok",
        "swan custody……………………………………………… disputed",
        "applause money reserves……………………… non-zero",
        "WELCOME, " + (employee?.id || "X-0147") + ".",
        "you are employed, and now trusted.",
      ];
      const t = setInterval(() => {
        setBoot(b => b + 1);
        i++;
        if (i >= lines.length) clearInterval(t);
      }, 350);
      return () => clearInterval(t);
    }
  }, [granted]);

  const lines = [
    "SLEEPERNET STAFF TERMINAL · v0.47",
    "negotiating with the room………… ok",
    "fluorescent operations…………………… ok",
    "swan custody……………………………………………… disputed",
    "applause money reserves……………………… non-zero",
    "WELCOME, " + (employee?.id || "X-0147") + ".",
    "you are employed, and now trusted.",
  ];

  const tryCode = () => {
    const k = code.trim().toLowerCase();
    if (["1:47","147","cluck out","clock out","chalk up","applause","swan","x-0147"].includes(k)) {
      setGranted(true); setDenied(false);
    } else {
      setDenied(true);
      setTimeout(() => setDenied(false), 1500);
    }
  };

  return (
    <div data-section="staff" style={{ minHeight: "calc(100vh - 28px)", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="crt" style={{ fontSize: 28, letterSpacing: "0.1em", textAlign: "center" }}>
        STAFF ONLY
      </div>
      <div className="crt staff-mono" style={{ fontSize: 13, color: "#1a8a40", marginTop: 8, letterSpacing: "0.18em", textAlign: "center" }}>
        staff.▓▓▓▓▓▓.local
      </div>

      {!granted ? (
        <>
          <div className="crt" style={{ fontSize: 22, marginTop: 50, maxWidth: 600, textAlign: "center", lineHeight: 1.4 }}>
            this door opens when the room says so.<br/>
            <span style={{ color: "#1a8a40" }}>access denied. you are employed, not trusted.</span>
          </div>
          <div className="crt" style={{ fontSize: 18, marginTop: 36, color: "#1a8a40", maxWidth: 520, textAlign: "center" }}>
            ENTER CODE — try a time, a sound, a rule, a drink, a swan
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 0 }}>
            <input value={code} onChange={(e)=>setCode(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter")tryCode();}} placeholder="▓▓▓▓▓▓" autoFocus />
            <button onClick={tryCode}>ENTER</button>
          </div>
          {denied && <div className="crt" style={{ marginTop: 18, color: "var(--beer-red)", fontSize: 22 }}>DENIED. The room remembers this attempt.</div>}
          <div className="crt" style={{ marginTop: 36, fontSize: 14, color: "#1a8a40" }}>hint: the room clock reads <span className="blink">1:47</span></div>
          <a href="#" onClick={(e)=>{e.preventDefault(); go("search");}} style={{ color: "#1a8a40", marginTop: 28, fontSize: 16 }}>← back to SleeperNet</a>
        </>
      ) : (
        <div style={{ marginTop: 30, width: "min(720px, 100%)" }}>
          <div className="crt staff-mono" style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: "pre" }}>
            {lines.slice(0, boot).map((l, i) => (
              <div key={i}>&gt; {l}</div>
            ))}
            {boot < lines.length && <div className="blink" style={{ display: "inline-block" }}>&gt; </div>}
          </div>
          {boot >= lines.length && (
            <div style={{ marginTop: 32, border: "1px solid var(--phosphor)", padding: 18 }}>
              <div className="crt" style={{ fontSize: 20 }}>UNRELEASED FILES</div>
              <div className="crt staff-mono" style={{ fontSize: 14, lineHeight: 1.8, marginTop: 10 }}>
                &gt; <a href="#" style={{ color: "var(--phosphor)" }} onClick={(e)=>{e.preventDefault(); go("rack");}}>SHIFT END / DROP 02 — leaked product list (held)</a><br/>
                &gt; <a href="#" style={{ color: "var(--phosphor)" }} onClick={(e)=>{e.preventDefault(); go("newsstand");}}>SECRET HEADLINE: the swan signed a non-disclosure</a><br/>
                &gt; <a href="#" style={{ color: "var(--phosphor)" }} onClick={(e)=>{e.preventDefault(); go("phone");}}>VOICEMAIL — Miss September, never delivered</a><br/>
                &gt; <a href="#" style={{ color: "var(--phosphor)" }} onClick={(e)=>{e.preventDefault(); go("lost");}}>OBJECT 047 — withheld pending custody</a><br/>
                &gt; corporate leak: <span style={{ color: "var(--warning)" }}>OmniShift hired 1,847 employees who never applied</span><br/>
                &gt; the wall clock will move. not soon. <span className="blink"></span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

window.StaffOnly = StaffOnly;
