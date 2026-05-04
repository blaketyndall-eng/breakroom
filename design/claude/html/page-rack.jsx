// THE RACK — 2003-style catalog page, hijacked by The Breakroom.
// Visual rule: this is a real old-web inventory portal first; voice leaks in second.

const { useState: useStateRk, useMemo: useMemoRk } = React;

// ============= EXTENDED INVENTORY (live + removed + redacted) =============
const RK_ROWS = [
  // AVAILABLE FOR ISSUE
  { sku: "BR-COT-001", name: "Clock Out Tee", price: 32.00, status: "AVAILABLE", dept: "Night Shift", obj: "Coffee Mug", desc: "For the hour after work and before home.", note: "Good shirt. Better after midnight.", views: 1247, color: "Bone", sizes: ["S","M","L","XL","2XL"], type: "Tee", section: "available" },
  { sku: "BR-HRT-002", name: "House Rules Tee", price: 32.00, status: "AVAILABLE", dept: "Compliance & Felt", obj: "Matchbook", desc: "For employees who need the rules where people can see them.", note: "Rule six is on the back. Don't read it in the mirror.", views: 893, color: "Black", sizes: ["S","M","L","XL"], type: "Tee", section: "available" },
  { sku: "BR-UDL-003", name: "Under Bad Lights Tee", price: 32.00, status: "AVAILABLE", dept: "Fluorescent Operations", obj: "Wall Clock", desc: "For rooms where the light tells the truth.", note: "Print misaligns by 1mm. Management approved this.", views: 1631, color: "Off-White", sizes: ["S","M","L","XL","2XL"], type: "Tee", section: "available" },
  { sku: "BR-IDH-004", name: "Idle Hands Tee", price: 32.00, status: "AVAILABLE", dept: "Lot Hours", obj: "Swan Feather", desc: "Lot Hours approved. Approved by whom is unclear.", note: "Loose fit. Designed to be worn over another shirt.", views: 712, color: "Cement", sizes: ["S","M","L","XL"], type: "Tee", section: "available" },
  { sku: "BR-SLC-005", name: "Stay Late Cap", price: 28.00, status: "AVAILABLE", dept: "Night Audit", obj: "Fuzzy Dice", desc: "Staff issue. Do not lose. Replacements not authorized.", note: "Brim has been creased for you. Do not uncrease.", views: 2104, color: "Brown", sizes: ["One Size"], type: "Cap", section: "available" },
  { sku: "BR-NSH-006", name: "Night Shift Hoodie", price: 88.00, status: "AVAILABLE", dept: "Cold Lots, Bad Coffee", obj: "Coffee Mug", desc: "For unresolved business.", note: "Heavyweight. Pocket fits a paperback or one motel key.", views: 3401, color: "Black", sizes: ["S","M","L","XL","2XL"], type: "Hoodie", section: "available" },

  // REMOVED FROM RACK
  { sku: "BR-SLC-005-A", name: "Stay Late Cap / Brown", price: 28.00, status: "REMOVED", dept: "Night Audit", obj: "Fuzzy Dice", desc: "Sold out. Re-issue depends on the lot.", lastSeen: "Behind the bar.", requests: 43, type: "Cap", section: "removed" },
  { sku: "BR-IDH-004-B", name: "Idle Hands Tee / Cement", price: 32.00, status: "REMOVED", dept: "Lot Hours", obj: "Swan Feather", desc: "Pulled from the rack. Last shipment small.", lastSeen: "Booth three.", requests: 27, type: "Tee", section: "removed" },
  { sku: "BR-COT-001-C", name: "Clock Out Tee / Bone, XL", price: 32.00, status: "REMOVED", dept: "Night Shift", obj: "Coffee Mug", desc: "Removed from the rack. Somebody wore it out of the room.", lastSeen: "7-Eleven, 4:33 a.m.", requests: 61, type: "Tee", section: "removed" },

  // REDACTED / PENDING / STAFF
  { sku: "BR-▓▓▓-008", name: "████████ TEE", status: "REMOVED_BY_MGMT", dept: "Unverified", obj: "Swan Feather", desc: "Item removed by Management. Reason: undisclosed.", type: "Tee", section: "redacted" },
  { sku: "BR-STF-009", name: "STAFF ONLY ITEM", status: "CLOCK_OUT", dept: "Staff Only", obj: "Motel Key No. 8", desc: "Visible after hours. Not before.", type: "Object", section: "redacted" },
  { sku: "BR-UNL-010", name: "UNLISTED HOODIE", status: "SEEN_AROUND", dept: "Lot Hours", obj: "Receipt", desc: "Not on the rack. Worn anyway.", type: "Hoodie", section: "redacted" },
  { sku: "BR-PND-011", name: "▓▓▓▓ CAP", status: "PENDING", dept: "Compliance & Felt", obj: "Cue Chalk", desc: "Uniform pending. Not yet issued.", type: "Cap", section: "redacted" },
];

const RK_STATUS = {
  AVAILABLE: { label: "AVAILABLE FOR ISSUE", c: "#1f4cc4" },
  REMOVED: { label: "REMOVED FROM RACK", c: "#a33" },
  REMOVED_BY_MGMT: { label: "ITEM REMOVED BY MANAGEMENT", c: "#a33" },
  CLOCK_OUT: { label: "CLOCK OUT TO VIEW", c: "#1f4cc4" },
  PENDING: { label: "UNIFORM PENDING", c: "#a07000" },
  SEEN_AROUND: { label: "SEEN AROUND", c: "#1a5a35" },
  LAST_AFTER: { label: "LAST SEEN AFTER HOURS", c: "#1a5a35" },
};

// ============= RACK PAGE =============
function TheRack({ go, employee }) {
  const [filters, setFilters] = useStateRk({ type: "All", shift: "All", dept: "All", status: "All", color: "All", size: "All", sort: "Default" });
  const [open, setOpen] = useStateRk(null);
  const [cart, setCart] = useStateRk([]);

  const filtered = useMemoRk(() => {
    let rows = [...RK_ROWS];
    if (filters.type !== "All") rows = rows.filter(r => r.type === filters.type);
    if (filters.dept !== "All") rows = rows.filter(r => r.dept === filters.dept);
    if (filters.status !== "All") rows = rows.filter(r => RK_STATUS[r.status]?.label === filters.status);
    if (filters.size !== "All") rows = rows.filter(r => (r.sizes || []).includes(filters.size));
    if (filters.color !== "All") rows = rows.filter(r => r.color === filters.color);
    if (filters.sort === "Price: Low to High") rows.sort((a,b) => (a.price||999) - (b.price||999));
    if (filters.sort === "Price: High to Low") rows.sort((a,b) => (b.price||0) - (a.price||0));
    if (filters.sort === "Most Viewed") rows.sort((a,b) => (b.views||0) - (a.views||0));
    return rows;
  }, [filters]);

  const available = filtered.filter(r => r.section === "available");
  const removed = filtered.filter(r => r.section === "removed");
  const redacted = filtered.filter(r => r.section === "redacted");

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div data-section="rack-2003" style={{
      minHeight: "calc(100vh - 28px)", background: "#f4f1e8",
      fontFamily: 'Verdana, Arial, "Helvetica Neue", sans-serif',
      fontSize: 12, color: "#1a1a1a", paddingBottom: 60,
    }}>

      {/* ===== TOP UTILITY BAR ===== */}
      <div style={{ background: "linear-gradient(180deg, #d8d2c4 0%, #c4bdac 100%)", borderBottom: "1px solid #8a8270", padding: "4px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontFamily: "Tahoma, Verdana, sans-serif" }}>
        <span style={{ color: "#3a3328" }}>
          <a href="#" onClick={(e)=>{e.preventDefault(); go("search");}} style={{ color: "#1f4cc4", textDecoration: "underline" }}>SleeperNet</a>
          {" > "}
          <a href="#" onClick={(e)=>{e.preventDefault(); go("portal");}} style={{ color: "#1f4cc4", textDecoration: "underline" }}>OmniShift Internal</a>
          {" > "}Employee Resources{" > "}
          <a href="#" onClick={(e)=>{e.preventDefault(); go("breakroom");}} style={{ color: "#1f4cc4", textDecoration: "underline" }}>The Breakroom</a>
          {" > "}<strong>The Rack</strong>
        </span>
        <span style={{ display: "flex", gap: 14 }}>
          <a href="#" onClick={(e)=>e.preventDefault()} style={{ color: "#1f4cc4", textDecoration: "underline" }}>Sign In</a>
          {employee && <a href="#" onClick={(e)=>{e.preventDefault(); go("portal");}} style={{ color: "#1f4cc4", textDecoration: "underline" }}>Employee File</a>}
          <a href="#" onClick={(e)=>e.preventDefault()} style={{ color: "#1f4cc4", textDecoration: "underline" }}>Current Issue ({cartCount})</a>
          <a href="#" onClick={(e)=>e.preventDefault()} style={{ color: "#1f4cc4", textDecoration: "underline" }}>Help</a>
          <a href="#" onClick={(e)=>{e.preventDefault(); go("clockout");}} style={{ color: "#a33", textDecoration: "underline", fontWeight: "bold" }}>Clock Out</a>
        </span>
      </div>

      {/* ===== SECONDARY STATUS STRIP ===== */}
      <div style={{ background: "#ebe5d4", borderBottom: "1px solid #c4bdac", padding: "5px 14px", fontSize: 10, fontFamily: 'Courier New, Courier, monospace', color: "#3a3328", display: "flex", gap: 18, flexWrap: "wrap" }}>
        <span><strong>Rack Status:</strong> <span style={{ color: "#1a5a35" }}>Open</span></span>
        <span><strong>Current Issue:</strong> Shift End</span>
        <span><strong>Available:</strong> {RK_ROWS.filter(r => r.section==="available").length}</span>
        <span><strong>Removed:</strong> {RK_ROWS.filter(r => r.section==="removed").length}</span>
        <span><strong>Connection:</strong> Stable Enough</span>
        <span><strong>Clock:</strong> 1:47 AM</span>
        <span style={{ marginLeft: "auto", color: "#a33", fontStyle: "italic", fontFamily: "Georgia, serif", fontSize: 11 }}>↪ Inventory is mostly wrong. Good enough.</span>
      </div>

      {/* ===== TITLE BLOCK ===== */}
      <div style={{ maxWidth: 980, margin: "20px auto 0", padding: "0 14px" }}>
        <div style={{ border: "2px solid #1a1a1a", borderTopWidth: 4, background: "#fffef8", padding: "16px 20px", boxShadow: "3px 3px 0 #d8d2c4" }}>
          <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 32, fontWeight: "normal", margin: 0, letterSpacing: "0.02em", color: "#1a1a1a" }}>THE RACK</h1>
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "#5a4a35", fontSize: 14, marginTop: 2 }}>Issued by the room. Not the company.</div>
          <hr style={{ border: 0, borderTop: "1px solid #c4bdac", margin: "10px 0" }} />
          <p style={{ margin: "0 0 6px", lineHeight: 1.55, color: "#1a1a1a" }}>
            <strong>Shift End</strong> is the first issue from The Breakroom.
            Six pieces for bad lights, cold lots, late rooms, and people still out.
          </p>
          <p style={{ margin: 0, lineHeight: 1.55, color: "#3a3328" }}>
            Some items are <span style={{ color: "#1f4cc4" }}>available</span>. Some were <span style={{ color: "#a33" }}>removed from the rack</span>. Some were never meant to be listed.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 16, fontSize: 12 }}>
            <a href="#available" style={linkStyle}>View Available Items</a>
            <span style={{ color: "#888" }}>|</span>
            <a href="#removed" style={linkStyle}>View Removed Items</a>
            <span style={{ color: "#888" }}>|</span>
            <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>File a Request</a>
            <span style={{ color: "#888" }}>|</span>
            <a href="#shift-builder" style={linkStyle}>Build Your Shift</a>
          </div>
        </div>

        {/* Assigned banner for hired users */}
        {employee && (
          <div style={{ marginTop: 12, border: "1px solid #1a5a35", background: "#e7eee5", padding: "8px 12px", fontSize: 11 }}>
            <strong style={{ color: "#1a5a35" }}>◆ ASSIGNED TO YOU ({employee.id}):</strong>{" "}
            {employee.uniform} — Department {employee.department}. <a href="#" onClick={(e)=>{e.preventDefault(); const m = RK_ROWS.find(r => r.name === employee.uniform); if (m) setOpen(m);}} style={linkStyle}>View File</a>
          </div>
        )}

        {/* ===== FILTER INVENTORY ===== */}
        <div style={{ marginTop: 18, border: "1px solid #8a8270", background: "#ebe5d4", padding: "10px 14px" }}>
          <div style={{ fontFamily: "Tahoma, Verdana, sans-serif", fontSize: 11, fontWeight: "bold", letterSpacing: "0.05em", color: "#3a3328", marginBottom: 8 }}>FILTER INVENTORY</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
            <FilterDD label="Issue Type" value={filters.type} options={["All","Tee","Hoodie","Cap","Object"]} onChange={(v)=>setFilters(f=>({...f, type:v}))} />
            <FilterDD label="Shift" value={filters.shift} options={["All","Night Shift","Lot Hours","Fluorescent Operations","Night Audit"]} onChange={(v)=>setFilters(f=>({...f, shift:v}))} />
            <FilterDD label="Department" value={filters.dept} options={["All", ...Array.from(new Set(RK_ROWS.map(r=>r.dept)))]} onChange={(v)=>setFilters(f=>({...f, dept:v}))} />
            <FilterDD label="Status" value={filters.status} options={["All","AVAILABLE FOR ISSUE","REMOVED FROM RACK","UNIFORM PENDING","ITEM REMOVED BY MANAGEMENT","CLOCK OUT TO VIEW","SEEN AROUND"]} onChange={(v)=>setFilters(f=>({...f, status:v}))} />
            <FilterDD label="Color" value={filters.color} options={["All","Bone","Off-White","Black","Cement","Brown"]} onChange={(v)=>setFilters(f=>({...f, color:v}))} />
            <FilterDD label="Size" value={filters.size} options={["All","S","M","L","XL","2XL","One Size"]} onChange={(v)=>setFilters(f=>({...f, size:v}))} />
            <FilterDD label="Sort By" value={filters.sort} options={["Default","Price: Low to High","Price: High to Low","Most Viewed"]} onChange={(v)=>setFilters(f=>({...f, sort:v}))} />
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
            <button style={btn3D}>Update Results</button>
            <a href="#" onClick={(e)=>{e.preventDefault(); setFilters({ type: "All", shift: "All", dept: "All", status: "All", color: "All", size: "All", sort: "Default" });}} style={linkStyle}>Clear Filters</a>
            <span style={{ marginLeft: "auto", color: "#5a4a35", fontSize: 11 }}>Showing <strong>{filtered.length}</strong> of {RK_ROWS.length} items</span>
          </div>
        </div>

        {/* ===== AVAILABLE FOR ISSUE ===== */}
        <SectionHead id="available" title="Available For Issue" intro="The following items are currently on the rack. If you see your size, don't wait for permission." />
        <ProductTable rows={available} onOpen={setOpen} onAdd={(p)=>setCart(c=>[...c, {sku:p.sku, qty:1}])} />

        {/* ===== REMOVED FROM RACK ===== */}
        <SectionHead id="removed" title="Removed From Rack" intro={<>Gone does not mean gone. It means somebody wore it out of the room.</>} />
        <RemovedTable rows={removed} />

        {/* ===== ITEMS NOT CURRENTLY VISIBLE ===== */}
        <SectionHead id="redacted" title="Items Not Currently Visible" intro={<>Management removed them. That does not mean they are not real.</>} />
        <RedactedTable rows={redacted} go={go} />

        {/* ===== BUILD YOUR SHIFT ===== */}
        <ShiftBuilder onView={(p) => setOpen(p)} />

        {/* ===== PRODUCT GRAVEYARD STRIP ===== */}
        <div style={{ marginTop: 28, border: "1px solid #8a8270", background: "#fffef8", padding: 14 }}>
          <div style={{ fontFamily: "Tahoma, sans-serif", fontSize: 11, fontWeight: "bold", letterSpacing: "0.05em", color: "#3a3328", marginBottom: 6 }}>PRODUCT GRAVEYARD — SIGHTINGS</div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, lineHeight: 1.7, color: "#1a1a1a" }}>
            <li><strong>Clock Out Tee / Bone, XL</strong> — last seen <em>7-Eleven, 4:33 a.m.</em>, paying for hot dogs nobody trusts. <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Open Sighting</a></li>
            <li><strong>Stay Late Cap / Brown</strong> — hanging on a hook behind the bar, 3 weeks running. <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Open Sighting</a></li>
            <li><strong>Idle Hands Tee / Cement</strong> — booth three, folded. <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Open Sighting</a></li>
            <li><strong>Night Shift Hoodie / Black</strong> — passenger seat, red lowrider, downtown. Driver unidentified. <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Open Sighting</a></li>
          </ul>
        </div>

        {/* ===== FOOTER ===== */}
        <div style={{ marginTop: 26, padding: "16px 0", borderTop: "1px solid #c4bdac", fontSize: 11, color: "#5a4a35", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span>
            <a href="#top" style={linkStyle}>Back to top</a> ·{" "}
            <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Printer friendly version</a> ·{" "}
            <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Email this file</a>
          </span>
          <span style={{ fontStyle: "italic", fontFamily: "Georgia, serif" }}>Inventory may be inaccurate. The room is usually more current than the system.</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 10, color: "#8a8270", fontFamily: "Courier New, monospace" }}>
          © SleeperNet, an OmniShift property · The Rack v2.1.7 · Last updated: 01:47 AM ·{" "}
          <a href="#" onClick={(e)=>{e.preventDefault(); go("staff");}} style={{ color: "#8a8270" }}>·</a>
        </div>
      </div>

      {/* ===== PRODUCT FILE MODAL ===== */}
      {open && <ProductFile p={open} onClose={() => setOpen(null)} onAdd={() => { setCart(c=>[...c, {sku:open.sku, qty:1}]); setOpen(null); }} go={go} />}
    </div>
  );
}

// ============= SECTION HEAD =============
function SectionHead({ id, title, intro }) {
  return (
    <div id={id} style={{ marginTop: 28, marginBottom: 8 }}>
      <div style={{ background: "#1a1a1a", color: "#fffef8", padding: "6px 12px", fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 18 }}>{title}</div>
      <div style={{ background: "#ebe5d4", padding: "6px 12px", fontSize: 12, color: "#3a3328", borderLeft: "1px solid #8a8270", borderRight: "1px solid #8a8270", borderBottom: "1px solid #8a8270", fontFamily: "Georgia, serif", fontStyle: "italic" }}>{intro}</div>
    </div>
  );
}

// ============= PRODUCT TABLE (available) =============
function ProductTable({ rows, onOpen, onAdd }) {
  if (!rows.length) return <div style={emptyBox}>No items match your filters.</div>;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #8a8270", background: "#fffef8", fontSize: 12 }}>
      <thead>
        <tr style={{ background: "#d8d2c4", borderBottom: "2px solid #8a8270" }}>
          <th style={th}>Item</th>
          <th style={th}>Details</th>
          <th style={{...th, width: 90, textAlign: "right"}}>Price</th>
          <th style={{...th, width: 220}}>Order</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p, i) => (
          <tr key={p.sku} style={{ borderBottom: "1px solid #c4bdac", background: i % 2 ? "#faf7ec" : "#fffef8", verticalAlign: "top" }}>
            <td style={td}>
              <button onClick={() => onOpen(p)} style={{ all: "unset", cursor: "pointer", display: "block" }}>
                <Thumb sku={p.sku} name={p.name} />
                <div style={{ fontSize: 10, color: "#1f4cc4", textDecoration: "underline", marginTop: 4, textAlign: "center" }}>click image for larger view</div>
              </button>
            </td>
            <td style={td}>
              <a href="#" onClick={(e)=>{e.preventDefault(); onOpen(p);}} style={{ color: "#1f4cc4", textDecoration: "underline", fontSize: 14, fontWeight: "bold" }}>{p.name}</a>
              <div style={{ marginTop: 4, fontSize: 11 }}>
                <strong style={{ color: RK_STATUS[p.status].c }}>Status:</strong>{" "}
                <span style={{ color: RK_STATUS[p.status].c, fontWeight: "bold" }}>{RK_STATUS[p.status].label}</span>
              </div>
              <div style={{ fontSize: 11, color: "#3a3328", lineHeight: 1.6, marginTop: 2 }}>
                <strong>Department:</strong> {p.dept}<br/>
                <strong>Related Object:</strong> <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>{p.obj}</a><br/>
                <strong>Color:</strong> {p.color} &nbsp;·&nbsp; <strong>Item #:</strong> <span style={{ fontFamily: "Courier New, monospace" }}>{p.sku}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 12, fontStyle: "italic", color: "#1a1a1a" }}>{p.desc}</div>
              {p.note && <div style={{ marginTop: 6, fontSize: 11, color: "#a33", fontFamily: "Georgia, serif", fontStyle: "italic", borderLeft: "2px solid #a33", paddingLeft: 8 }}>↪ {p.note}</div>}
              <div style={{ marginTop: 8, fontSize: 10, color: "#8a8270" }}>
                <a href="#" onClick={(e)=>{e.preventDefault(); onOpen(p);}} style={linkStyle}>View File</a> ·{" "}
                <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Related Clipping</a> ·{" "}
                <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Related Object</a> ·{" "}
                Views: <strong>{p.views}</strong>
              </div>
            </td>
            <td style={{...td, textAlign: "right", fontFamily: "Verdana, sans-serif"}}>
              <div style={{ fontSize: 18, fontWeight: "bold", color: "#1a1a1a" }}>${p.price.toFixed(2)}</div>
            </td>
            <td style={td}>
              <OrderForm p={p} onAdd={onAdd} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============= ORDER FORM (per-row) =============
function OrderForm({ p, onAdd }) {
  const [size, setSize] = useStateRk(p.sizes?.[Math.floor(p.sizes.length / 2)] || "");
  const [qty, setQty] = useStateRk(1);
  return (
    <div style={{ fontSize: 11, lineHeight: 1.6 }}>
      <label style={{ display: "block" }}>Size: <select value={size} onChange={e => setSize(e.target.value)} style={selectStyle}>{(p.sizes || []).map(s => <option key={s}>{s}</option>)}</select></label>
      <label style={{ display: "block", marginTop: 4 }}>Qty: <input type="number" min="1" max="9" value={qty} onChange={e => setQty(parseInt(e.target.value)||1)} style={{ width: 36, border: "1px solid #8a8270", padding: "1px 3px", fontFamily: "Verdana, sans-serif", fontSize: 11 }} /></label>
      <button onClick={() => onAdd(p)} style={{ ...btn3D, marginTop: 8, width: "100%" }}>Add to Cart</button>
      <div style={{ marginTop: 4, fontSize: 9, color: "#8a8270", fontFamily: "Courier New, monospace" }}>Ships in 5–9 days. Or whenever.</div>
    </div>
  );
}

// ============= REMOVED TABLE =============
function RemovedTable({ rows }) {
  if (!rows.length) return null;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #8a8270", background: "#fffef8", fontSize: 12 }}>
      <thead>
        <tr style={{ background: "#d8d2c4", borderBottom: "2px solid #8a8270" }}>
          <th style={th}>Item</th>
          <th style={th}>Last Seen</th>
          <th style={{...th, width: 110, textAlign: "right"}}>Requests</th>
          <th style={{...th, width: 200}}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p, i) => (
          <tr key={p.sku} style={{ borderBottom: "1px solid #c4bdac", background: i % 2 ? "#faf7ec" : "#fffef8", verticalAlign: "top" }}>
            <td style={td}>
              <Thumb sku={p.sku} name={p.name} dimmed />
              <div style={{ fontSize: 13, fontWeight: "bold", marginTop: 4 }}>{p.name}</div>
              <div style={{ fontSize: 10, fontFamily: "Courier New, monospace", color: "#8a8270" }}>{p.sku}</div>
              <div style={{ marginTop: 4, color: "#a33", fontSize: 11, fontWeight: "bold" }}>● REMOVED FROM RACK</div>
            </td>
            <td style={td}>
              <div style={{ fontSize: 11 }}><strong>Last Seen:</strong> {p.lastSeen}</div>
              <div style={{ fontSize: 11, marginTop: 2, fontStyle: "italic", color: "#5a4a35" }}>{p.desc}</div>
            </td>
            <td style={{...td, textAlign: "right", fontSize: 18, fontWeight: "bold", color: "#a33"}}>{p.requests}</td>
            <td style={td}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <button style={btn3D}>File Request</button>
                <a href="#" onClick={(e)=>e.preventDefault()} style={{...linkStyle, fontSize: 11 }}>View Sighting</a>
                <a href="#" onClick={(e)=>e.preventDefault()} style={{...linkStyle, fontSize: 11 }}>Open Incident Report</a>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============= REDACTED TABLE =============
function RedactedTable({ rows, go }) {
  if (!rows.length) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, border: "1px solid #8a8270", background: "#fffef8", padding: 8 }}>
      {rows.map(p => (
        <div key={p.sku} style={{ border: "1px dashed #1a1a1a", padding: 10, background: "#faf7ec", display: "flex", gap: 10 }}>
          <div style={{ width: 80, height: 80, background: "#1a1a1a", flexShrink: 0, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, #1a1a1a 0 4px, #2a2a2a 4px 8px)" }}></div>
            <div style={{ position: "absolute", inset: "30%", background: "#000" }}></div>
          </div>
          <div style={{ flex: 1, fontSize: 11 }}>
            <div style={{ fontFamily: "Courier New, monospace", fontWeight: "bold", color: "#1a1a1a", letterSpacing: "0.05em" }}>{p.name}</div>
            <div style={{ marginTop: 3, color: RK_STATUS[p.status].c, fontWeight: "bold" }}>● {RK_STATUS[p.status].label}</div>
            <div style={{ fontSize: 10, color: "#5a4a35", marginTop: 3, lineHeight: 1.5 }}>
              <strong>Item #:</strong> {p.sku}<br/>
              <strong>Department:</strong> {p.dept}<br/>
              <strong>Related Object:</strong> {p.obj}
            </div>
            <div style={{ fontSize: 11, marginTop: 4, fontStyle: "italic" }}>{p.desc}</div>
            <div style={{ marginTop: 6, fontSize: 11 }}>
              <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Open File</a> ·{" "}
              <a href="#" onClick={(e)=>{e.preventDefault(); go("clockout");}} style={linkStyle}>Clock Out</a> ·{" "}
              <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Notify Me</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============= BUILD YOUR SHIFT FORM =============
function ShiftBuilder({ onView }) {
  const [light, setLight] = useStateRk("Fluorescent");
  const [loc, setLoc] = useStateRk("Lot");
  const [aff, setAff] = useStateRk("Wall Clock");
  const [cond, setCond] = useStateRk("Awake");
  const [result, setResult] = useStateRk(null);

  const submit = (e) => {
    e.preventDefault();
    const map = {
      "Fluorescent": "BR-UDL-003",
      "Bar Neon": "BR-COT-001",
      "Lot Sodium": "BR-IDH-004",
      "Motel Lamp": "BR-NSH-006",
    };
    const sku = map[light] || "BR-COT-001";
    const item = RK_ROWS.find(r => r.sku === sku);
    setResult({
      shift: loc === "Lot" ? "Lot Hours" : loc === "Bar" ? "Night Shift" : loc === "Motel" ? "Cold Lots, Bad Coffee" : "Fluorescent Operations",
      item, obj: aff,
      rule: aff === "Fuzzy Dice" ? "Don't leave before the engine cools." : aff === "Wall Clock" ? "Compliance is observation in a polite shirt." : aff === "Swan Feather" ? "Don't ask where she went." : "Read the rules where people can see them.",
    });
  };

  return (
    <>
      <SectionHead id="shift-builder" title="Build Your Shift" intro="Use the form below to receive a recommended issue." />
      <div style={{ border: "1px solid #8a8270", background: "#fffef8", padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <form onSubmit={submit} style={{ fontSize: 12 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <FormRow label="Preferred Light"><select value={light} onChange={e=>setLight(e.target.value)} style={selectStyle}><option>Fluorescent</option><option>Bar Neon</option><option>Lot Sodium</option><option>Motel Lamp</option></select></FormRow>
            <FormRow label="Preferred Location"><select value={loc} onChange={e=>setLoc(e.target.value)} style={selectStyle}><option>Lot</option><option>Bar</option><option>Room</option><option>Motel</option></select></FormRow>
            <FormRow label="Object Affinity"><select value={aff} onChange={e=>setAff(e.target.value)} style={selectStyle}><option>Wall Clock</option><option>Fuzzy Dice</option><option>Swan Feather</option><option>Matchbook</option><option>Coffee Mug</option></select></FormRow>
            <FormRow label="Current Condition"><select value={cond} onChange={e=>setCond(e.target.value)} style={selectStyle}><option>Awake</option><option>Tired</option><option>Suspended</option><option>Off the books</option></select></FormRow>
          </div>
          <button type="submit" style={{...btn3D, marginTop: 12}}>Submit</button>
        </form>
        <div style={{ border: "1px solid #c4bdac", background: "#faf7ec", padding: 14, fontSize: 12, lineHeight: 1.7 }}>
          {result ? (
            <>
              <div style={{ fontFamily: "Courier New, monospace", fontSize: 10, color: "#5a4a35", letterSpacing: "0.1em", marginBottom: 6 }}>RESULT — RECOMMENDED ISSUE</div>
              <div><strong>Recommended Shift:</strong> {result.shift}</div>
              <div><strong>Issued Item:</strong> <a href="#" onClick={(e)=>{e.preventDefault(); onView(result.item);}} style={linkStyle}>{result.item.name}</a></div>
              <div><strong>Department:</strong> {result.item.dept}</div>
              <div><strong>Related Object:</strong> {result.obj}</div>
              <div style={{ marginTop: 6, fontStyle: "italic", color: "#a33" }}>Room Rule: {result.rule}</div>
              <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                <button style={btn3D} onClick={() => onView(result.item)}>View Item</button>
                <button style={btn3D}>Add to Cart</button>
              </div>
            </>
          ) : (
            <div style={{ color: "#8a8270", fontStyle: "italic", fontFamily: "Georgia, serif" }}>Submit the form to receive a recommended issue.</div>
          )}
        </div>
      </div>
    </>
  );
}

function FormRow({ label, children }) {
  return (
    <label style={{ display: "grid", gridTemplateColumns: "150px 1fr", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 11, color: "#3a3328" }}>{label}:</span>
      {children}
    </label>
  );
}

// ============= PRODUCT FILE MODAL =============
function ProductFile({ p, onClose, onAdd, go }) {
  const isAvail = p.status === "AVAILABLE";
  const [size, setSize] = useStateRk(p.sizes?.[1] || p.sizes?.[0] || "");
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9500, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 30, overflow: "auto" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background: "#fffef8", border: "2px solid #1a1a1a", boxShadow: "6px 6px 0 rgba(0,0,0,0.3)", width: "min(880px, 100%)", fontFamily: "Verdana, Arial, sans-serif", fontSize: 12, color: "#1a1a1a" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(180deg, #d8d2c4 0%, #c4bdac 100%)", borderBottom: "1px solid #8a8270", padding: "5px 12px", fontSize: 11, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#3a3328" }}>SleeperNet {">"}  The Rack {">"} <strong>{p.name}</strong></span>
          <button onClick={onClose} style={{ ...btn3D, fontSize: 10, padding: "1px 8px" }}>[X] Close</button>
        </div>

        {/* Title row */}
        <div style={{ padding: "12px 18px 0" }}>
          <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 26, fontWeight: "normal", margin: 0 }}>{p.name}</h2>
          <div style={{ fontSize: 10, fontFamily: "Courier New, monospace", color: "#5a4a35", marginTop: 2 }}>Item #: {p.sku} · Views: {p.views || "—"} · Last updated: 01:47 AM</div>
        </div>

        {/* Two-column body */}
        <div style={{ padding: 18, display: "grid", gridTemplateColumns: "300px 1fr", gap: 22 }}>
          <div>
            <div style={{ border: "1px solid #8a8270", background: "#faf7ec", padding: 6 }}>
              <Thumb sku={p.sku} name={p.name} large />
              <div style={{ textAlign: "center", marginTop: 4, fontSize: 10, color: "#1f4cc4", textDecoration: "underline" }}>click image for larger view</div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <Thumb sku={p.sku} name={p.name} small alt="2" />
              <Thumb sku={p.sku} name={p.name} small alt="3" />
              <Thumb sku={p.sku} name={p.name} small alt="evidence" evidence />
            </div>
            <div style={{ marginTop: 6, fontSize: 9, fontFamily: "Courier New, monospace", color: "#8a8270" }}>3 images · 1 room evidence shot</div>
          </div>

          <div>
            <div style={{ fontSize: 22, fontWeight: "bold", color: "#1a1a1a" }}>{p.price ? `$${p.price.toFixed(2)}` : "—"}</div>
            <div style={{ marginTop: 4, color: RK_STATUS[p.status].c, fontWeight: "bold", fontSize: 13 }}>● {RK_STATUS[p.status].label}</div>

            {isAvail && (
              <div style={{ marginTop: 12, border: "1px solid #c4bdac", background: "#faf7ec", padding: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 10px", alignItems: "center", fontSize: 11 }}>
                  <span>Size:</span><select value={size} onChange={e=>setSize(e.target.value)} style={selectStyle}>{p.sizes.map(s => <option key={s}>{s}</option>)}</select>
                  <span>Quantity:</span><input type="number" min="1" max="9" defaultValue="1" style={{ width: 50, border: "1px solid #8a8270", padding: "1px 3px", fontFamily: "Verdana, sans-serif", fontSize: 11 }} />
                </div>
                <button onClick={onAdd} style={{...btn3D, marginTop: 10, width: "100%", fontWeight: "bold", padding: "5px 12px"}}>Add to Cart</button>
                <div style={{ fontSize: 10, color: "#5a4a35", marginTop: 4 }}>Ships in 5–9 days. Availability subject to room conditions.</div>
              </div>
            )}

            {!isAvail && (
              <div style={{ marginTop: 12, border: "1px dashed #a33", background: "#faf0f0", padding: 10, fontSize: 11 }}>
                <strong>This item is not available for issue.</strong>
                <div style={{ marginTop: 4, fontStyle: "italic", color: "#5a4a35" }}>{p.desc}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button style={btn3D}>Notify Me</button>
                  <button style={btn3D}>File Request</button>
                  {p.status === "CLOCK_OUT" && <button style={btn3D} onClick={() => { onClose(); go("clockout"); }}>Clock Out</button>}
                </div>
              </div>
            )}

            {/* Metadata table */}
            <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse", fontSize: 11 }}>
              <tbody>
                <MetaRow k="Department" v={p.dept} />
                <MetaRow k="Issued For" v={p.desc} />
                <MetaRow k="Related Object" v={<a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>{p.obj}</a>} />
                {p.color && <MetaRow k="Color" v={p.color} />}
                <MetaRow k="Found Location" v="Room table, after close." />
                <MetaRow k="Related Clipping" v={<a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Coffee Freshness Could Not Be Verified</a>} />
              </tbody>
            </table>

            {/* Description */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: "bold", borderBottom: "1px solid #c4bdac", paddingBottom: 2 }}>Product Description</div>
              <p style={{ margin: "6px 0", fontSize: 12, lineHeight: 1.6 }}>{p.desc}</p>
              {p.note && <p style={{ margin: "6px 0", fontSize: 12, lineHeight: 1.6, fontStyle: "italic", color: "#a33", fontFamily: "Georgia, serif" }}>↪ {p.note}</p>}
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: "bold", borderBottom: "1px solid #c4bdac", paddingBottom: 2 }}>Related Room Note</div>
              <p style={{ margin: "6px 0", fontSize: 12, lineHeight: 1.6, fontStyle: "italic", color: "#3a3328" }}>"You wear it home. You don't wear it back."</p>
            </div>
          </div>
        </div>

        {/* Footer of file */}
        <div style={{ borderTop: "1px solid #c4bdac", background: "#ebe5d4", padding: "6px 14px", fontSize: 10, fontFamily: "Courier New, monospace", color: "#5a4a35", display: "flex", justifyContent: "space-between" }}>
          <span><a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Email this file</a> · <a href="#" onClick={(e)=>e.preventDefault()} style={linkStyle}>Printer friendly version</a></span>
          <span>Availability subject to room conditions.</span>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ k, v }) {
  return (
    <tr>
      <td style={{ padding: "3px 8px 3px 0", color: "#5a4a35", width: 120, verticalAlign: "top", borderBottom: "1px dotted #c4bdac" }}>{k}:</td>
      <td style={{ padding: "3px 0", borderBottom: "1px dotted #c4bdac" }}>{v}</td>
    </tr>
  );
}

// ============= THUMBNAIL (placeholder catalog image) =============
function Thumb({ sku, name, dimmed, large, small, alt, evidence }) {
  const size = large ? 280 : small ? 60 : 130;
  const bg = evidence ? "repeating-linear-gradient(60deg, #2a2622 0 4px, #1a1714 4px 8px)" : "repeating-linear-gradient(45deg, #d8d2c4 0 8px, #c4bdac 8px 16px)";
  return (
    <div style={{
      width: size, height: size, background: bg, border: "1px solid #8a8270",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Courier New, monospace", fontSize: large ? 11 : 9,
      color: evidence ? "#9a8c70" : "#5a4a35", letterSpacing: "0.1em",
      filter: dimmed ? "grayscale(1) opacity(0.5)" : "none",
      textAlign: "center", padding: 6, boxSizing: "border-box",
      margin: "0 auto",
    }}>
      [{evidence ? "EVIDENCE · " : ""}{sku}]
    </div>
  );
}

// ============= FILTER DROPDOWN =============
function FilterDD({ label, value, options, onChange }) {
  return (
    <label style={{ display: "block", fontSize: 11 }}>
      <div style={{ color: "#3a3328", marginBottom: 2 }}>{label}:</div>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ ...selectStyle, width: "100%" }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

// ============= STYLES =============
const linkStyle = { color: "#1f4cc4", textDecoration: "underline" };
const btn3D = {
  fontFamily: "Tahoma, Verdana, Arial, sans-serif", fontSize: 11,
  padding: "3px 10px", background: "linear-gradient(180deg, #fffef8 0%, #d8d2c4 100%)",
  border: "1px solid #8a8270", borderTopColor: "#fffef8", borderLeftColor: "#fffef8",
  borderRightColor: "#5a4a35", borderBottomColor: "#5a4a35",
  color: "#1a1a1a", cursor: "pointer", boxShadow: "1px 1px 0 rgba(0,0,0,0.15)",
};
const selectStyle = {
  fontFamily: "Verdana, Arial, sans-serif", fontSize: 11, padding: "1px 2px",
  border: "1px solid #8a8270", background: "#fffef8", color: "#1a1a1a",
};
const th = { padding: "5px 8px", textAlign: "left", fontSize: 11, fontFamily: "Tahoma, sans-serif", color: "#3a3328", borderRight: "1px solid #8a8270" };
const td = { padding: "10px 10px", borderRight: "1px solid #c4bdac", verticalAlign: "top" };
const emptyBox = { border: "1px solid #8a8270", padding: 30, textAlign: "center", color: "#8a8270", fontStyle: "italic", fontFamily: "Georgia, serif", background: "#fffef8" };

window.TheRack = TheRack;
