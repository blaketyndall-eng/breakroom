// OmniShift Employee Portal — cursed HR SaaS
const { useState: useStateP, useEffect: useEffectP } = React;

function OmniShiftPortal({ employee, openSignup, go }) {
  if (!employee) {
    return (
      <div data-section="omnishift" style={{ minHeight: "calc(100vh - 28px)" }}>
        <div className="os-bar" style={{ padding: "10px 18px", display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span>OMNISHIFT · WORKFORCE ROUTING SYSTEM v4.7</span>
          <span>portal.omnishift.work</span>
        </div>
        <div className="wrap" style={{ paddingTop: 60, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.2em", color: "#5a6b58" }}>EMPLOYEE SIGN IN</div>
          <h1 style={{ fontFamily: "var(--type-ui)", fontSize: 38, fontWeight: 900, marginTop: 8 }}>You are not yet employed.</h1>
          <p style={{ color: "#3a4a3a", maxWidth: 460, margin: "10px auto 22px" }}>This is unusual. Most visitors are hired before they arrive. Please subscribe to anything to begin onboarding.</p>
          <button className="btn-stamp" onClick={openSignup}>BEGIN ONBOARDING →</button>
        </div>
        <OmniShiftFooter variant="portal" session="GUEST" />
      </div>
    );
  }

  const [tab, setTab] = useStateP("dashboard");
  const [reviewOpen, setReviewOpen] = useStateP(false);
  const [perfReview, setPerfReview] = useStateP(null);
  const [loadingReview, setLoadingReview] = useStateP(false);

  const requestReview = async () => {
    setLoadingReview(true); setReviewOpen(true);
    try {
      const text = await window.claude.complete({
        messages: [{ role: "user", content: `Write a short, deadpan, fictional and absurd performance review for an OmniShift employee. 4 sentences. Mention these specifics, dryly: department "${employee.department}", role "${employee.role}", assigned object "${employee.object}", and that they continue existing in the room. Tone: cursed corporate HR. Sign off with /s/ Management. No quotes around output.` }]
      });
      setPerfReview(text);
    } catch (e) {
      setPerfReview("Performance has been observed. Performance is satisfactory. Continue existing in the room until further notice.\n\n/s/ Management");
    }
    setLoadingReview(false);
  };

  const memos = [
    "Reminder: The room clock is not broken. It reads what time it is when it reads it.",
    "Please stop reporting the swan. She is on retainer.",
    "Uniform compliance has improved by 4%. The metric remains undefined.",
    "The coffee is not fresh. It is active. Do not consume, photograph, or thank it.",
    "Employees may not opt out of being observed. Observation is a benefit, not a condition.",
    "RE: applause money — please stop submitting expense reports for it. — Finance",
  ];

  const incidents = [
    { id: "INC-0011", t: "Swan-related transport irregularity", status: "OPEN", color: "var(--warning)" },
    { id: "INC-0027", t: "Unauthorized gratitude toward the room", status: "MONITORING", color: "var(--motel-blue)" },
    { id: "INC-0044", t: "Coffee freshness could not be verified", status: "ACTIVE", color: "var(--beer-red)" },
  ];

  return (
    <div data-section="omnishift" style={{ minHeight: "calc(100vh - 28px)" }}>
      <div className="os-bar" style={{ padding: "10px 18px", display: "flex", justifyContent: "space-between", fontSize: 13, alignItems: "center", gap: 12 }}>
        <span>OMNISHIFT · {employee.id} · {employee.department}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="os-blink" style={{ background: "var(--warning)", color: "#2a1f00", padding: "2px 8px", fontFamily: "var(--type-mono)", fontSize: 11 }}>SHIFT ACTIVE</span>
          <button onClick={() => go("clockout")} title="End approved session" style={{
            all: "unset", cursor: "pointer", padding: "4px 12px",
            background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.4)",
            fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.14em", color: "white",
          }}>CLOCK OUT ▸</button>
        </span>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #c4cfc1", background: "white" }}>
        <div className="wrap" style={{ display: "flex", gap: 0 }}>
          {["dashboard","memos","incidents","reviews"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "12px 18px", border: "none", background: tab === t ? "#e7eee5" : "transparent",
              borderBottom: tab === t ? "3px solid var(--dashboard)" : "3px solid transparent",
              fontFamily: "var(--type-ui)", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
              color: tab === t ? "var(--ink)" : "#5a6b58", cursor: "pointer",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
        {tab === "dashboard" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 18 }}>
              <div className="os-card" style={{ padding: 22 }}>
                <div className="os-label">WELCOME</div>
                <h2 style={{ fontFamily: "var(--type-ui)", fontSize: 28, fontWeight: 800, margin: "4px 0 4px" }}>Welcome, Employee {employee.id}.</h2>
                <p style={{ color: "#3a4a3a", margin: 0 }}>Your shift began before you noticed.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
                  <Cell label="Department" value={employee.department} />
                  <Cell label="Role" value={employee.role} />
                  <Cell label="Assigned Object" value={employee.object} />
                  <Cell label="Shift" value={employee.shift} />
                  <Cell label="Uniform" value={employee.uniform} />
                  <Cell label="Next Review" value="3:17 a.m., unspecified date" />
                </div>
              </div>
              <div className="os-card" style={{ padding: 22 }}>
                <div className="os-label">HOUSE RULE — ASSIGNED</div>
                <div style={{ fontFamily: "var(--type-paper)", fontSize: 22, lineHeight: 1.15, marginTop: 6, color: "var(--ink)" }}>
                  "{employee.rule}"
                </div>
                <div className="os-warn" style={{ marginTop: 14 }}>⚠ Compliance is observation in a polite shirt.</div>
                <button className="btn-stamp" style={{ marginTop: 14, width: "100%" }} onClick={requestReview}>REQUEST PERFORMANCE REVIEW</button>
              </div>
            </div>

            <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <Stat label="Productivity" value="undefined" />
              <Stat label="Observability" value="100%" />
              <Stat label="Tenure" value="2:41 hrs" />
            </div>

            <div className="os-card" style={{ padding: 22, marginTop: 22 }}>
              <div className="os-label">ARTIFACT COLLECTION</div>
              <p style={{ fontSize: 13, color: "#3a4a3a", margin: "4px 0 12px" }}>You have been issued <strong>1</strong> artifact. Retrieve more by visiting the Lost &amp; Found.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
                <ArtifactSlot label={employee.object} unlocked />
                {window.BREAKROOM_DATA.objectsForHire.filter(o => o !== employee.object).slice(0, 5).map(o => <ArtifactSlot key={o} label={o} />)}
              </div>
              <button className="btn-pill" style={{ marginTop: 14 }} onClick={() => go("lost")}>→ Lost &amp; Found</button>
            </div>
          </>
        )}

        {tab === "memos" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {memos.map((m, i) => (
              <FaxPaper key={i} stamp={i === 2 ? "URGENT" : i === 4 ? "OBSERVED" : null}>
                <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#5a513f" }}>OMNISHIFT MEMO #{String(31 + i * 6).padStart(3, "0")}</div>
                <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5 }}>{m}</div>
                <div style={{ marginTop: 14, fontSize: 11, color: "#5a513f", borderTop: "1px dashed #c8bfa6", paddingTop: 8 }}>
                  /s/ Management · Issued: {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                </div>
              </FaxPaper>
            ))}
          </div>
        )}

        {tab === "incidents" && (
          <div className="os-card" style={{ padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#e7eee5", textAlign: "left" }}>
                  <th style={tcell}>ID</th><th style={tcell}>INCIDENT</th><th style={tcell}>STATUS</th><th style={tcell}>ASSIGNED</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((i) => (
                  <tr key={i.id} style={{ borderTop: "1px solid #c4cfc1" }}>
                    <td style={tcell}><code>{i.id}</code></td>
                    <td style={tcell}>{i.t}</td>
                    <td style={tcell}><span style={{ background: i.color, color: "#0a0908", padding: "2px 8px", fontFamily: "var(--type-mono)", fontSize: 11, fontWeight: 700 }}>{i.status}</span></td>
                    <td style={tcell}>{employee.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "reviews" && (
          <div className="os-card" style={{ padding: 22 }}>
            <div className="os-label">PERFORMANCE</div>
            <h3 style={{ fontFamily: "var(--type-ui)", fontSize: 22, fontWeight: 800, marginTop: 4 }}>Generate a performance review</h3>
            <p style={{ color: "#3a4a3a", fontSize: 14 }}>Reviews are written by Management. Management is unavailable. The system will improvise.</p>
            <button className="btn-stamp" onClick={requestReview} disabled={loadingReview}>{loadingReview ? "WRITING…" : "WRITE REVIEW"}</button>
            {perfReview && (
              <FaxPaper stamp="OBSERVED" style={{ marginTop: 18 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#5a513f" }}>PERFORMANCE REVIEW · {employee.id}</div>
                <div style={{ marginTop: 10, fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{perfReview}</div>
              </FaxPaper>
            )}
          </div>
        )}
      </div>
      <OmniShiftFooter variant="portal" session={`E-${employee.id}`} />
    </div>
  );
}

const tcell = { padding: "10px 14px", fontSize: 13, fontFamily: "var(--type-mono)" };

function Cell({ label, value }) {
  return (
    <div style={{ background: "#f6f9f5", border: "1px solid #c4cfc1", padding: "8px 12px" }}>
      <div className="os-label">{label}</div>
      <div className="os-value">{value}</div>
    </div>
  );
}
function Stat({ label, value }) {
  return (
    <div className="os-card" style={{ padding: 18 }}>
      <div className="os-label">{label}</div>
      <div style={{ fontFamily: "var(--type-mono)", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginTop: 4 }}>{value}</div>
    </div>
  );
}
function ArtifactSlot({ label, unlocked }) {
  return (
    <div style={{
      border: "1px solid " + (unlocked ? "var(--dashboard)" : "#c4cfc1"),
      background: unlocked ? "white" : "repeating-linear-gradient(45deg,#eef3eb 0 6px,#f6f9f5 6px 12px)",
      padding: 10, fontFamily: "var(--type-mono)", fontSize: 11,
      color: unlocked ? "var(--ink)" : "#9aa898", height: 80,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      <div style={{ letterSpacing: "0.1em", fontSize: 9, color: "#5a6b58" }}>{unlocked ? "ISSUED" : "UNCLAIMED"}</div>
      <div style={{ fontWeight: 700, fontSize: 11, lineHeight: 1.2 }}>{unlocked ? label : "▓▓▓▓▓▓▓▓▓▓"}</div>
    </div>
  );
}

window.OmniShiftPortal = OmniShiftPortal;
