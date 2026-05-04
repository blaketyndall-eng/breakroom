// Newsstand — 3AM Edition
const { useState: useStateN } = React;

function Newsstand({ go, openSignup, employee }) {
  const D = window.BREAKROOM_DATA;
  const [aiHeadline, setAiHeadline] = useStateN(null);
  const [aiLoading, setAiLoading] = useStateN(false);

  const generateFrontPage = async () => {
    setAiLoading(true);
    try {
      const ctx = employee
        ? `for an OmniShift employee in department "${employee.department}", role "${employee.role}", assigned object "${employee.object}"`
        : "for a visitor who has not yet been hired";
      const text = await window.claude.complete({
        messages: [{ role: "user", content: `Write a fake newspaper front-page headline + 1-sentence subhead + 2-sentence blurb for "The 3AM Edition", an after-hours newspaper. Tone: deadpan, absurd, slightly cursed Americana. ${ctx}. Format strictly:\nHEADLINE: <ALL CAPS HEADLINE>\nSUBHEAD: <one sentence, deadpan>\nBLURB: <two sentences>\nNo quotation marks around the output.` }]
      });
      setAiHeadline(text);
    } catch (e) {
      setAiHeadline("HEADLINE: ROOM OBSERVES VISITOR, CALLS IT CULTURAL\nSUBHEAD: Visitor unavailable for comment, present anyway.\nBLURB: Sources confirm the room continues to read what time it reads. The visitor declined to leave.");
    }
    setAiLoading(false);
  };

  return (
    <div data-section="newsstand" style={{ minHeight: "calc(100vh - 28px)", paddingBottom: 60 }}>
      {/* Masthead */}
      <div className="wrap" style={{ paddingTop: 22 }}>
        <div className="masthead" style={{ padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--type-typer)", fontSize: 11, letterSpacing: "0.18em" }}>VOL. 1 · NO. 47 · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).toUpperCase()} · 25¢ (suggested)</div>
            <h1 style={{ fontSize: 88, lineHeight: 0.9, margin: "6px 0 0", letterSpacing: "-0.02em" }}>The 3AM Edition</h1>
            <div style={{ fontFamily: "var(--type-typer)", fontSize: 13, marginTop: 4 }}>"All the news the room will admit to." · A NEWSSTAND PUBLICATION · A SLEEPERNET PROPERTY</div>
          </div>
          <div style={{ textAlign: "right", fontFamily: "var(--type-typer)", fontSize: 12, lineHeight: 1.5 }}>
            LOT WEATHER: cold after the bass stops<br/>
            ROOM CLOCK: <strong>1:47 a.m.</strong> (cultural)<br/>
            COFFEE: not fresh / active<br/>
            SWAN STATUS: unknown / driving
          </div>
        </div>
      </div>

      {/* AI front page */}
      <div className="wrap" style={{ marginTop: 18 }}>
        <div style={{ background: "#dfd4b6", border: "1.5px solid var(--ink)", padding: "12px 16px", fontFamily: "var(--type-typer)", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <strong style={{ letterSpacing: "0.05em" }}>3AM FRONT PAGE GENERATOR</strong> — your personalized clipping. {employee ? `Filed for ${employee.id}.` : "Hire yourself first for a personalized one."}
          </div>
          <button className="btn-stamp" onClick={generateFrontPage} disabled={aiLoading}>{aiLoading ? "FILING…" : "FILE STORY"}</button>
        </div>
        {aiHeadline && (
          <div style={{ marginTop: 14, padding: "20px 24px", border: "2px double var(--ink)", background: "#f1e6c7", whiteSpace: "pre-wrap", lineHeight: 1.55 }}>
            {aiHeadline.split("\n").map((line, i) => {
              if (line.startsWith("HEADLINE:")) return <h2 key={i} style={{ fontSize: 36, lineHeight: 1, margin: "0 0 6px", fontFamily: "var(--type-paper)" }}>{line.replace("HEADLINE:", "").trim()}</h2>;
              if (line.startsWith("SUBHEAD:")) return <div key={i} style={{ fontStyle: "italic", fontFamily: "var(--type-paper)", fontSize: 18, color: "#3a3328", marginBottom: 10 }}>{line.replace("SUBHEAD:", "").trim()}</div>;
              if (line.startsWith("BLURB:")) return <div key={i} style={{ fontFamily: "var(--type-typer)", fontSize: 14 }}>{line.replace("BLURB:", "").trim()}</div>;
              return <div key={i}>{line}</div>;
            })}
          </div>
        )}
      </div>

      {/* Above the fold */}
      <div className="wrap" style={{ marginTop: 26, display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 28, borderTop: "2px solid var(--ink)", paddingTop: 24 }} id="room-clock">
        {/* lead */}
        <article>
          <div className="meta">BREAKING · {D.headlines.breaking[0].byline}</div>
          <h2 style={{ fontSize: 52, lineHeight: 0.95, margin: "6px 0 10px" }}>{D.headlines.breaking[0].t}</h2>
          <div style={{ fontFamily: "var(--type-paper)", fontSize: 19, fontStyle: "italic", color: "#3a3328" }}>{D.headlines.breaking[0].k}</div>
          <div className="pp" style={{ height: 240, marginTop: 14, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(232,223,199,0.5)", fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.2em" }}>[PHOTO — wall clock, above the door]</div>
          </div>
          <div style={{ fontFamily: "var(--type-typer)", fontSize: 11, marginTop: 6, color: "#5a513f" }}>Photo: archive · cleared by Compliance &amp; Felt</div>
          <div style={{ columnCount: 2, columnGap: 22, marginTop: 14, fontFamily: "var(--type-paper)", fontSize: 16, lineHeight: 1.55 }} className="col-rule">
            <p>The room clock has read 1:47 a.m. for the third consecutive year, OmniShift confirmed late Tuesday. Maintenance has been reassigned to Fluorescent Operations for what officials are calling "acoustic concerns."</p>
            <p>"It's not broken," a spokesperson said, declining to specify what it was. "It is reading what time it reads." Asked for clarification, the spokesperson left the room and did not return for the duration of the interview.</p>
            <p>The clock will not be replaced. Employees who notice the time should report it only if they have nothing else to report. Those who have been observed thanking the clock will be observed harder.</p>
          </div>
        </article>

        {/* sidebar — sightings + correction */}
        <aside id="sightings">
          <div className="meta">PRODUCT SIGHTINGS</div>
          {D.headlines.sightings.map((h, i) => (
            <div key={i} style={{ borderBottom: "1px dashed #8a7c5e", paddingBottom: 12, marginBottom: 12 }}>
              <h3 style={{ fontSize: 22, lineHeight: 1.05, margin: "4px 0" }}>{h.t}</h3>
              <div style={{ fontFamily: "var(--type-paper)", fontSize: 14, fontStyle: "italic", color: "#3a3328" }}>{h.k}</div>
            </div>
          ))}
          <div id="correction" className="correction-box" style={{ marginTop: 14 }}>
            <strong style={{ fontSize: 12, letterSpacing: "0.18em" }}>CORRECTION</strong>
            <div style={{ marginTop: 6, fontSize: 13 }}>{D.headlines.corrections[0].t}. {D.headlines.corrections[0].k}</div>
          </div>
        </aside>

        {/* memos column */}
        <aside id="memos">
          <div className="meta">STAFF MEMOS · ACCIDENTALLY PUBLISHED</div>
          {D.headlines.memos.map((h, i) => (
            <FaxPaper key={i} style={{ marginTop: 10 }} stamp={i === 0 ? "LEAKED" : null}>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "#5a513f" }}>{h.t}</div>
              <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{h.b}</div>
            </FaxPaper>
          ))}
        </aside>
      </div>

      {/* Classifieds + Missed Connections + Notices */}
      <div className="wrap" style={{ marginTop: 36, borderTop: "2px solid var(--ink)", paddingTop: 16 }} id="classifieds">
        <h2 style={{ fontSize: 36, margin: "0 0 8px" }}>Classifieds &amp; Missed Connections</h2>
        <div style={{ fontFamily: "var(--type-typer)", fontSize: 12, color: "#3a3328", marginBottom: 14 }}>To place an ad, do not place an ad. They place themselves. · § 3.17 c</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {D.headlines.classifieds.map((c, i) => (
            <div key={i} className="classified" style={{ borderBottom: "1px dashed #8a7c5e", paddingBottom: 10 }}>
              <strong>{c.head}</strong> — {c.body}
            </div>
          ))}
        </div>

        <h3 id="missed" style={{ fontSize: 24, margin: "26px 0 8px", fontFamily: "var(--type-paper)" }}>Missed Connections</h3>
        <div className="classified" style={{ columnCount: 2, columnGap: 24 }}>
          {D.headlines.missed.map((m, i) => (
            <p key={i} style={{ marginTop: 0 }}><strong>{m.t}</strong> — {m.b}</p>
          ))}
        </div>
      </div>

      {/* Notices */}
      <div className="wrap" style={{ marginTop: 36, borderTop: "2px solid var(--ink)", paddingTop: 16 }}>
        <h2 style={{ fontSize: 32, margin: "0 0 14px" }}>Public Notices</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {D.headlines.notices.map((n, i) => (
            <div key={i} style={{ border: "2px solid var(--ink)", padding: "14px 16px", background: "#efe7d3" }}>
              <div className="meta" style={{ color: "var(--correction)" }}>NOTICE · {String(i+1).padStart(3,"0")}</div>
              <h4 style={{ fontSize: 20, lineHeight: 1.1, margin: "4px 0 6px" }}>{n.t}</h4>
              <div style={{ fontFamily: "var(--type-typer)", fontSize: 13 }}>{n.b}</div>
            </div>
          ))}
        </div>
      </div>

      <div id="hot-dogs" className="wrap" style={{ marginTop: 40, fontFamily: "var(--type-typer)", fontSize: 12, textAlign: "center", color: "#5a513f", borderTop: "4px double var(--ink)", paddingTop: 14 }}>
        END OF EDITION · NEXT EDITION FILED 3:17 A.M. ·{" "}
        <a href="#" onClick={(e)=>{e.preventDefault(); openSignup();}}>Subscribe to 3AM Edition</a> ·{" "}
        <a href="#" onClick={(e)=>{e.preventDefault(); go("staff");}}>Staff Only</a>
      </div>
    </div>
  );
}

window.Newsstand = Newsstand;
