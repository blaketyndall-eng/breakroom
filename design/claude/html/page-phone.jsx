// Company Phone — voicemail transcript inbox
const { useState: useStatePh } = React;

function CompanyPhone({ go }) {
  const D = window.BREAKROOM_DATA;
  const [active, setActive] = useStatePh(0);
  const v = D.voicemails[active];

  return (
    <div data-section="omnishift" style={{ minHeight: "calc(100vh - 28px)" }}>
      <div className="os-bar" style={{ padding: "10px 18px", display: "flex", justifyContent: "space-between", fontSize: 13 }}>
        <span>OMNISHIFT · COMPANY PHONE · v3.1</span>
        <span style={{ fontFamily: "var(--type-mono)" }}>phone.omnishift.work</span>
      </div>
      <div className="wrap" style={{ paddingTop: 22, paddingBottom: 60 }}>
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18 }}>
          {/* inbox */}
          <div className="os-card" style={{ padding: 0 }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #c4cfc1", fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.18em", color: "#5a6b58" }}>
              VOICEMAIL · {D.voicemails.length} NEW · ALL UNREAD
            </div>
            {D.voicemails.map((m, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                all: "unset", cursor: "pointer", width: "100%", display: "block",
                padding: "12px 14px", borderBottom: "1px solid #e0e6dd",
                background: active === i ? "#e7eee5" : "white",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontFamily: "var(--type-ui)", fontSize: 13 }}>{m.from}</strong>
                  <span style={{ fontFamily: "var(--type-mono)", fontSize: 10, color: "#5a6b58" }}>{m.time}</span>
                </div>
                <div style={{ fontSize: 12, color: "#3a4a3a", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.body}</div>
              </button>
            ))}
          </div>

          {/* transcript */}
          <div className="os-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px dashed #c4cfc1", paddingBottom: 10 }}>
              <div>
                <div className="os-label">FROM</div>
                <div style={{ fontFamily: "var(--type-ui)", fontSize: 22, fontWeight: 800 }}>{v.from}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="os-label">RECEIVED</div>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 14 }}>{v.time}</div>
              </div>
            </div>
            <div style={{ marginTop: 16, fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.18em", color: "#5a6b58" }}>TRANSCRIPT · auto-generated · accuracy not guaranteed</div>
            <div style={{ marginTop: 6, padding: "16px 18px", background: "#f6f9f5", border: "1px solid #c4cfc1", fontFamily: "var(--type-typer)", fontSize: 16, lineHeight: 1.55, minHeight: 140 }}>
              {v.body}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="btn-pill" disabled style={{ opacity: 0.5 }}>▶ Play (audio unavailable)</button>
              <button className="btn-pill" onClick={() => setActive((active + 1) % D.voicemails.length)}>Next →</button>
              <button className="btn-pill" onClick={() => alert("Reply received. Reply ignored. Thank you.")}>Reply</button>
            </div>
            <div className="os-warn" style={{ marginTop: 18 }}>⚠ Replies are received but not reviewed. Continue calling anyway.</div>
          </div>
        </div>
      </div>
      <OmniShiftFooter variant="phone" />
    </div>
  );
}

window.CompanyPhone = CompanyPhone;
