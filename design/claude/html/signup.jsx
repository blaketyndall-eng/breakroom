// Signup modal -> "you've been hired" reveal -> assignment

const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateAssignment(email) {
  const D = window.BREAKROOM_DATA;
  const seed = (email || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) || Date.now();
  const pick = (arr, off = 0) => arr[(seed + off) % arr.length];
  const id = "X-" + String(((seed * 31) % 9999)).padStart(4, "0");
  return {
    id,
    email,
    department: pick(D.departments, 0),
    role: pick(D.roles, 1),
    shift: pick(D.shifts, 2),
    object: pick(D.objectsForHire, 3),
    uniform: pick(D.uniforms, 4),
    rule: pick(D.houseRules, 5),
    issued: new Date().toLocaleString("en-US", { hour: "numeric", minute: "2-digit", weekday: "short", month: "short", day: "numeric" }),
  };
}

function SignupModal({ open, onClose, onHired }) {
  const [pretext, setPretext] = useStateA(0);
  const [email, setEmail] = useStateA("");
  const [stage, setStage] = useStateA("form"); // form | processing | hired
  const [hireData, setHireData] = useStateA(null);
  const pretexts = [
    "Sign up for 3AM Edition",
    "Get Lost Object Alerts",
    "Notify me if the clock changes",
    "Save this search",
    "Claim Motel Key No. 8",
    "Subscribe to Room Notes",
  ];

  useEffectA(() => {
    if (!open) { setStage("form"); setEmail(""); setHireData(null); }
  }, [open]);

  if (!open) return null;

  const submit = () => {
    if (!email.includes("@")) { setEmail(email + (email ? "" : "")); return; }
    setStage("processing");
    setTimeout(() => {
      const a = generateAssignment(email);
      setHireData(a);
      try { localStorage.setItem("breakroom_employee", JSON.stringify(a)); } catch(e) {}
      setStage("hired");
    }, 1900);
  };

  const goPortal = () => {
    onHired(hireData);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9500,
      background: "rgba(8,7,6,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#f6f1df", color: "var(--ink)",
        width: "min(620px, 100%)", maxHeight: "90vh", overflow: "auto",
        border: "2px solid var(--ink)",
        boxShadow: "8px 10px 0 var(--beer-red)",
        position: "relative",
      }}>
        {/* HARMLESS PRETEXT FORM */}
        {stage === "form" && (
          <div style={{ padding: 32 }}>
            <div style={{ fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.18em", color: "#5a513f" }}>
              SLEEPERNET · NEWSLETTER OPT-IN
            </div>
            <h2 style={{ fontFamily: "var(--type-paper)", fontSize: 38, lineHeight: 1, margin: "10px 0 14px" }}>
              {pretexts[pretext]}
            </h2>
            <p style={{ fontSize: 14, color: "#3a3328", lineHeight: 1.5 }}>
              Get the 3AM Edition delivered to a place you check at 3 a.m. We will not spam you. We will occasionally publish your handwriting.
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12, marginBottom: 20 }}>
              {pretexts.map((p, i) => (
                <button key={i} onClick={() => setPretext(i)} style={{
                  fontFamily: "var(--type-mono)", fontSize: 10, letterSpacing: "0.1em",
                  padding: "4px 8px", border: "1px solid #c8bfa6",
                  background: pretext === i ? "var(--ink)" : "transparent",
                  color: pretext === i ? "var(--nicotine)" : "#5a513f",
                }}>{p}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 0, border: "1.5px solid var(--ink)", background: "white" }}>
              <input value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                placeholder="email@somewhere.late" style={{
                  flex: 1, border: "none", outline: "none", padding: "14px 16px", fontSize: 16,
                  background: "transparent", color: "var(--ink)",
                }} autoFocus />
              <button className="btn-stamp" onClick={submit} style={{ borderRadius: 0 }}>SUBSCRIBE</button>
            </div>
            <div style={{ fontFamily: "var(--type-mono)", fontSize: 10, color: "#5a513f", marginTop: 14, lineHeight: 1.5 }}>
              By subscribing you agree to receive the 3AM Edition. Unsubscribing is permitted but discouraged.
              <span style={{ opacity: 0.5 }}> Other terms may apply. Other terms always apply.</span>
            </div>
            <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>×</button>
          </div>
        )}

        {/* PROCESSING */}
        {stage === "processing" && (
          <div style={{ padding: 60, textAlign: "center", fontFamily: "var(--type-mono)", fontSize: 13, color: "#3a3328" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#5a513f" }}>SLEEPERNET</div>
            <div style={{ marginTop: 22, fontSize: 18 }}>processing subscription<span className="blink"></span></div>
            <div style={{ marginTop: 8, opacity: 0.6 }}>verifying ▓▓▓▓▓▓▓▓ · forwarding ▓▓▓▓▓▓ · cross-referencing ▓▓▓▓▓▓▓▓▓▓</div>
            <div style={{ marginTop: 30, color: "var(--correction)", fontSize: 12 }}>do not close this tab. it is closing you.</div>
          </div>
        )}

        {/* HIRED REVEAL */}
        {stage === "hired" && hireData && (
          <div style={{ padding: "28px 32px", position: "relative" }}>
            {/* OmniShift bar */}
            <div style={{
              background: "var(--dashboard)", color: "white",
              fontFamily: "var(--type-ui)", fontWeight: 700, letterSpacing: "0.04em",
              padding: "8px 14px", margin: "-28px -32px 16px", display: "flex", justifyContent: "space-between",
              fontSize: 12,
            }}>
              <span>OMNISHIFT · WORKFORCE ROUTING</span>
              <span>onboarding.omnishift.work</span>
            </div>

            <div style={{ fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.2em", color: "var(--dashboard)" }}>
              ▲ STATUS UPDATE · {hireData.issued}
            </div>
            <h2 style={{ fontFamily: "var(--type-ui)", fontSize: 28, fontWeight: 900, lineHeight: 1.05, margin: "10px 0 6px", color: "var(--ink)" }}>
              CONGRATULATIONS. YOU HAVE BEEN HIRED BY OMNISHIFT.
            </h2>
            <p style={{ fontSize: 14, color: "#3a3328", marginBottom: 18 }}>
              Your subscription has been processed as an employment application. You did not apply. You have been hired anyway. Continued presence on this page constitutes acceptance.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              <Field label="Employee ID" value={hireData.id} />
              <Field label="Department" value={hireData.department} />
              <Field label="Role" value={hireData.role} />
              <Field label="Shift" value={hireData.shift} />
              <Field label="Assigned Object" value={hireData.object} />
              <Field label="Uniform Recommendation" value={hireData.uniform} />
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="House Rule" value={hireData.rule} />
              </div>
            </div>

            <div style={{
              marginTop: 16, padding: 10, background: "var(--warning)",
              fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.04em", color: "#2a1f00",
              border: "1px solid #b08a00",
            }}>
              ⚠ FINE PRINT — This is a fictional brand experience. Not an employment offer, legal contract, or binding agreement. <em>/s/ Management · Authorized by The Room · Signature currently unavailable.</em>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <button className="btn-stamp" onClick={goPortal}>ENTER EMPLOYEE PORTAL →</button>
              <button className="btn-pill" onClick={onClose}>I did not apply for this</button>
            </div>

            <div className="stamp" style={{ top: 50, right: 24, transform: "rotate(8deg)" }}>HIRED</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{
      border: "1px solid #c8bfa6", padding: "8px 12px", background: "white",
    }}>
      <div style={{ fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.18em", color: "#5a6b58", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: "var(--type-mono)", fontSize: 15, color: "var(--ink)", fontWeight: 700, marginTop: 2 }}>{value}</div>
    </div>
  );
}

window.SignupModal = SignupModal;
window.generateAssignment = generateAssignment;
