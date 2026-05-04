// EMPLOYEE RESOURCES / BREAKROOM
// A hijacked OmniShift internal page. Three voices fighting:
// 1) OmniShift official (sterile, fake-helpful, often crossed out)
// 2) Rogue employee (handwritten margin notes, dry, tired, true)
// 3) Breakroom brand (understated, object-driven, after-hours)

const { useState: useStateBR } = React;

// ---------- voice components ----------
function Strike({ children }) {
  return <span style={{ textDecoration: "line-through", textDecorationColor: "rgba(198,31,31,0.85)", textDecorationThickness: "2px", color: "#5a513f" }}>{children}</span>;
}
function Marg({ children, rot = -1.5, color = "#c61f1f" }) {
  return (
    <span style={{
      fontFamily: "'Caveat', 'Special Elite', cursive",
      color, fontSize: "1.05em",
      display: "inline-block",
      transform: `rotate(${rot}deg)`,
      textDecoration: "underline wavy " + color,
      textUnderlineOffset: 4,
      padding: "0 2px",
    }}>{children}</span>
  );
}
function HandNote({ children, top, left, right, bottom, rot = -3, color = "#c61f1f", style = {} }) {
  return (
    <div style={{
      position: "absolute",
      top, left, right, bottom,
      transform: `rotate(${rot}deg)`,
      fontFamily: "'Caveat', 'Special Elite', cursive",
      color, fontSize: 22, lineHeight: 1.1, fontWeight: 600,
      pointerEvents: "none",
      maxWidth: 280,
      ...style,
    }}>{children}</div>
  );
}
function CorpVoice({ children, style = {} }) {
  return <span style={{ color: "#5a6b58", fontFamily: "var(--type-ui)", ...style }}>{children}</span>;
}
function RogueVoice({ children, style = {} }) {
  return <span style={{ fontFamily: "var(--type-typer)", color: "#1a1714", ...style }}>{children}</span>;
}
function BrandVoice({ children, style = {} }) {
  return <span style={{ fontFamily: "var(--type-paper)", color: "var(--ink)", ...style }}>{children}</span>;
}

// ---------- the page ----------
function BreakroomLanding({ go, employee, openSignup }) {
  const D = window.BREAKROOM_DATA;
  const [showFile, setShowFile] = useStateBR(null); // null | "received" | "creating" | "department" | "hired"
  const [email, setEmail] = useStateBR("");
  const [tempFile, setTempFile] = useStateBR(null);

  const subscribe = () => {
    if (!email.includes("@")) return;
    setShowFile("received");
    setTimeout(() => setShowFile("creating"), 1100);
    setTimeout(() => setShowFile("department"), 2300);
    setTimeout(() => {
      const a = window.generateAssignment(email);
      setTempFile(a);
      try { localStorage.setItem("breakroom_employee", JSON.stringify(a)); } catch(e) {}
      setShowFile("hired");
    }, 3500);
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 28px)",
      background: "#f1f4ef",
      color: "#1a1f1a",
      fontFamily: "var(--type-ui)",
      paddingBottom: 80,
      position: "relative",
    }}>
      {/* Internal corporate header */}
      <div style={{ background: "var(--dashboard)", color: "white", padding: "8px 16px", display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "var(--type-ui)", fontWeight: 700, letterSpacing: "0.05em" }}>
        <span>SLEEPERNET / OMNISHIFT INTERNAL · v4.7</span>
        <span style={{ opacity: 0.85 }}>portal.omnishift.work / resources / breakroom</span>
      </div>

      {/* Internal nav strip — with rogue overrides */}
      <div style={{ background: "white", borderBottom: "1px solid #c4cfc1", padding: "8px 16px", display: "flex", gap: 0, alignItems: "center", flexWrap: "wrap", fontSize: 12, fontFamily: "var(--type-mono)" }}>
        <input placeholder="Search employee resources..." style={{ flex: "0 0 240px", padding: "6px 10px", border: "1px solid #c4cfc1", marginRight: 16, fontFamily: "var(--type-mono)", fontSize: 12 }} />
        <NavItem corp="Search" rogue={null} onClick={() => go("search")} />
        <NavItem corp="Resources" rogue="The Room" onClick={() => {}} active />
        <NavItem corp="Bulletin" rogue="Newsstand" onClick={() => go("newsstand")} />
        <NavItem corp="Recovered Items" rogue="Lost & Found" onClick={() => go("lost")} />
        <NavItem corp="Apparel" rogue="The Rack" onClick={() => go("rack")} />
        <NavItem corp="Messages" rogue="Company Phone" onClick={() => go("phone")} />
        <NavItem corp="Help" rogue="Good Luck" onClick={() => go("staff")} />
        <span style={{ marginLeft: "auto", color: "#5a6b58", display: "flex", gap: 14, alignItems: "center" }}>
          <span><span className="os-blink" style={{ display: "inline-block", width: 8, height: 8, background: "var(--warning)", marginRight: 6, verticalAlign: "middle" }}></span>Connection unstable</span>
          <span>User: {employee ? employee.id : "Guest / Pending Assignment"}</span>
        </span>
      </div>

      <div className="wrap" style={{ paddingTop: 28 }}>

        {/* ============ HERO MODULE ============ */}
        <section style={{
          background: "white", border: "1px solid #c4cfc1",
          padding: "28px 32px 32px", position: "relative",
          boxShadow: "2px 2px 0 #c4cfc1",
        }}>
          {/* coffee ring */}
          <div style={{
            position: "absolute", width: 120, height: 120, borderRadius: "50%",
            border: "8px solid rgba(120,80,30,0.18)", top: 30, right: 60, pointerEvents: "none",
          }}></div>

          <div style={{ display: "flex", gap: 6, fontFamily: "var(--type-mono)", fontSize: 10, letterSpacing: "0.18em", color: "#5a6b58" }}>
            <span>OMNISHIFT / RESOURCES /</span>
            <span style={{ color: "var(--correction)" }}>BREAKROOM</span>
          </div>

          <h1 style={{
            fontFamily: "var(--type-ui)", fontSize: 56, fontWeight: 800,
            margin: "8px 0 0", lineHeight: 1, color: "#1a1f1a",
            letterSpacing: "-0.02em",
          }}>
            Employee Resources / Breakroom
          </h1>

          <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.55, maxWidth: 720, color: "#5a6b58" }}>
            <Strike>This page provides approved rest-period materials, wellness resources, and culture alignment tools for OmniShift personnel.</Strike>
          </p>

          <HandNote top={130} right={36} rot={-4} color="#c61f1f" style={{ fontSize: 32 }}>
            A bunch of bullsh*t, right?
          </HandNote>

          <div style={{ marginTop: 22, padding: "14px 18px", background: "#fff8d6", border: "1px dashed #b08a00", borderLeft: "4px solid var(--warning)", maxWidth: 720, fontFamily: "var(--type-typer)", fontSize: 15, lineHeight: 1.5, color: "#1a1714" }}>
            Pull up a chair. They don't check this page much. The coffee's <em>active</em> — don't touch it. Pool table's in the back. Wall clock reads <strong>1:47</strong>, has for years. Nobody's in charge. That's the whole thing.
          </div>

          <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn-pill" style={{ background: "#e7eee5", borderColor: "#c4cfc1" }} onClick={() => alert("Approved Materials are unavailable. Please continue.")}>View Approved Materials</button>
            <button className="btn-stamp" onClick={() => go("rack")}>ENTER THE ROOM →</button>
            <a href="#" onClick={(e) => { e.preventDefault(); go("staff"); }} style={{ fontFamily: "var(--type-mono)", fontSize: 11, color: "#9aa898", textDecoration: "none" }}>
              · don't click this at work ·
            </a>
          </div>

          {/* small artifact strip — the "page is full of physical objects" beat */}
          <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.15em", color: "#9aa898" }}>
            {["[receipt]","[matchbook]","[motel key no. 8]","[cue chalk]","[ashtray]","[wall clock · 1:47]"].map((s, i) => (
              <div key={i} className="stripe" style={{ height: 60, background: "repeating-linear-gradient(45deg, #e7eee5 0 6px, #d6dfd2 6px 12px)", color: "#5a6b58" }}>{s}</div>
            ))}
          </div>
        </section>

        {/* ============ PAGE LAST MODIFIED ============ */}
        <section style={{ marginTop: 14, padding: "10px 14px", background: "#fff", border: "1px solid #c4cfc1", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontFamily: "var(--type-mono)", fontSize: 11, color: "#5a6b58" }}>
          <span><strong style={{ color: "#1a1f1a" }}>Page last modified by:</strong> Unknown Employee · Department: Fluorescent Operations · Time: 1:47 a.m. · Change note: <em style={{ color: "var(--correction)" }}>"Fixed the tone."</em></span>
          <span style={{ opacity: 0.7 }}>Original page archived for compliance reasons. Nobody liked it.</span>
        </section>

        {/* ============ APPROVED LANGUAGE / ACTUAL MEANING ============ */}
        <section style={{ marginTop: 36 }}>
          <SectionHead corp="Glossary of Internal Terminology" rogue="What they say / what they mean" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginTop: 16 }}>
            {[
              ["Culture alignment space.", "A room with bad coffee where people tell the truth by accident."],
              ["Flexible rest-period environment.", "You get seven minutes and a chair that leans left."],
              ["Employee identity materials.", "Uniforms. Some of them look good."],
              ["Community engagement bulletin.", "The Newsstand. Half true. Better than HR."],
              ["Recovered workplace objects.", "Lost & Found. Don't ask where the swan feather came from."],
              ["Wellness alignment program.", "Sit down. Drink something. Stop apologizing."],
            ].map(([a, b], i) => (
              <div key={i} style={{ background: "white", border: "1px solid #c4cfc1", padding: 16, position: "relative" }}>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.18em", color: "#5a6b58", marginBottom: 6 }}>APPROVED LANGUAGE</div>
                <div style={{ fontFamily: "var(--type-ui)", fontSize: 15, color: "#5a6b58", textDecoration: "line-through", textDecorationThickness: 1.5, textDecorationColor: "rgba(198,31,31,0.6)", lineHeight: 1.35 }}>{a}</div>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.18em", color: "var(--correction)", marginTop: 14 }}>ACTUAL MEANING</div>
                <div style={{ fontFamily: "var(--type-typer)", fontSize: 16, color: "#1a1714", marginTop: 4, lineHeight: 1.4 }}>{b}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ RECOVERED ASSETS ============ */}
        <section style={{ marginTop: 44 }}>
          <SectionHead corp="Recovered Assets" rogue="Touch anything. Most of it opens." />
          <div style={{ fontSize: 13, color: "#5a6b58", marginTop: 6 }}><Strike>The following materials are currently under review.</Strike></div>

          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {[
              { name: "Motel Key No. 8", status: "Unreturned", off: "Access control", act: "Getting in without belonging", to: "lost" },
              { name: "Wall Clock", status: "Incorrect", off: "Timekeeping", act: "Proof that nobody's in charge", to: "staff" },
              { name: "Cue Chalk", status: "Approved blue cube", off: "Recreational material", act: "Preparation before impact", to: "rack" },
              { name: "Coffee Mug", status: "Active", off: "Beverage container", act: "Heat without source", to: "lost" },
              { name: "Matchbook", status: "Three left", off: "Combustion aid", act: "Three more reasons", to: "lost" },
              { name: "Fuzzy Dice", status: "Hanging", off: "Decorative", act: "Luck, assigned not earned", to: "lost" },
              { name: "Receipt", status: "Coffee-ringed", off: "Transaction record", act: "Proof the night happened", to: "lost" },
              { name: "Hotline Poster", status: "Faded", off: "Wellness resource", act: "Help, theoretical", to: "lost" },
              { name: "Swan Feather", status: "Held", off: "Foreign object", act: "She was here. She isn't now.", to: "lost" },
              { name: "Timing Slip", status: "Pencil-marked", off: "Schedule artifact", act: "A run nobody scheduled", to: "lost" },
            ].map((o, i) => (
              <button key={i} onClick={() => go(o.to)} style={{
                all: "unset", cursor: "pointer", display: "block",
                background: "white", border: "1px solid #c4cfc1", padding: 12,
              }}>
                <div className="stripe" style={{ height: 72, background: "repeating-linear-gradient(45deg, #2a2622 0 6px, #1a1714 6px 12px)", color: "#9aa898", fontSize: 9, letterSpacing: "0.15em" }}>[{o.name.toLowerCase()}]</div>
                <div style={{ fontFamily: "var(--type-paper)", fontSize: 18, marginTop: 8, color: "#1a1f1a", lineHeight: 1.1 }}>{o.name}</div>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 10, color: "#5a6b58", marginTop: 4, letterSpacing: "0.05em" }}>STATUS: {o.status}</div>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 10, color: "#5a6b58", textDecoration: "line-through", textDecorationColor: "rgba(198,31,31,0.5)", marginTop: 6 }}>Official: {o.off}</div>
                <div style={{ fontFamily: "var(--type-typer)", fontSize: 12, color: "#1a1714", marginTop: 2 }}>Actual: {o.act}</div>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 10, color: "var(--hyperlink)", marginTop: 8 }}>↳ opens: {o.to === "rack" ? "The Rack" : o.to === "staff" ? "Staff Only" : "Lost & Found"}</div>
              </button>
            ))}
          </div>
        </section>

        {/* ============ HOUSE RULES ============ */}
        <section style={{ marginTop: 44 }}>
          <FaxPaper stamp="HOUSE RULES" style={{ position: "relative", overflow: "visible" }}>
            <div style={{ fontFamily: "var(--type-typer)", fontSize: 11, letterSpacing: "0.18em", color: "#5a513f" }}>OMNISHIFT POLICY DOCUMENT § 3.17</div>
            <div style={{ fontFamily: "var(--type-ui)", fontSize: 26, fontWeight: 700, marginTop: 4, color: "#5a513f" }}>
              <Strike>Breakroom Conduct Policy</Strike>
            </div>
            <ol style={{ fontFamily: "var(--type-paper)", fontSize: 22, lineHeight: 1.5, marginTop: 10, paddingLeft: 28, color: "#1a1714" }}>
              <li>Stay late.</li>
              <li>Keep score.</li>
              <li>No soft hands.</li>
              <li>Don't talk through the break.</li>
              <li>Leave the room better than you found it.</li>
              <li>Don't mistake quiet for empty.</li>
              <li><strong>Pool is in the DNA. Never the costume.</strong></li>
              <li>The room sees everything.</li>
            </ol>
            <div style={{ borderTop: "1px dashed #c8bfa6", marginTop: 16, paddingTop: 10, fontSize: 12, color: "#5a513f" }}>
              Management requested clarification. None was provided. <em>/s/ Unknown Employee, Fluorescent Operations</em>
            </div>
          </FaxPaper>
        </section>

        {/* ============ UNIFORM ISSUE — products ============ */}
        <section style={{ marginTop: 44 }}>
          <SectionHead corp="Uniform Issue / Shift End" rogue="It's clothes. Good ones." />
          <div style={{ fontSize: 13, color: "#5a6b58", marginTop: 6 }}>
            <Strike>Recommended apparel based on employee role, lighting condition, and proximity to unresolved business.</Strike>
          </div>

          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {D.products.map(p => (
              <div key={p.sku} style={{ background: "white", border: "1px solid #c4cfc1" }}>
                <div className="stripe" style={{ height: 220, background: "repeating-linear-gradient(45deg, #14110e 0 12px, #1a1714 12px 24px)", color: "#5a513f", fontSize: 10, letterSpacing: "0.18em" }}>
                  [{p.sku} — {p.name.toUpperCase()}]
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.18em", color: "#5a6b58" }}>ISSUED · {p.dept.toUpperCase()}</div>
                  <div style={{ fontFamily: "var(--type-paper)", fontSize: 22, marginTop: 4, color: "#1a1f1a", lineHeight: 1.05 }}>{p.name}</div>
                  <div style={{ fontFamily: "var(--type-typer)", fontSize: 13, color: "#3a3328", marginTop: 6, lineHeight: 1.4 }}>{p.reason}</div>
                  <div style={{ fontFamily: "var(--type-mono)", fontSize: 10, color: "#5a6b58", marginTop: 8 }}>Related: {p.obj}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 8 }}>
                    <span style={{ fontFamily: "var(--type-mono)", fontSize: 14, fontWeight: 700, color: "#1a1f1a" }}>{p.price}</span>
                    <select style={{ flex: "0 0 50px", fontFamily: "var(--type-mono)", fontSize: 11, padding: "4px 6px", border: "1px solid #c4cfc1" }}>
                      <option>S</option><option>M</option><option>L</option><option>XL</option>
                    </select>
                    <button className="btn-stamp" style={{ padding: "8px 12px", fontSize: 10, background: "var(--beer-red)", borderColor: "var(--beer-red)" }} onClick={() => go("rack")}>Quick add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ UNAUTHORIZED BULLETIN FEED ============ */}
        <section style={{ marginTop: 44, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
          <div>
            <SectionHead corp="Unauthorized Bulletin Feed" rogue="That's why they're readable." />
            <div style={{ fontSize: 13, color: "#5a6b58", marginTop: 6 }}>
              <Strike>The following headlines have not been verified by OmniShift.</Strike>
            </div>
            <div style={{ marginTop: 14, background: "var(--nicotine)", border: "1.5px solid var(--ink)", padding: "16px 18px" }}>
              {[
                "ROOM CLOCK STILL WRONG, MANAGEMENT CALLS IT CULTURAL",
                "EMPLOYEE DENIES APPLYING, RECEIVES PARKING ASSIGNMENT",
                "HOT DOGS RULED UNTRUSTWORTHY BY LOCAL CLERK",
                "LOWRIDER REPORTED BREATHING NEAR VACANCY SIGN",
                "COFFEE FRESHNESS COULD NOT BE VERIFIED",
                "CORRECTION: THE SWAN WAS NOT DRIVING",
              ].map((h, i) => (
                <div key={i} style={{ borderBottom: i < 5 ? "1px dashed #8a7c5e" : "none", padding: "8px 0" }}>
                  <a href="#" onClick={(e)=>{e.preventDefault(); go("newsstand");}} style={{ fontFamily: "var(--type-paper)", fontSize: 19, lineHeight: 1.15, color: "var(--ink)", textDecoration: "none" }}>{h}</a>
                </div>
              ))}
              <button className="btn-stamp" style={{ marginTop: 12 }} onClick={() => go("newsstand")}>OPEN 3AM EDITION →</button>
            </div>
          </div>

          {/* COMPANY PHONE TEASER */}
          <div>
            <SectionHead corp="Company Phone" rogue={null} />
            <div style={{ marginTop: 14, background: "white", border: "1px solid #c4cfc1" }}>
              <div style={{ background: "#e7eee5", padding: "10px 14px", display: "flex", justifyContent: "space-between", fontFamily: "var(--type-mono)", fontSize: 11, color: "#5a6b58", letterSpacing: "0.15em" }}>
                <span>VOICEMAIL · 3 UNREAD</span>
                <span className="os-blink" style={{ color: "var(--correction)" }}>● LIVE</span>
              </div>
              {D.voicemails.slice(0, 3).map((m, i) => (
                <div key={i} style={{ padding: "10px 14px", borderTop: "1px solid #e7eee5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: 13 }}>{m.from}</strong>
                    <span style={{ fontFamily: "var(--type-mono)", fontSize: 10, color: "#5a6b58" }}>{m.time}</span>
                  </div>
                  <div style={{ fontFamily: "var(--type-typer)", fontSize: 12, color: "#3a3328", marginTop: 4, lineHeight: 1.4 }}>{m.body.slice(0, 110)}{m.body.length > 110 ? "…" : ""}</div>
                </div>
              ))}
              <div style={{ padding: 12, borderTop: "1px solid #e7eee5" }}>
                <button className="btn-pill" style={{ width: "100%" }} onClick={() => go("phone")}>Check messages →</button>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SUBTLE SIGNUP ============ */}
        <section style={{ marginTop: 44, padding: "28px 32px", background: "white", border: "1px solid #c4cfc1", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: showFile ? "1fr" : "1.2fr 1fr", gap: 30, alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "var(--type-mono)", fontSize: 10, letterSpacing: "0.18em", color: "#5a6b58" }}>OMNISHIFT / NEWSLETTERS</div>
              <h3 style={{ fontFamily: "var(--type-ui)", fontSize: 30, fontWeight: 800, margin: "4px 0 8px" }}>Get the 3AM Edition</h3>
              <p style={{ fontFamily: "var(--type-typer)", fontSize: 15, color: "#3a3328", lineHeight: 1.5, margin: 0, maxWidth: 520 }}>
                Headlines, object reports, drop notes, and whatever gets left on the table. Goes out at 3 a.m. We don't write it. We just file it.
              </p>

              {!showFile && (
                <div style={{ marginTop: 18, display: "flex", gap: 0, maxWidth: 480, border: "1.5px solid #1a1f1a", background: "#f6f9f5" }}>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") subscribe(); }} placeholder="email@somewhere.late" style={{ flex: 1, border: "none", outline: "none", padding: "12px 14px", background: "transparent", fontSize: 15 }} />
                  <button className="btn-stamp" onClick={subscribe} style={{ borderRadius: 0 }}>SUBSCRIBE</button>
                </div>
              )}

              {/* Subscription stages */}
              {showFile && (
                <div style={{ marginTop: 18, fontFamily: "var(--type-mono)", fontSize: 14, color: "#1a1f1a", maxWidth: 600, lineHeight: 2 }}>
                  <div>&gt; Subscription received.</div>
                  {showFile !== "received" && <div style={{ color: "#5a6b58" }}>&gt; Creating file<span className="blink"></span></div>}
                  {(showFile === "department" || showFile === "hired") && <div style={{ color: "#5a6b58" }}>&gt; Assigning department<span className="blink"></span></div>}
                  {showFile === "hired" && (
                    <>
                      <div>&gt; Employee record created.</div>
                      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--warning)", color: "#2a1f00", border: "1px solid #b08a00", fontFamily: "var(--type-typer)", fontSize: 14 }}>
                        Wait. That wasn't supposed to happen.
                      </div>
                      <div style={{ marginTop: 14, fontSize: 13, color: "#5a6b58" }}>OmniShift has opened a temporary file for you.</div>
                    </>
                  )}
                </div>
              )}

              {/* The file */}
              {showFile === "hired" && tempFile && (
                <div style={{ marginTop: 16, padding: "16px 18px", background: "#f6f9f5", border: "1px solid #c4cfc1", maxWidth: 600 }}>
                  <div style={{ fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.2em", color: "var(--dashboard)" }}>OMNISHIFT · TEMPORARY FILE · {tempFile.issued}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10, fontFamily: "var(--type-mono)", fontSize: 12 }}>
                    <Cell2 label="Temporary File ID" value={tempFile.id} />
                    <Cell2 label="Department" value={tempFile.department} />
                    <Cell2 label="Assigned Object" value={tempFile.object} />
                    <Cell2 label="Uniform" value={tempFile.uniform} />
                    <div style={{ gridColumn: "1 / -1" }}><Cell2 label="House Rule" value={tempFile.rule} /></div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                    <button className="btn-stamp" onClick={() => go("portal")}>OPEN FILE →</button>
                    <button className="btn-pill" onClick={() => { setShowFile(null); setEmail(""); setTempFile(null); }}>not now</button>
                  </div>
                  <div style={{ marginTop: 10, fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.05em", color: "#9aa898" }}>
                    This is a fictional brand experience. Not employment, not a contract, not real HR. /s/ Management
                  </div>
                </div>
              )}
            </div>

            {!showFile && (
              <div style={{ position: "relative" }}>
                <FaxPaper stamp="3AM" style={{ transform: "rotate(2deg)" }}>
                  <div style={{ fontFamily: "var(--type-typer)", fontSize: 10, letterSpacing: "0.18em" }}>VOL. 1 · NO. 47</div>
                  <div style={{ fontFamily: "var(--type-paper)", fontSize: 28, lineHeight: 0.95, marginTop: 6 }}>The 3AM Edition</div>
                  <div style={{ fontFamily: "var(--type-paper)", fontSize: 14, marginTop: 10, lineHeight: 1.3, fontStyle: "italic" }}>
                    "All the news the room will admit to."
                  </div>
                  <div style={{ fontFamily: "var(--type-typer)", fontSize: 11, marginTop: 10, color: "#5a513f", borderTop: "1px dashed #c8bfa6", paddingTop: 8 }}>
                    delivered to a place you check at 3 a.m.
                  </div>
                </FaxPaper>
              </div>
            )}
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer style={{ marginTop: 50, padding: "20px 0", borderTop: "1px solid #c4cfc1", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, fontFamily: "var(--type-mono)", fontSize: 11, color: "#5a6b58" }}>
          <span>© SleeperNet, an OmniShift property. Internal page. Hours: late.</span>
          <span>
            <a href="#" onClick={(e) => { e.preventDefault(); go("search"); }}>SleeperNet</a> ·{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); go("portal"); }}>Portal</a> ·{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); go("staff"); }} style={{ color: "#9aa898", textDecoration: "none" }}>·</a>{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); go("staff"); }} style={{ color: "#9aa898" }}>staff only</a> ·{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); go("clockout"); }} style={{ color: "var(--beer-red)", fontFamily: "var(--type-mono)", letterSpacing: "0.14em" }}>CLOCK OUT ▸</a>
          </span>
        </footer>
      </div>
    </div>
  );
}

function NavItem({ corp, rogue, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      all: "unset", cursor: "pointer", padding: "6px 10px", marginRight: 4,
      fontFamily: "var(--type-mono)", fontSize: 12,
      borderBottom: active ? "2px solid var(--correction)" : "2px solid transparent",
      color: active ? "var(--ink)" : "#5a6b58",
    }}>
      {rogue ? (
        <>
          <span style={{ textDecoration: "line-through", textDecorationColor: "rgba(198,31,31,0.7)", color: "#9aa898" }}>{corp}</span>
          <span style={{ marginLeft: 6, fontFamily: "'Caveat', 'Special Elite', cursive", color: "var(--correction)", fontSize: 14 }}>{rogue}</span>
        </>
      ) : corp}
    </button>
  );
}

function SectionHead({ corp, rogue }) {
  return (
    <div>
      <h2 style={{ fontFamily: "var(--type-ui)", fontSize: 28, fontWeight: 800, margin: 0, color: "#1a1f1a", letterSpacing: "-0.01em" }}>{corp}</h2>
      {rogue && <div style={{ fontFamily: "'Caveat', 'Special Elite', cursive", fontSize: 22, color: "var(--correction)", marginTop: 2, transform: "rotate(-0.5deg)", display: "inline-block" }}>— {rogue}</div>}
    </div>
  );
}

function Cell2({ label, value }) {
  return (
    <div style={{ background: "white", border: "1px solid #c4cfc1", padding: "6px 10px" }}>
      <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "#5a6b58" }}>{label.toUpperCase()}</div>
      <div style={{ fontWeight: 700, color: "#1a1f1a", marginTop: 2 }}>{value}</div>
    </div>
  );
}

window.BreakroomLanding = BreakroomLanding;
