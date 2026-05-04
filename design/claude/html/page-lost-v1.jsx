// Lost & Found object archive
const { useState: useStateL } = React;

function LostFound({ go, employee }) {
  const D = window.BREAKROOM_DATA;
  const [open, setOpen] = useStateL(null);
  const [filter, setFilter] = useStateL("ALL");
  const statuses = ["ALL","NOT RETURNED","HELD","IN ROTATION","ARCHIVED","DISPLAYED","EVIDENCE","QUARANTINED"];
  const items = filter === "ALL" ? D.objects : D.objects.filter(o => o.status === filter);

  return (
    <div data-section="newsstand" style={{ minHeight: "calc(100vh - 28px)", paddingBottom: 60 }}>
      <div className="wrap" style={{ paddingTop: 22 }}>
        <div style={{ borderTop: "4px double var(--ink)", borderBottom: "4px double var(--ink)", padding: "12px 0" }}>
          <div style={{ fontFamily: "var(--type-typer)", fontSize: 11, letterSpacing: "0.18em" }}>LOST.SLEEPER.NET · ARCHIVE OF UNRETURNED OBJECTS · INDEX 047</div>
          <h1 style={{ fontFamily: "var(--type-paper)", fontSize: 64, margin: "4px 0 0", lineHeight: 0.9 }}>Lost &amp; Found</h1>
          <div style={{ fontFamily: "var(--type-typer)", fontSize: 13, marginTop: 6 }}>Items found late. Filed warm. Most have meanings. Most do not have owners.</div>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              fontFamily: "var(--type-mono)", fontSize: 10, letterSpacing: "0.1em", padding: "5px 9px",
              border: "1px solid #8a7c5e", background: filter === s ? "var(--ink)" : "transparent",
              color: filter === s ? "var(--nicotine)" : "#3a3328", cursor: "pointer",
            }}>{s}</button>
          ))}
        </div>

        <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }} id="key-8">
          {items.map(o => (
            <button key={o.id} onClick={() => setOpen(o)} style={{
              all: "unset", cursor: "pointer", display: "block",
              border: "2px solid var(--ink)", padding: 0, background: "#f1e6c7",
              position: "relative",
            }}>
              <div className="pp" style={{ height: 160, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(232,223,199,0.55)", fontFamily: "var(--type-mono)", fontSize: 10, letterSpacing: "0.18em" }}>[ARTIFACT {o.id} — {o.name.toLowerCase()}]</div>
                <div className="tape" style={{ top: 8, left: 12 }}></div>
                <div className="tape" style={{ bottom: 8, right: 12, transform: "rotate(4deg)" }}></div>
              </div>
              <div style={{ padding: "10px 14px 14px" }}>
                <div style={{ fontFamily: "var(--type-typer)", fontSize: 11, color: "#5a513f", letterSpacing: "0.1em" }}>ITEM {o.id} · {o.status}</div>
                <div style={{ fontFamily: "var(--type-paper)", fontSize: 22, lineHeight: 1.05, marginTop: 4 }}>{o.name}</div>
                <div style={{ fontFamily: "var(--type-typer)", fontSize: 12, marginTop: 6, color: "#3a3328" }}>Found: {o.found}</div>
              </div>
            </button>
          ))}
        </div>

        {open && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(8,7,6,0.85)", zIndex: 9500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setOpen(null)}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "#f1e6c7", color: "var(--ink)", width: "min(640px, 100%)", border: "2px solid var(--ink)", padding: 0, maxHeight: "90vh", overflow: "auto", position: "relative" }}>
              <div className="pp" style={{ height: 220, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(232,223,199,0.55)", fontFamily: "var(--type-mono)", fontSize: 11, letterSpacing: "0.2em" }}>[ARTIFACT {open.id} — {open.name.toLowerCase()}]</div>
              </div>
              <div style={{ padding: "20px 26px 26px" }}>
                <div className="stamp" style={{ top: 240, right: 26, transform: "rotate(7deg)" }}>{open.status}</div>
                <div style={{ fontFamily: "var(--type-typer)", fontSize: 11, color: "#5a513f", letterSpacing: "0.18em" }}>ITEM NO. {open.id}</div>
                <h2 style={{ fontFamily: "var(--type-paper)", fontSize: 38, margin: "4px 0 12px", lineHeight: 0.95 }}>{open.name}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, fontFamily: "var(--type-typer)", fontSize: 14 }}>
                  <span style={{ color: "#5a513f" }}>FOUND:</span><span>{open.found}</span>
                  <span style={{ color: "#5a513f" }}>CONDITION:</span><span>{open.cond}</span>
                  <span style={{ color: "#5a513f" }}>MEANING:</span><span style={{ fontFamily: "var(--type-paper)", fontSize: 17, fontStyle: "italic" }}>{open.meaning}</span>
                  <span style={{ color: "#5a513f" }}>UNIFORM:</span><span><a href="#" onClick={(e)=>{e.preventDefault(); go("rack"); setOpen(null);}}>{open.uniform}</a></span>
                  <span style={{ color: "#5a513f" }}>HEADLINE:</span><span><a href="#" onClick={(e)=>{e.preventDefault(); go("newsstand"); setOpen(null);}}>{open.clip}</a></span>
                </div>
                <button className="btn-pill" onClick={() => setOpen(null)} style={{ marginTop: 18 }}>Close drawer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.LostFound = LostFound;
