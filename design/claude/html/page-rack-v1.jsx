// The Rack — buried shop. Underground Breakroom layer.
const { useState: useStateR } = React;

function TheRack({ go, employee }) {
  const D = window.BREAKROOM_DATA;
  const [open, setOpen] = useStateR(null);
  const recommendation = employee ? D.products.find(p => p.name === employee.uniform) : null;

  return (
    <div data-section="breakroom" style={{ minHeight: "calc(100vh - 28px)", paddingBottom: 80 }}>
      <div className="wrap" style={{ paddingTop: 30 }}>
        <div className="br-eyebrow">THE BREAKROOM · DROP 01 · SHIFT END · ISSUED, NOT SOLD</div>
        <h1 className="br-title" style={{ fontSize: 80, lineHeight: 0.9, margin: "8px 0 4px" }}>The Rack.</h1>
        <p style={{ fontFamily: "var(--type-paper)", fontStyle: "italic", color: "#9a8c70", fontSize: 22, maxWidth: 720, marginTop: 0 }}>
          Six items. Each one issued for an hour you've already lived. Pool is in the DNA. Never the costume.
        </p>

        {/* TAGLINE BLOCK */}
        <div style={{ marginTop: 30, padding: "26px 30px", border: "1px solid #2a2622", background: "#14110e", maxWidth: 760 }}>
          <div className="br-eyebrow" style={{ color: "var(--beer-red)" }}>HOUSE COPY</div>
          <p style={{ fontFamily: "var(--type-paper)", fontSize: 26, lineHeight: 1.3, color: "var(--nicotine)", margin: "8px 0 10px" }}>
            The Breakroom is for after-hours people. For the ones leaning on the rail, parked outside, wiping down the bar, rolling down the window, staying later than they planned.
          </p>
          <div style={{ fontFamily: "var(--type-mono)", fontSize: 13, letterSpacing: "0.05em", color: "var(--motel-blue)" }}>
            Pool is in the DNA. Never the costume.
          </div>
          <div style={{ fontFamily: "var(--type-mono)", fontSize: 13, letterSpacing: "0.18em", color: "var(--beer-red)", marginTop: 4 }}>
            CLOCK OUT. CHALK UP.
          </div>
        </div>

        {recommendation && (
          <div style={{ marginTop: 24, border: "1px dashed var(--motel-blue)", padding: "12px 16px", color: "#b1c5ff", fontFamily: "var(--type-mono)", fontSize: 12, letterSpacing: "0.05em" }}>
            ◆ ASSIGNED FOR YOU, {employee.id}: <strong style={{ color: "var(--nicotine)" }}>{recommendation.name}</strong> — {recommendation.dept}
          </div>
        )}

        {/* PRODUCT GRID */}
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 22 }}>
          {D.products.map(p => (
            <button key={p.sku} onClick={() => setOpen(p)} className="br-card" style={{
              all: "unset", cursor: "pointer", display: "block",
              border: "1px solid #2a2622", background: "#0f0d0b",
            }}>
              <div className="stripe" style={{ height: 280, background: "repeating-linear-gradient(45deg, #14110e 0 12px, #1a1714 12px 24px)", color: "#5a513f", fontSize: 10, letterSpacing: "0.2em" }}>
                [{p.sku} — {p.name.toUpperCase()}]
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div className="br-eyebrow" style={{ color: "var(--motel-blue)" }}>{p.dept}</div>
                <div style={{ fontFamily: "var(--type-paper)", fontSize: 24, color: "var(--nicotine)", margin: "4px 0 6px" }}>{p.name}</div>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 13, color: "var(--chrome)" }}>{p.price}<span style={{ color: "#5a513f" }}> · {p.sku}</span></div>
              </div>
            </button>
          ))}
        </div>

        {open && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setOpen(null)}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "#0f0d0b", border: "1px solid #2a2622", color: "var(--nicotine)", width: "min(820px, 100%)", maxHeight: "92vh", overflow: "auto", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div className="stripe" style={{ minHeight: 420, background: "repeating-linear-gradient(45deg, #14110e 0 12px, #1a1714 12px 24px)", color: "#5a513f", fontSize: 10, letterSpacing: "0.2em" }}>
                [{open.sku} — {open.name.toUpperCase()}]
              </div>
              <div style={{ padding: "22px 26px" }}>
                <div className="br-eyebrow" style={{ color: "var(--motel-blue)" }}>ISSUED BY · {open.dept}</div>
                <h2 className="br-title" style={{ fontSize: 36, margin: "4px 0 8px" }}>{open.name}</h2>
                <div style={{ fontFamily: "var(--type-mono)", fontSize: 14, color: "var(--chrome)", marginBottom: 14 }}>{open.price} · {open.sku}</div>
                <p style={{ fontFamily: "var(--type-paper)", fontSize: 18, fontStyle: "italic", color: "#c8bfa6", lineHeight: 1.4 }}>{open.reason}</p>
                <div style={{ marginTop: 14, fontFamily: "var(--type-mono)", fontSize: 12, color: "#9a8c70", lineHeight: 1.7 }}>
                  RELATED OBJECT · <a href="#" onClick={(e)=>{e.preventDefault(); go("lost"); setOpen(null);}} style={{ color: "#b1c5ff" }}>{open.obj}</a><br/>
                  RELATED CLIPPING · <a href="#" onClick={(e)=>{e.preventDefault(); go("newsstand"); setOpen(null);}} style={{ color: "#b1c5ff" }}>{open.clip}</a><br/>
                  SIZING · S / M / L / XL — fits like a uniform
                </div>
                <button className="btn-stamp" style={{ marginTop: 20, width: "100%", background: "var(--beer-red)", borderColor: "var(--beer-red)" }}>ADD TO LOCKER · {open.price}</button>
                <div style={{ marginTop: 8, fontFamily: "var(--type-mono)", fontSize: 10, color: "#5a513f", letterSpacing: "0.1em" }}>checkout opens 1:47 a.m. · drop is held in the lot</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.TheRack = TheRack;
