// SleeperNet homepage + working search

const { useState: useStateS, useEffect: useEffectS, useRef: useRefS, useMemo: useMemoS } = React;

function SleeperNet({ go, openSignup }) {
  const D = window.BREAKROOM_DATA;
  const [mode, setMode] = useStateS(() => document.documentElement.getAttribute("data-site-mode") || "3AM");
  useEffectS(() => {
    const obs = new MutationObserver(() => setMode(document.documentElement.getAttribute("data-site-mode") || "3AM"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-site-mode"] });
    return () => obs.disconnect();
  }, []);
  const phPool = useMemoS(() => (
    mode === "DAY" ? D.searchPlaceholdersDay
    : mode === "CLOSED" ? D.searchPlaceholdersClosed
    : D.searchPlaceholders
  ), [mode]);
  const placeholder = useRotatingPlaceholder(phPool);
  const [q, setQ] = useStateS("");
  const [submitted, setSubmitted] = useStateS(null);
  const inputRef = useRefS(null);

  const results = useMemoS(() => {
    if (!submitted) return [];
    const tokens = submitted.toLowerCase().split(/\W+/).filter(Boolean);
    return D.corpus
      .map(item => {
        const hay = (item.title + " " + item.blurb + " " + item.tags.join(" ")).toLowerCase();
        let score = 0;
        tokens.forEach(t => { if (hay.includes(t)) score += 2; if (item.tags.includes(t)) score += 3; });
        return { ...item, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [submitted]);

  const submit = (override) => {
    const v = (override ?? q).trim();
    if (!v) return;
    setSubmitted(v);
  };

  const lucky = () => {
    const pick = D.searchPlaceholders[Math.floor(Math.random() * D.searchPlaceholders.length)];
    setQ(pick); submit(pick);
  };

  return (
    <div data-section="sleeper" style={{ minHeight: "calc(100vh - 28px)" }}>
      {/* Top utility strip */}
      <div className="wrap" style={{ paddingTop: 18, display: "flex", justifyContent: "space-between", fontFamily: "var(--type-mono)", fontSize: 12, color: "#5a513f" }}>
        <span>SleeperNet · search the after-hours internet · <a href="#" onClick={(e)=>{e.preventDefault(); go("staff");}} style={{ color: "#5a513f" }}>Staff Only</a></span>
        <span>
          <a href="#" onClick={(e)=>{e.preventDefault(); openSignup();}} style={{ color: "#5a513f" }}>Sign up for 3AM Edition</a>
          <span style={{ margin: "0 10px" }}>·</span>
          <a href="#" onClick={(e)=>{e.preventDefault(); go("portal");}} style={{ color: "#5a513f" }}>Employee sign in</a>
        </span>
      </div>

      {/* HERO */}
      <div className="wrap" style={{ paddingTop: submitted ? 28 : 90, paddingBottom: 28, textAlign: submitted ? "left" : "center" }}>
        {!submitted && (
          <>
            <div style={{ fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.3em", color: "#5a513f", marginBottom: 12 }}>
              OPEN LATE · INCORRECT OFTEN · POWERED BY UNPAID LIGHT
            </div>
            <SleeperWordmark size={140} />
            <div style={{ fontFamily: "var(--type-paper)", fontSize: 24, color: "#5a513f", marginTop: 6, marginBottom: 36, fontStyle: "italic" }}>
              Search the after-hours internet.<span style={{ color: "var(--beer-red)" }}> For things that should not be searchable.</span>
            </div>
          </>
        )}
        {submitted && (
          <div style={{ marginBottom: 16 }}>
            <SleeperWordmark size={48} />
          </div>
        )}

        <div style={{ maxWidth: 680, margin: submitted ? "0" : "0 auto" }}>
          <div className="search-shell">
            <div className="icon">⌕</div>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
              placeholder={placeholder || "search…"}
              autoFocus
            />
            <button className="btn-stamp" style={{ borderRadius: 0 }} onClick={() => submit()}>Search</button>
          </div>

          {!submitted && (
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
              <button className="btn-pill" onClick={() => submit()}>Search</button>
              <button className="btn-pill" onClick={lucky}>I'm Still Out</button>
              <button className="btn-pill" onClick={() => submit("Advanced Bad Decisions")}>Advanced Bad Decisions</button>
              <button className="btn-pill" style={{ background: "var(--ink)", color: "var(--nicotine)" }} onClick={() => go("breakroom")}>Enter The Breakroom →</button>
            </div>
          )}

          {!submitted && (
            <div style={{ marginTop: 26, fontSize: 13, color: "#5a513f" }}>
              <strong style={{ color: "var(--ink)", fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.18em" }}>TRENDING LATE:</strong>
              <span style={{ marginLeft: 10 }}>
                {D.trendingSearches.map((s, i) => (
                  <span key={s}>
                    <a href="#" onClick={(e) => { e.preventDefault(); setQ(s); submit(s); }} style={{ color: "var(--hyperlink)" }}>{s}</a>
                    {i < D.trendingSearches.length - 1 && <span style={{ color: "#a89c80" }}> · </span>}
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* RESULTS */}
      {submitted && (
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 40, paddingBottom: 80 }}>
          <div>
            <div style={{ fontFamily: "var(--type-mono)", fontSize: 12, color: "#5a513f", marginBottom: 8 }}>
              About {results.length} result{results.length !== 1 ? "s" : ""} ({(0.13 + Math.random()*0.4).toFixed(2)}s) · <a href="#" onClick={(e)=>{e.preventDefault(); setSubmitted(null); setQ("");}}>clear</a> · Clear History? <span style={{ color: "var(--beer-red)" }}>No.</span>
            </div>
            {results.length === 0 && (
              <div style={{ padding: "40px 0", fontFamily: "var(--type-paper)", fontSize: 22, color: "#5a513f" }}>
                Nothing surfaced. The room declines to comment. Try one of the trending searches.
              </div>
            )}
            {results.map((r, i) => (
              <div key={i} className="result-item">
                <span className="result-kind" data-k={r.kind}>{r.kind}</span>
                <div className="result-url">{r.url}</div>
                <a className="result-title" href="#" onClick={(e) => {
                  e.preventDefault();
                  if (r.url.startsWith("portal")) go("portal");
                  else if (r.url.startsWith("newsstand")) go("newsstand");
                  else if (r.url.startsWith("lost")) go("lost");
                  else if (r.url.startsWith("rack")) go("rack");
                  else if (r.url.startsWith("staff")) go("staff");
                  else if (r.url.startsWith("idlehands")) go("idlehands");
                }}>{r.title}</a>
                <div className="result-blurb">{r.blurb}</div>
              </div>
            ))}
            <div style={{ marginTop: 28, fontFamily: "var(--type-mono)", fontSize: 12, color: "#5a513f" }}>
              <span style={{ fontWeight: 700 }}>People also regretted:</span>{" "}
              <a href="#" onClick={(e)=>{e.preventDefault(); submit("applause money");}}>applause money</a> ·{" "}
              <a href="#" onClick={(e)=>{e.preventDefault(); submit("miss september");}}>miss september</a> ·{" "}
              <a href="#" onClick={(e)=>{e.preventDefault(); submit("how to leave without going home");}}>how to leave without going home</a>
            </div>
          </div>

          {/* Sponsored sidebar */}
          <aside style={{ paddingTop: 28 }}>
            <div style={{ border: "1px solid #c8bfa6", padding: 14, background: "#f6f1df", marginBottom: 14, position: "relative" }}>
              <div style={{ fontFamily: "var(--type-mono)", fontSize: 9, letterSpacing: "0.18em", color: "#5a513f" }}>SPONSORED · UNIFORM ASSIGNMENT</div>
              <div style={{ fontFamily: "var(--type-paper)", fontSize: 22, lineHeight: 1.05, marginTop: 6 }}>You may be eligible for issued workwear.</div>
              <div style={{ fontSize: 13, color: "#3a3328", marginTop: 6 }}>Click below to receive an assignment. Acceptance is automatic upon clicking.</div>
              <button className="btn-stamp" style={{ marginTop: 10, width: "100%" }} onClick={openSignup}>Receive assignment</button>
              <div className="stamp" style={{ top: 6, right: 10, fontSize: 9, padding: "2px 7px" }}>OMNISHIFT</div>
            </div>
            <div style={{ fontFamily: "var(--type-mono)", fontSize: 11, color: "#5a513f", lineHeight: 1.6 }}>
              ↳ <a href="#" onClick={(e)=>{e.preventDefault(); go("newsstand");}}>view today's Newsstand</a><br/>
              ↳ <a href="#" onClick={(e)=>{e.preventDefault(); go("phone");}}>check Company Phone</a><br/>
              ↳ <a href="#" onClick={(e)=>{e.preventDefault(); go("lost");}}>browse Lost &amp; Found</a><br/>
              ↳ <a href="#" onClick={(e)=>{e.preventDefault(); go("staff");}}>staff only</a>
            </div>
          </aside>
        </div>
      )}

      {/* FOOTER STRIP — buried links */}
      {!submitted && (
        <div className="wrap" style={{ paddingBottom: 40, marginTop: 60, fontFamily: "var(--type-mono)", fontSize: 11, color: "#5a513f", textAlign: "center" }}>
          <a href="#" onClick={(e)=>{e.preventDefault(); go("newsstand");}}>Newsstand</a> ·{" "}
          <a href="#" onClick={(e)=>{e.preventDefault(); go("lost");}}>Lost &amp; Found</a> ·{" "}
          <a href="#" onClick={(e)=>{e.preventDefault(); go("phone");}}>Company Phone</a> ·{" "}
          <a href="#" onClick={(e)=>{e.preventDefault(); go("portal");}}>OmniShift Portal</a> ·{" "}
          <a href="#" onClick={(e)=>{e.preventDefault(); go("staff");}} style={{ color: "#5a513f", textDecoration: "none" }}>·</a>{" "}
          <a href="#" onClick={(e)=>{e.preventDefault(); go("rack");}} style={{ color: "#5a513f", textDecoration: "none" }}>· </a>
          <div style={{ marginTop: 14 }}>© SleeperNet, an OmniShift property. Hours: late. Mood: depending. Coffee: not fresh.</div>
        </div>
      )}
    </div>
  );
}

window.SleeperNet = SleeperNet;
