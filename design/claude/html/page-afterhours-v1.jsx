// CLOCK OUT — gate sequence + AFTER HOURS page

const { useState: useStateAH, useEffect: useEffectAH, useRef: useRefAH } = React;

// ============= CLOCK OUT TRANSITION =============
function ClockOutGate({ onDone, go }) {
  const lines = [
    "Ending approved session...",
    "Supervisor connection lost...",
    "Clock discrepancy detected: 1:47 AM",
    "Breakroom override accepted...",
  ];
  const [step, setStep] = useStateAH(0);
  const [stamp, setStamp] = useStateAH(false);

  useEffectAH(() => {
    const t = setInterval(() => setStep(s => Math.min(s + 1, lines.length)), 650);
    return () => clearInterval(t);
  }, []);

  useEffectAH(() => {
    if (step >= lines.length) {
      setTimeout(() => setStamp(true), 350);
      setTimeout(() => onDone(), 2400);
    }
  }, [step]);

  return (
    <div style={{
      minHeight: "calc(100vh - 28px)", background: "#050606",
      color: "var(--phosphor)", fontFamily: "var(--type-mono)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 30, position: "relative",
    }}>
      <div style={{ width: "min(640px, 100%)", fontSize: 16, lineHeight: 2, textShadow: "0 0 4px var(--phosphor)" }}>
        {lines.slice(0, step).map((l, i) => <div key={i}>&gt; {l}</div>)}
        {step < lines.length && <div className="blink">&gt; <span style={{ opacity: 0.5 }}>processing</span></div>}
      </div>
      {stamp && (
        <>
          <div style={{
            marginTop: 50, fontFamily: "var(--type-typer)", color: "var(--beer-red)",
            border: "5px double var(--beer-red)", padding: "12px 32px",
            fontSize: 50, letterSpacing: "0.18em", transform: "rotate(-4deg)",
            textShadow: "0 0 12px rgba(198,31,31,0.5)",
          }}>CLOCKED OUT</div>
          <div style={{ marginTop: 44, fontFamily: "var(--type-paper)", fontSize: 44, color: "var(--nicotine)", letterSpacing: "0.04em" }}>AFTER HOURS</div>
          <div style={{ fontFamily: "var(--type-paper)", fontStyle: "italic", color: "#9a8c70", marginTop: 4 }}>Open when the site stops pretending.</div>
        </>
      )}
    </div>
  );
}

// ============= AFTER HOURS PAGE =============
function AfterHours({ go, employee }) {
  const D = window.BREAKROOM_DATA;
  const [phoneTab, setPhoneTab] = useStateAH("all");
  const [activeMsg, setActiveMsg] = useStateAH(0);

  // Extended phone messages with categories
  const phoneMessages = [
    { cat: "ride", from: "Lowrider Dispatch", time: "1:47 a.m.", body: "Your driver is outside. Vehicle: unknown red lowrider. Passenger seat occupied." },
    { cat: "ride", from: "The Driver", time: "2:18 a.m.", body: "Bring a hoodie next time. The lot gets cold after the bass stops." },
    { cat: "ride", from: "Ride Cancelled", time: "2:41 a.m.", body: "Driver reported \"bad light.\" Refund pending. Please remain in the booth." },
    { cat: "food", from: "Late Delivery", time: "3:02 a.m.", body: "Your order has been delivered to Room 8. You are not in Room 8." },
    { cat: "food", from: "Dasher Update", time: "3:14 a.m.", body: "Dasher reports nobody answered, but the TV was on. Order left at the door." },
    { cat: "food", from: "Order Status", time: "3:33 a.m.", body: "Missing item: coffee. Replacement: apology. Tip: appreciated." },
    { cat: "vm", from: "7/11 Clerk", time: "4:33 a.m.", body: "Hot dogs been on too long. Don't trust them. I'm telling everybody." },
    { cat: "vm", from: "Unknown Employee", time: "1:47 a.m.", body: "If they ask, you didn't get this page from me." },
    { cat: "vm", from: "OmniShift HR", time: "12:01 a.m.", body: "Your rest period has exceeded narrative expectations. Please continue resting." },
    { cat: "invite", from: "Back Booth", time: "1:13 a.m.", body: "Open until 2:13. No cameras. Bring cash for coffee." },
    { cat: "invite", from: "Low Table", time: "12:44 a.m.", body: "Someone fixed the jukebox. Nobody believes it. Come hear it before they break it." },
    { cat: "dm", from: "Unknown Contact", time: "2:08 a.m.", body: "You still out?" },
    { cat: "dm", from: "Unknown Contact", time: "2:31 a.m.", body: "I saw your cap in the window. Don't make that weird." },
    { cat: "dm", from: "Unknown Contact", time: "3:11 a.m.", body: "Come by if the light's still on." },
    { cat: "dm", from: "Unknown Contact", time: "3:47 a.m.", body: "You always leave before the story gets good." },
  ];

  const filtered = phoneTab === "all" ? phoneMessages : phoneMessages.filter(m => m.cat === phoneTab);
  const msg = filtered[Math.min(activeMsg, filtered.length - 1)] || filtered[0];

  // Product status simulation
  const productStatuses = [
    { ...D.products[0], status: "AVAILABLE FOR ISSUE", redacted: false },
    { ...D.products[1], status: "REMOVED FROM THE RACK", redacted: false, note: "Seen last: Booth three." },
    { ...D.products[2], status: "UNIFORM PENDING", redacted: true },
    { ...D.products[3], status: "AVAILABLE FOR ISSUE", redacted: false },
    { ...D.products[4], status: "ITEM REMOVED BY MANAGEMENT", redacted: true, note: "Ask staff." },
    { ...D.products[5], status: "SEEN AFTER HOURS ONLY", redacted: false },
  ];

  const characters = [
    { name: "The Driver", role: "Lot Hours · red lowrider", note: "Doesn't park. Parks adjacent.", obj: "Fuzzy Dice" },
    { name: "Miss September", role: "Passenger seat · unverified", note: "Brought a feather. Took the radio.", obj: "Swan Feather" },
    { name: "7/11 Clerk", role: "Night register", note: "Knows about the hot dogs.", obj: "Receipt" },
    { name: "Man With the Gold Grill", role: "Booth three", note: "Smiles only at the wall clock.", obj: "Matchbook" },
    { name: "Unknown Employee", role: "Fluorescent Operations", note: "Edited this page. Won't admit it.", obj: "Torn OmniShift Memo" },
    { name: "Wall Clock", role: "Above the door", note: "Reads 1:47. Has for years.", obj: "Wall Clock" },
    { name: "Motel Office", role: "Across the lot", note: "Always lit. Rarely staffed.", obj: "Motel Key No. 8" },
    { name: "Kid With the Mop", role: "Closing crew", note: "Speaks only between mop strokes.", obj: "Cue Chalk" },
  ];

  const approvedRooms = [
    { name: "DEEP EDDY CABARET", loc: "Austin, TX", why: "old-room energy, local texture, unpolished gravity", note: "Some rooms do not need branding. They already survived.", verified: true },
    { name: "[CLASSIFIED — UNDER REVIEW]", loc: "▓▓▓▓▓▓▓▓", why: "candidate room, awaiting personal sign-off", note: "Real places only when verified. We don't invent.", verified: false },
    { name: "[CLASSIFIED — UNDER REVIEW]", loc: "▓▓▓▓▓▓▓▓", why: "candidate room, awaiting personal sign-off", note: "Submit nominations through Staff Only.", verified: false },
  ];

  const myths = [
    { t: "THE BACK BOOTH INCIDENT", src: "unverified", loc: "withheld", obj: "motel key", status: "still discussed by people who deny being there" },
    { t: "THE NIGHT THE JUKEBOX FIXED ITSELF", src: "anecdotal", loc: "unspecified bar", obj: "matchbook", status: "three witnesses, none consistent" },
    { t: "THE QUARTER MILE THAT WASN'T SCHEDULED", src: "timing slip", loc: "old strip", obj: "timing slip", status: "evidence inconclusive · evidence preserved anyway" },
  ];

  return (
    <div style={{ background: "#0a0908", color: "var(--nicotine)", minHeight: "calc(100vh - 28px)" }}>
      {/* HERO — dive bar */}
      <section style={{ position: "relative", overflow: "hidden", padding: "60px 0 50px" }}>
        {/* neon glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 30%, rgba(31,76,196,0.18) 0%, transparent 45%), radial-gradient(ellipse at 20% 70%, rgba(198,31,31,0.22) 0%, transparent 50%)", pointerEvents: "none" }}></div>
        {/* lowrider glow window */}
        <div style={{ position: "absolute", right: 0, top: 80, width: 280, height: 180, background: "linear-gradient(180deg, rgba(198,31,31,0.4) 0%, rgba(31,76,196,0.3) 50%, rgba(0,0,0,0) 100%)", filter: "blur(40px)", pointerEvents: "none" }}></div>

        <div className="wrap" style={{ position: "relative" }}>
          <div style={{ fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.3em", color: "var(--beer-red)" }}>
            <span className="flicker">●</span> NEON · 1:47 A.M. · OPEN
          </div>
          <h1 style={{ fontFamily: "var(--type-paper)", fontSize: 140, lineHeight: 0.85, letterSpacing: "-0.04em", margin: "10px 0 0", color: "var(--nicotine)" }}>
            After Hours.
          </h1>
          <div style={{ fontFamily: "var(--type-paper)", fontStyle: "italic", color: "#9a8c70", fontSize: 30, marginTop: 6 }}>
            Open when the site stops pretending.
          </div>

          {/* The bar — object grid */}
          <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, position: "relative" }}>
            {[
              { label: "ashtray · red olive sword", color: "#c61f1f" },
              { label: "rocks glass · half", color: null },
              { label: "motel key no. 8", color: "var(--warning)" },
              { label: "receipt · no total", color: null },
              { label: "cue chalk", color: "var(--motel-blue)" },
              { label: "matchbook", color: "var(--beer-red)" },
              { label: "fuzzy dice", color: "var(--beer-red)" },
              { label: "hotline flyer (covered)", color: null },
              { label: "swan feather · wet", color: null },
              { label: "stay late cap · hook", color: null },
              { label: "night shift hoodie · booth", color: "var(--motel-blue)" },
              { label: "torn omnishift memo", color: "var(--correction)" },
            ].map((o, i) => (
              <div key={i} style={{
                aspectRatio: "1.2 / 1",
                background: "repeating-linear-gradient(45deg, #14110e 0 8px, #1a1714 8px 16px)",
                border: "1px solid #2a2622",
                position: "relative", overflow: "hidden",
                fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.1em",
                color: "#5a513f", padding: 8, display: "flex", alignItems: "flex-end",
              }}>
                {o.color && <div style={{ position: "absolute", top: -20, right: -20, width: 60, height: 60, borderRadius: "50%", background: o.color, opacity: 0.3, filter: "blur(20px)" }}></div>}
                [{o.label}]
              </div>
            ))}
          </div>

          {/* Background detail row */}
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, fontFamily: "var(--type-mono)", fontSize: 10, color: "#5a513f", letterSpacing: "0.1em" }}>
            <div style={{ padding: 10, border: "1px solid #2a2622" }}>NEON — beer sign · red+blue, bleeding</div>
            <div style={{ padding: 10, border: "1px solid #2a2622", color: "var(--beer-red)" }}>TV — OMNISHIFT ERROR · ▓▓▓▓▓▓ <span className="blink"></span></div>
            <div style={{ padding: 10, border: "1px solid #2a2622" }}>WALL CLOCK — <span style={{ color: "var(--warning)" }}>1:47</span> · stuck</div>
            <div style={{ padding: 10, border: "1px solid #2a2622" }}>BOOTH 4 — reserved · empty</div>
          </div>
        </div>
      </section>

      {/* THE WALL — bulletin */}
      <section className="wrap" style={{ paddingTop: 30 }}>
        <SectionHeadAH t="The Wall" sub="bulletin · clippings · fliers · what's pinned tonight" />
        <div style={{ marginTop: 20, padding: 20, background: "#1a1714", border: "1px solid #2a2622", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {[
            { tape: "y", t: "ROOM CLOCK STILL WRONG", k: "Management calls it cultural. We call it accurate." },
            { tape: "n", t: "MISSED CONNECTION — fur coat, exact change", k: "You said \"keep going.\" I have been." },
            { tape: "y", t: "BACK BOOTH OPEN UNTIL 2:13", k: "Cash only. No cameras. Bring nothing you can't lose." },
            { tape: "n", t: "WANTED: HOODIE", k: "Lot gets cold. — The Driver" },
            { tape: "y", t: "JUKEBOX FIXED", k: "Three songs work. Two of them are good." },
            { tape: "n", t: "CORRECTION: SWAN WAS NOT DRIVING", k: "Held the wheel only at a stoplight. Briefly." },
            { tape: "y", t: "IDLE HANDS INVITATIONAL", k: "Race to 7. Cash only. Clock optional. Late registration accepted. Probably.", link: "idlehands" },
          ].map((p, i) => (
            <div key={i} onClick={() => p.link && go(p.link)} style={{ background: "var(--nicotine)", color: "var(--ink)", padding: "10px 12px", position: "relative", transform: `rotate(${(i % 2 ? 1 : -1) * (0.5 + (i * 0.3))}deg)`, cursor: p.link ? "pointer" : "default" }}>
              {p.tape === "y" && <div className="tape" style={{ top: -8, left: 14 }}></div>}
              {p.tape === "y" && <div className="tape" style={{ bottom: -8, right: 14, transform: "rotate(4deg)" }}></div>}
              <div style={{ fontFamily: "var(--type-paper)", fontSize: 17, lineHeight: 1.05 }}>{p.t}</div>
              <div style={{ fontFamily: "var(--type-typer)", fontSize: 12, marginTop: 6, color: "#3a3328" }}>{p.k}</div>
              {p.link && <div style={{ fontFamily: "var(--type-mono)", fontSize: 9, marginTop: 6, color: "var(--beer-red)", letterSpacing: "0.15em" }}>↪ open tournament page</div>}
            </div>
          ))}
        </div>
      </section>

      {/* BACK BAR ISSUE — products */}
      <section className="wrap" style={{ paddingTop: 50 }}>
        <SectionHeadAH t="Back Bar Issue" sub="found goods · issued goods · most of it isn't here right now" />
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {productStatuses.map((p, i) => (
            <div key={p.sku} style={{ background: "#14110e", border: "1px solid #2a2622", position: "relative" }}>
              <div className="stripe" style={{ height: 220, background: "repeating-linear-gradient(45deg, #1a1714 0 12px, #14110e 12px 24px)", color: "#5a513f", fontSize: 10, letterSpacing: "0.18em", position: "relative", overflow: "hidden" }}>
                [{p.sku} — {p.name.toUpperCase()}]
                {p.redacted && (
                  <>
                    <div style={{ position: "absolute", top: "30%", left: 0, right: 0, height: 24, background: "#000" }}></div>
                    <div style={{ position: "absolute", top: "55%", left: 0, right: 0, height: 18, background: "#000" }}></div>
                  </>
                )}
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.18em", color: p.status.includes("AVAILABLE") ? "var(--phosphor)" : p.status.includes("PENDING") ? "var(--warning)" : "var(--beer-red)" }}>
                  ● {p.status}
                </div>
                <div style={{ fontFamily: "var(--type-paper)", fontSize: 22, marginTop: 4, lineHeight: 1.05, color: "var(--nicotine)" }}>{p.name}</div>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 11, color: "#9a8c70", marginTop: 6 }}>{p.dept} · related: {p.obj}</div>
                {p.note && <div style={{ fontFamily: "var(--type-typer)", fontSize: 12, color: "var(--chrome)", marginTop: 6, fontStyle: "italic" }}>{p.note}</div>}
                <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                  <span style={{ fontFamily: "var(--type-mono)", fontSize: 14, fontWeight: 700, color: "var(--nicotine)" }}>{p.price}</span>
                  <button className="btn-stamp" style={{ flex: 1, fontSize: 10, padding: "6px 10px", background: p.status.includes("AVAILABLE") ? "var(--beer-red)" : "transparent", borderColor: p.status.includes("AVAILABLE") ? "var(--beer-red)" : "#5a513f", color: p.status.includes("AVAILABLE") ? "white" : "#9a8c70" }} onClick={() => go("rack")}>
                    {p.status.includes("AVAILABLE") ? "ISSUE UNIFORM" : p.status.includes("PENDING") ? "NOTIFY ME" : "FILE A REQUEST"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PHONE BEHIND THE BAR */}
      <section className="wrap" style={{ paddingTop: 50 }}>
        <SectionHeadAH t="Phone Behind the Bar" sub="messages left after the room stopped answering" />
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "320px 1fr", gap: 14 }}>
          <div style={{ background: "#14110e", border: "1px solid #2a2622" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #2a2622" }}>
              {[["all","ALL"],["ride","RIDES"],["food","FOOD"],["vm","VM"],["dm","DM"],["invite","INVITES"]].map(([k, l]) => (
                <button key={k} onClick={() => { setPhoneTab(k); setActiveMsg(0); }} style={{
                  all: "unset", cursor: "pointer", flex: 1, padding: "8px 4px", textAlign: "center",
                  fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.1em",
                  background: phoneTab === k ? "var(--beer-red)" : "transparent",
                  color: phoneTab === k ? "white" : "#9a8c70",
                }}>{l}</button>
              ))}
            </div>
            {filtered.map((m, i) => (
              <button key={i} onClick={() => setActiveMsg(i)} style={{
                all: "unset", cursor: "pointer", display: "block", width: "100%",
                padding: "10px 12px", borderBottom: "1px solid #2a2622",
                background: activeMsg === i ? "#1f1a16" : "transparent",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <strong style={{ fontFamily: "var(--type-ui)", fontSize: 12, color: "var(--nicotine)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>{m.from}</strong>
                  <span style={{ fontFamily: "var(--type-mono)", fontSize: 9, color: "#5a513f", whiteSpace: "nowrap" }}>{m.time}</span>
                </div>
                <div style={{ fontFamily: "var(--type-typer)", fontSize: 11, color: "#9a8c70", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.body}</div>
              </button>
            ))}
          </div>
          <div style={{ background: "#14110e", border: "1px solid #2a2622", padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #2a2622", paddingBottom: 12, alignItems: "baseline" }}>
              <div>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.18em", color: "#5a513f" }}>FROM</div>
                <div style={{ fontFamily: "var(--type-paper)", fontSize: 28, color: "var(--nicotine)" }}>{msg.from}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.18em", color: "#5a513f" }}>{msg.cat.toUpperCase()}</div>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 14, color: "var(--warning)" }}>{msg.time}</div>
              </div>
            </div>
            <div style={{ marginTop: 18, fontFamily: "var(--type-typer)", fontSize: 18, lineHeight: 1.6, color: "var(--nicotine)", minHeight: 100 }}>
              {msg.body}
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn-pill" style={{ background: "transparent", borderColor: "#5a513f", color: "var(--nicotine)" }} onClick={() => setActiveMsg((activeMsg + 1) % filtered.length)}>Next →</button>
              <button className="btn-pill" style={{ background: "transparent", borderColor: "#5a513f", color: "var(--nicotine)" }}>Save to file</button>
              <button className="btn-pill" style={{ background: "transparent", borderColor: "var(--beer-red)", color: "var(--beer-red)" }}>Unlock clue</button>
            </div>
          </div>
        </div>
      </section>

      {/* PEOPLE STILL HERE */}
      <section className="wrap" style={{ paddingTop: 50 }}>
        <SectionHeadAH t="People Still Here" sub="characters · regulars · people who don't sign in" />
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {characters.map((c, i) => (
            <div key={i} style={{ background: "#14110e", border: "1px solid #2a2622", padding: 16 }}>
              <div className="stripe" style={{ height: 110, background: "repeating-linear-gradient(45deg, #1a1714 0 8px, #14110e 8px 16px)", color: "#5a513f", fontSize: 9, letterSpacing: "0.15em", marginBottom: 10 }}>[{c.name.toLowerCase()}]</div>
              <div style={{ fontFamily: "var(--type-paper)", fontSize: 22, color: "var(--nicotine)", lineHeight: 1.05 }}>{c.name}</div>
              <div style={{ fontFamily: "var(--type-mono)", fontSize: 10, color: "var(--motel-blue)", marginTop: 4, letterSpacing: "0.05em" }}>{c.role}</div>
              <div style={{ fontFamily: "var(--type-typer)", fontSize: 13, color: "#c8bfa6", marginTop: 8, lineHeight: 1.4 }}>{c.note}</div>
              <div style={{ fontFamily: "var(--type-mono)", fontSize: 10, color: "#5a513f", marginTop: 10 }}>OBJECT · {c.obj}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THINGS FOUND AFTER CLOSE — myths */}
      <section className="wrap" style={{ paddingTop: 50 }}>
        <SectionHeadAH t="Things Found After Close" sub="bar myths · unverified · we don't fact-check stories" />
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {myths.map((m, i) => (
            <div key={i} style={{ background: "#14110e", border: "1px solid var(--beer-red)", padding: 18, position: "relative" }}>
              <div className="stamp" style={{ top: 10, right: 12, fontSize: 9, padding: "2px 6px", color: "var(--beer-red)", borderColor: "var(--beer-red)" }}>UNVERIFIED</div>
              <div style={{ fontFamily: "var(--type-paper)", fontSize: 22, color: "var(--nicotine)", lineHeight: 1.05, marginTop: 8 }}>{m.t}</div>
              <div style={{ fontFamily: "var(--type-mono)", fontSize: 11, color: "#9a8c70", marginTop: 12, lineHeight: 1.7 }}>
                SOURCE: {m.src}<br/>
                LOCATION: {m.loc}<br/>
                OBJECT: {m.obj}<br/>
                STATUS: <span style={{ color: "var(--warning)" }}>{m.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* APPROVED ROOMS */}
      <section className="wrap" style={{ paddingTop: 50 }}>
        <SectionHeadAH t="Approved Rooms" sub="real places · personally signed off · we don't invent facts" />
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {approvedRooms.map((r, i) => (
            <div key={i} style={{ background: r.verified ? "#14110e" : "repeating-linear-gradient(45deg, #14110e 0 6px, #1a1714 6px 12px)", border: "1px solid " + (r.verified ? "var(--phosphor)" : "#2a2622"), padding: 18 }}>
              <div style={{ fontFamily: "var(--type-mono)", fontSize: 10, letterSpacing: "0.18em", color: r.verified ? "var(--phosphor)" : "#5a513f" }}>
                {r.verified ? "● APPROVED ROOM" : "○ CANDIDATE · UNDER REVIEW"}
              </div>
              <div style={{ fontFamily: "var(--type-paper)", fontSize: 26, color: r.verified ? "var(--nicotine)" : "#5a513f", lineHeight: 1, marginTop: 6, letterSpacing: "0.02em" }}>{r.name}</div>
              <div style={{ fontFamily: "var(--type-mono)", fontSize: 11, color: "#9a8c70", marginTop: 4 }}>{r.loc}</div>
              <div style={{ fontFamily: "var(--type-typer)", fontSize: 13, color: "#c8bfa6", marginTop: 10, lineHeight: 1.4 }}><strong style={{ color: "#9a8c70" }}>WHY IT FITS:</strong> {r.why}</div>
              {r.verified && <div style={{ fontFamily: "var(--type-paper)", fontStyle: "italic", fontSize: 15, color: "#9a8c70", marginTop: 10, borderTop: "1px dashed #2a2622", paddingTop: 8 }}>{r.note}</div>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontFamily: "var(--type-mono)", fontSize: 11, color: "#5a513f", lineHeight: 1.6 }}>
          The Breakroom only links real rooms when verified, respectful, and personally approved. We do not fabricate facts about real places. To nominate, see <a href="#" onClick={(e)=>{e.preventDefault(); go("staff");}} style={{ color: "var(--phosphor)" }}>Staff Only</a>.
        </div>
      </section>

      {/* SECRETS HINT */}
      <section className="wrap" style={{ paddingTop: 50, paddingBottom: 60 }}>
        <SectionHeadAH t="Secrets" sub="rewards for curiosity · don't ask for the list" />
        <div style={{ marginTop: 16, padding: 22, background: "#14110e", border: "1px dashed var(--phosphor)", fontFamily: "var(--type-mono)", fontSize: 12, color: "#9a8c70", lineHeight: 1.9 }}>
          &gt; click the <span style={{ color: "var(--warning)" }}>1:47</span> wall clock<br/>
          &gt; type <code style={{ color: "var(--phosphor)" }}>miss september</code>, <code style={{ color: "var(--phosphor)" }}>applause money</code>, or <code style={{ color: "var(--phosphor)" }}>room 8</code> into SleeperNet<br/>
          &gt; collect three objects in <a href="#" onClick={(e)=>{e.preventDefault(); go("lost");}} style={{ color: "var(--phosphor)" }}>Lost &amp; Found</a><br/>
          &gt; open three voicemails — one of them lies<br/>
          &gt; click a redacted product<br/>
          &gt; the back booth is open until <span className="blink" style={{ color: "var(--warning)" }}>2:13</span>
        </div>
      </section>

      {/* footer */}
      <footer style={{ borderTop: "1px solid #2a2622", padding: "20px 0", marginTop: 0, background: "#050606" }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14, fontFamily: "var(--type-mono)", fontSize: 11, color: "#5a513f" }}>
          <span>The Breakroom · After Hours · {employee ? `Clocked out as ${employee.id}` : "anonymous · no file"}</span>
          <span>
            <a href="#" onClick={(e)=>{e.preventDefault(); go("portal");}} style={{ color: "#5a513f" }}>clock back in</a> ·{" "}
            <a href="#" onClick={(e)=>{e.preventDefault(); go("staff");}} style={{ color: "#5a513f" }}>staff only</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

function SectionHeadAH({ t, sub }) {
  return (
    <div style={{ borderBottom: "1px solid #2a2622", paddingBottom: 10 }}>
      <h2 style={{ fontFamily: "var(--type-paper)", fontSize: 48, lineHeight: 0.95, margin: 0, color: "var(--nicotine)" }}>{t}</h2>
      <div style={{ fontFamily: "var(--type-typer)", fontSize: 14, color: "#9a8c70", marginTop: 2, fontStyle: "italic" }}>{sub}</div>
    </div>
  );
}

window.ClockOutGate = ClockOutGate;
window.AfterHours = AfterHours;
