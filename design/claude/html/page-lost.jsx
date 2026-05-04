// LOST & FOUND v2 — 2003 web archive × bar lost-and-found drawer × motel evidence box.
// "Somebody left it. The room kept it."

const { useState: useStateLF, useMemo: useMemoLF } = React;

// ============= INVENTORY =============
const LF_ITEMS = [
  // PHYSICAL
  { id: "LF-0008", name: "Motel Key No. 8", type: "Physical", status: "Unclaimed", found: "Under bad lighting", reality: "Breakroom Myth", product: "Night Shift Hoodie", desc: "Plastic tag. Room number 8. Warm when recovered.", meaning: "Access without belonging.", note: "The key opens something. Nobody agrees what.", unlock: "Room 8 File" },
  { id: "LF-0147", name: "Swan Feather", type: "Physical", status: "Under Review", found: "Passenger seat", reality: "Unverified", product: "Idle Hands Tee", desc: "Cleanest thing in the car. Suspicious for that reason.", meaning: "She was here. She is not here now.", note: "Held by no one. Returned by no one.", unlock: "Phone: Miss September" },
  { id: "LF-0021", name: "Fuzzy Dice (red)", type: "Physical", status: "Found", found: "Hanging. Always hanging.", reality: "Brand Object", product: "Idle Hands Tee", desc: "Static-charged. Faded on one side from sun.", meaning: "Luck assigned, not earned.", note: "Don't take. They're how the room knows what time it is." },
  { id: "LF-0002", name: "Cue Chalk (½ block, blue)", type: "Physical", status: "Claimed", found: "Tray at the felt table", reality: "Brand Object", product: "Clock Out Tee", desc: "Damp at the corner. Familiar.", meaning: "Aim is a kind of hope." },
  { id: "LF-0063", name: "Coffee Mug (chipped)", type: "Physical", status: "Found", found: "Counter, four hours unattended", reality: "Brand Object", product: "Clock Out Tee", desc: "Active. Heat without source.", meaning: "Still hot, still working.", note: "Do not consume, photograph, or thank it." },
  { id: "LF-0041", name: "Matchbook (Stay Late Lounge)", type: "Physical", status: "Unclaimed", found: "Coat pocket. Wrong coat.", reality: "Breakroom Myth", product: "Stay Late Cap", desc: "Three matches left. Three more reasons.", meaning: "Three more reasons.", unlock: "Lounge address" },
  { id: "LF-0001", name: "Wall Clock (stuck 1:47)", type: "Physical", status: "Displayed", found: "Above the door", reality: "Brand Object", product: "Under Bad Lights Tee", desc: "Glass intact. Hands honest.", meaning: "Time we agreed on.", note: "Management calls this cultural." },
  { id: "LF-0055", name: "Timing Slip", type: "Physical", status: "Found", found: "Inside motel Bible", reality: "Unverified", product: "Idle Hands Tee", desc: "Pencil-marked. Quarter mile, never scheduled.", meaning: "Evidence inconclusive. Evidence preserved anyway.", unlock: "The Lot map" },
  { id: "LF-0037", name: "Receipt (no total)", type: "Physical", status: "Found", found: "Folded into a matchbook", reality: "Fictional", product: "Night Shift Hoodie", desc: "Coffee-ringed. Subtotal: legible. Total: gone.", meaning: "Proof that the night happened." },
  { id: "LF-0088", name: "Hotline Poster", type: "Physical", status: "Found", found: "Tacked over the payphone", reality: "Fictional", desc: "Faded. Numbers unreadable.", meaning: "Help, theoretical." },
  { id: "LF-0203", name: "Olive Sword (red, used)", type: "Physical", status: "Found", found: "Ashtray, back booth", reality: "Fictional", desc: "Plastic. Slightly bent. Olive missing.", meaning: "Garnish without occasion." },
  { id: "LF-0312", name: "Cracked Sunglasses", type: "Physical", status: "Missing Again", found: "Booth three", reality: "Fictional", desc: "One lens hairline. Frame: drugstore.", meaning: "Worn indoors. On purpose." },

  // DIGITAL
  { id: "LF-D003", name: "Deleted Search History", type: "Digital", status: "Redacted", found: "SleeperNet cache", reality: "Fictional", desc: "Searches include \"how to quit a job I never applied for\" and \"swan passenger seat legal.\"", meaning: "The system remembers what the user pretended to forget.", unlock: "Staff Only teaser" },
  { id: "LF-D007", name: "Employee File X-0147", type: "Digital", status: "Found", found: "Portal cache", reality: "Brand Object", desc: "Department field reads only: \"the room.\"", meaning: "Filed without consent." },
  { id: "LF-D012", name: "OmniShift Memo Draft", type: "Digital", status: "Under Review", found: "Outbox, never sent", reality: "Fictional", desc: "Subject line: \"Please disregard the swan.\" Body: empty.", meaning: "Some memos were never going to leave." },
  { id: "LF-D018", name: "Screenshot of Unsent Message", type: "Digital", status: "Found", found: "Phone, 1:13 a.m.", reality: "Fictional", desc: "Two words drafted, deleted, redrafted. The exact words are smudged.", meaning: "The message that did not leave." },
  { id: "LF-D044", name: "Broken QR Code", type: "Digital", status: "Found", found: "Bar coaster, back of", reality: "Fictional", desc: "Resolves to a 404 page that contains a phone number.", meaning: "Wrong link. Right outcome.", unlock: "Phone: Unknown Caller" },
  { id: "LF-D061", name: "AI-Generated Performance Review", type: "Digital", status: "Found", found: "Portal cache", reality: "Brand Object", desc: "Concludes: \"Continue existing in the room until further notice.\"", meaning: "Praise indistinguishable from observation." },

  // CULTURAL
  { id: "LF-C002", name: "Old Craigslist Posting", type: "Cultural", status: "Out of Context", found: "Cache, 2004", reality: "Out of Context", desc: "\"Will trade hoodie for ride out of town. Hoodie smells like a good story.\"", meaning: "Some posts age well." },
  { id: "LF-C014", name: "Drag Strip Time Slip", type: "Cultural", status: "Found", found: "Glovebox", reality: "Unverified", desc: "Time crossed out in pen. Replaced with: \"good enough.\"", meaning: "Speed corrected by hand.", unlock: "The Lot secret page" },
  { id: "LF-C022", name: "Bowling League Patch", type: "Cultural", status: "Claimed", found: "Donated by an unknown employee", reality: "Out of Context", desc: "Team name: NIGHT AUDIT. League: dissolved 1989.", meaning: "Membership without record." },
  { id: "LF-C031", name: "Dive Bar Koozie", type: "Cultural", status: "Found", found: "Back booth, slightly damp", reality: "Out of Context", desc: "Logo from a bar that has been three different bars.", meaning: "The room outlived its names." },
  { id: "LF-C047", name: "Bootleg Concert Flyer", type: "Cultural", status: "Found", found: "Telephone pole, peeled off", reality: "Out of Context", desc: "Show date is on a Tuesday in February. Year omitted.", meaning: "Always upcoming." },
  { id: "LF-C053", name: "Mall Photo Booth Strip", type: "Cultural", status: "Missing Again", found: "Wallet sleeve", reality: "Fictional", desc: "Four frames. Two faces. The third frame is the back of a head.", meaning: "Group photo, partial company." },

  // ROOM MYTHS
  { id: "LF-M001", name: "The Back Booth Napkin", type: "Room Myth", status: "Held", found: "Booth four", reality: "Breakroom Myth", desc: "Folded into a triangle. Lipstick mark, no name.", meaning: "Saved seat for someone never named.", unlock: "Back Booth" },
  { id: "LF-M008", name: "The Driver's Glove (left)", type: "Room Myth", status: "Unclaimed", found: "Lot, near the speed bump", reality: "Breakroom Myth", desc: "Leather. Right palm shiny. Left glove only.", meaning: "Always one missing." },
  { id: "LF-M021", name: "The Wrong Room Key", type: "Room Myth", status: "Held", found: "Bar, slid across", reality: "Breakroom Myth", desc: "Tag reads Room 9. There is no Room 9.", meaning: "Door opens. Just not here." },
  { id: "LF-M033", name: "The Lowrider Air Freshener", type: "Room Myth", status: "Found", found: "Hung from the wall clock", reality: "Breakroom Myth", desc: "Pine scent. Pine not nearby.", meaning: "Smell as alibi." },

  // APPROVED ROOMS
  { id: "AR-ATX-001", name: "Deep Eddy Cabaret", type: "Approved Room", status: "Real / Pending Full File", found: "Austin, TX", reality: "Real", desc: "A candidate Approved Room. Verified public-facts only. Breakroom note clearly separate.", meaning: "Some rooms do not need branding. They already survived.", note: "Verification required before publication." },
  { id: "AR-▓▓▓-002", name: "[CANDIDATE — UNDER REVIEW]", type: "Approved Room", status: "Under Review", found: "▓▓▓▓▓▓▓▓", reality: "Real", desc: "Submission pending personal sign-off.", meaning: "We don't invent facts about real places." },

  // PRODUCT ARTIFACTS
  { id: "LF-P002", name: "Leaked Policy Notice", type: "Product Artifact", status: "For Sale", found: "Employee Resources page", reality: "Brand Object", product: "House Rules Tee", desc: "Policy document changed by someone with better taste.", meaning: "Rules only matter when people can see them." },

  // HISTORICAL REPRINTS
  { id: "LF-H011", name: "Newspaper Clipping (clock)", type: "Historical Reprint", status: "Archived", found: "Frame, behind the bar", reality: "Out of Context", desc: "Headline: ROOM CLOCK STILL WRONG, MANAGEMENT CALLS IT CULTURAL.", meaning: "Cultural is the new functional." },
  { id: "LF-H022", name: "Hot Dog Public Notice", type: "Historical Reprint", status: "Archived", found: "Counter, 7-Eleven", reality: "Out of Context", desc: "\"Been on there too long.\" — local clerk", meaning: "Truth older than menu." },
];

const LF_TYPES = ["All","Physical","Digital","Cultural","Room Myth","Approved Room","Product Artifact","Historical Reprint"];
const LF_STATUSES = ["All","Found","Unclaimed","Claimed","Held","Under Review","Redacted","Missing Again","Archived","Displayed","For Sale","Real / Pending Full File","Out of Context"];
const LF_REALITY = ["All","Real","Fictional","Breakroom Myth","Unverified","Out of Context","Brand Object"];
const LF_LOCS = ["All","The Room","The Lot","Motel","Bodega","7-Eleven","Back Bar","Employee Portal","Newsstand","Staff Only","Unknown"];

const realityColor = (r) => ({
  "Real": "#1a5a35", "Fictional": "#5a4a35", "Breakroom Myth": "#a33",
  "Unverified": "#a07000", "Out of Context": "#1f4cc4", "Brand Object": "#1a1a1a",
}[r] || "#5a4a35");

// ============= PAGE =============
function LostFound({ go, employee }) {
  const [filters, setFilters] = useStateLF({ q: "", type: "All", status: "All", reality: "All", loc: "All" });
  const [open, setOpen] = useStateLF(null);
  const [saved, setSaved] = useStateLF(() => {
    try { return JSON.parse(localStorage.getItem("lf_saved") || "[]"); } catch(e) { return []; }
  });

  // Listen to site mode changes
  const [siteMode, setSiteMode] = useStateLF(() => document.documentElement.getAttribute("data-site-mode") || "3AM");
  React.useEffect(() => {
    const obs = new MutationObserver(() => setSiteMode(document.documentElement.getAttribute("data-site-mode") || "3AM"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-site-mode"] });
    return () => obs.disconnect();
  }, []);

  // DAY mode: only Brand Object + Approved Room are visible. Everything else is "pending review."
  // CLOSED mode: nothing returns. archive is dark.
  const baseItems = useMemoLF(() => {
    if (siteMode === "DAY") return LF_ITEMS.filter(o => o.reality === "Brand Object" || o.reality === "Real");
    if (siteMode === "CLOSED") return [];
    return LF_ITEMS;
  }, [siteMode]);

  const filtered = useMemoLF(() => {
    return baseItems.filter(o => {
      if (filters.type !== "All" && o.type !== filters.type) return false;
      if (filters.status !== "All" && o.status !== filters.status) return false;
      if (filters.reality !== "All" && o.reality !== filters.reality) return false;
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (!(o.name + " " + o.desc + " " + (o.meaning||"")).toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filters, baseItems]);

  const groupBy = (key) => filtered.reduce((m, o) => ((m[o[key]] = m[o[key]] || []).push(o), m), {});
  const byType = groupBy("type");
  const sectionOrder = ["Physical","Digital","Cultural","Room Myth","Approved Room","Product Artifact","Historical Reprint"];

  const toggleSave = (id) => {
    const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
    setSaved(next);
    localStorage.setItem("lf_saved", JSON.stringify(next));
  };

  // Unlocks — each is a real interactive payoff
  const [openUnlock, setOpenUnlock] = useStateLF(null);  // id of the unlock currently being read
  const physCount = saved.filter(id => LF_ITEMS.find(o => o.id === id)?.type === "Physical").length;
  const unlocks = useMemoLF(() => {
    const u = [];
    if (physCount >= 3) u.push({ id: "back-booth", label: "Back Booth Note" });
    if (saved.includes("LF-0008") && saved.includes("LF-0001")) u.push({ id: "room-8-file", label: "Room 8 File" });
    if (saved.includes("LF-0147")) u.push({ id: "miss-september", label: "Phone: Miss September", action: "phone" });
    if (saved.includes("LF-D003")) u.push({ id: "staff-teaser", label: "Staff Code Hint" });
    if (saved.includes("LF-0055")) u.push({ id: "the-lot", label: "The Lot Page" });
    return u;
  }, [saved, physCount]);

  return (
    <div data-section="lost-2003" style={{ minHeight: "calc(100vh - 28px)", background: "#f4f1e8", fontFamily: "Verdana, Arial, sans-serif", fontSize: 12, color: "#1a1a1a", paddingBottom: 60 }}>

      {/* Top utility */}
      <div style={{ background: "linear-gradient(180deg, #d8d2c4 0%, #c4bdac 100%)", borderBottom: "1px solid #8a8270", padding: "4px 14px", display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "Tahoma, sans-serif" }}>
        <span style={{ color: "#3a3328" }}>
          <a href="#" onClick={(e)=>{e.preventDefault(); go("search");}} style={lflink}>SleeperNet</a>{" > "}
          <a href="#" onClick={(e)=>{e.preventDefault(); go("breakroom");}} style={lflink}>The Breakroom</a>{" > "}
          <strong>Lost &amp; Found</strong>
        </span>
        <span style={{ display: "flex", gap: 14 }}>
          <a href="#" onClick={(e)=>e.preventDefault()} style={lflink}>Sign In</a>
          {employee && <a href="#" onClick={(e)=>{e.preventDefault(); go("portal");}} style={lflink}>Employee File</a>}
          <a href="#" onClick={(e)=>{e.preventDefault(); go("rack");}} style={lflink}>The Rack</a>
          <a href="#" onClick={(e)=>{e.preventDefault(); go("clockout");}} style={{...lflink, color: "#a33", fontWeight: "bold"}}>Clock Out</a>
        </span>
      </div>

      {/* Status strip */}
      <div style={{ background: "#ebe5d4", borderBottom: "1px solid #c4bdac", padding: "5px 14px", fontSize: 10, fontFamily: "Courier New, monospace", color: "#3a3328", display: "flex", gap: 18, flexWrap: "wrap" }}>
        <span><strong>Archive Status:</strong> {siteMode === "CLOSED" ? <span style={{color:"#a33"}}>Sealed</span> : siteMode === "DAY" ? <span style={{color:"#1a5a35"}}>Open · Approved Items Only</span> : <span style={{color:"#1a5a35"}}>Open</span>}</span>
        <span><strong>Items Recovered:</strong> {baseItems.length}{siteMode === "DAY" && <span style={{color:"#a33"}}> / {LF_ITEMS.length} (others pending review)</span>}</span>
        <span><strong>Claimed:</strong> unclear</span>
        <span><strong>In Your File:</strong> {saved.length}</span>
        <span><strong>OmniShift Approval:</strong> <span style={{color:"#a33"}}>Denied</span></span>
        <span><strong>Last Updated:</strong> 1:47 AM</span>
        <span style={{marginLeft:"auto", color:"#a33", fontStyle:"italic", fontFamily:"Georgia, serif", fontSize:11}}>↪ Don't take anything you can't explain later.</span>
      </div>

      <div style={{ maxWidth: 1040, margin: "20px auto 0", padding: "0 14px" }}>

        {/* Title block */}
        <div style={{ border: "2px solid #1a1a1a", borderTopWidth: 4, background: "#fffef8", padding: "18px 22px", boxShadow: "3px 3px 0 #d8d2c4" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 20, alignItems: "start" }}>
            <div>
              <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 38, fontWeight: "normal", margin: 0, letterSpacing: "0.02em" }}>LOST &amp; FOUND</h1>
              <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "#5a4a35", fontSize: 16, marginTop: 2 }}>Somebody left it. The room kept it.</div>
              <hr style={{ border: 0, borderTop: "1px solid #c4bdac", margin: "10px 0" }} />
              <p style={{ margin: "0 0 6px", lineHeight: 1.55 }}>Recovered objects, digital artifacts, bar myths, old clippings, product sightings, and things nobody wants to claim in writing.</p>
              <p style={{ margin: 0, lineHeight: 1.55, color: "#3a3328" }}>Some items are real. Some are not. Some are available for purchase. <strong>Some unlock doors.</strong></p>
              <div style={{ marginTop: 12, display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12 }}>
                <a href="#physical" style={lflink}>Browse Objects</a><span style={{color:"#888"}}>|</span>
                <a href="#digital" style={lflink}>View Digital Artifacts</a><span style={{color:"#888"}}>|</span>
                <a href="#search" style={lflink}>Search the Drawer</a><span style={{color:"#888"}}>|</span>
                <a href="#approved" style={lflink}>Approved Rooms</a>
              </div>
            </div>
            {/* Drawer pile illustration */}
            <div style={{ background: "repeating-linear-gradient(45deg, #d8d2c4 0 6px, #c4bdac 6px 12px)", border: "1px solid #8a8270", padding: 8, position: "relative", height: 150 }}>
              <div style={{ position: "absolute", top: 8, right: 10, background: "#a33", color: "white", fontFamily: "Courier New, monospace", fontSize: 10, padding: "2px 6px", letterSpacing: "0.1em", transform: "rotate(6deg)", boxShadow: "1px 1px 0 rgba(0,0,0,0.3)" }}>FOUND</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, height: "100%" }}>
                {["key","feather","dice","chalk","mug","match","clock","slip"].map((k, i) => (
                  <div key={i} style={{ background: "#1a1a1a", border: "1px solid #fffef8", color: "#9a8c70", fontFamily: "Courier New, monospace", fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "0.1em" }}>[{k}]</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Saved unlocks bar */}
        {(saved.length > 0 || unlocks.length > 0) && (
          <div style={{ marginTop: 12, border: "1px solid #1a5a35", background: "#e7eee5", padding: "8px 12px", fontSize: 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <span><strong style={{color:"#1a5a35"}}>◆ YOUR FILE:</strong> {saved.length} saved · {unlocks.length} unlock{unlocks.length===1?"":"s"}.</span>
              <span style={{ fontStyle: "italic", color: "#5a4a35" }}>
                {unlocks.length === 0 && "Save 3 Physical Objects to unlock the Back Booth Note."}
                {unlocks.length > 0 && unlocks.length < 5 && `Keep saving. ${5 - unlocks.length} more unlock${5-unlocks.length===1?"":"s"} possible.`}
                {unlocks.length === 5 && "All unlocks earned. Don't tell anyone."}
              </span>
            </div>
            {unlocks.length > 0 && (
              <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {unlocks.map(u => (
                  <button
                    key={u.id}
                    onClick={() => u.action === "phone" ? go("phone") : setOpenUnlock(u.id)}
                    style={{
                      all: "unset", cursor: "pointer",
                      background: "#fffef8", border: "1px solid #1a5a35",
                      padding: "3px 8px", fontFamily: "Courier New, monospace",
                      fontSize: 10, letterSpacing: "0.08em", color: "#1a5a35",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#1a5a35"; e.currentTarget.style.color = "#fffef8"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fffef8"; e.currentTarget.style.color = "#1a5a35"; }}
                  >▸ {u.label}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {openUnlock && <UnlockReveal id={openUnlock} onClose={() => setOpenUnlock(null)} go={go} />}

        {/* Search the Drawer */}
        <div id="search" style={{ marginTop: 18, border: "1px solid #8a8270", background: "#ebe5d4", padding: "10px 14px" }}>
          <div style={{ fontFamily: "Tahoma, sans-serif", fontSize: 11, fontWeight: "bold", letterSpacing: "0.05em", color: "#3a3328", marginBottom: 8 }}>SEARCH THE DRAWER</div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(4, 1fr)", gap: 8 }}>
            <label style={{ display: "block", fontSize: 11 }}>
              <div style={{ color: "#3a3328", marginBottom: 2 }}>Keyword:</div>
              <input value={filters.q} onChange={e => setFilters(f=>({...f, q:e.target.value}))} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #8a8270", padding: "2px 4px", fontFamily: "Verdana, sans-serif", fontSize: 11 }} placeholder="key, swan, hoodie, 1:47…" />
            </label>
            <LFDD label="Object Type" value={filters.type} options={LF_TYPES} onChange={v=>setFilters(f=>({...f, type:v}))} />
            <LFDD label="Status" value={filters.status} options={LF_STATUSES} onChange={v=>setFilters(f=>({...f, status:v}))} />
            <LFDD label="Reality" value={filters.reality} options={LF_REALITY} onChange={v=>setFilters(f=>({...f, reality:v}))} />
            <LFDD label="Found Location" value={filters.loc} options={LF_LOCS} onChange={v=>setFilters(f=>({...f, loc:v}))} />
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
            <button style={lfbtn}>Search Lost Items</button>
            <a href="#" onClick={(e)=>{e.preventDefault(); setFilters({q:"", type:"All", status:"All", reality:"All", loc:"All"});}} style={lflink}>Reset Drawer</a>
            <span style={{ marginLeft: "auto", color: "#5a4a35", fontSize: 11 }}>Showing <strong>{filtered.length}</strong> of {baseItems.length} items</span>
          </div>
        </div>

        {/* Recently Found strip */}
        <div style={{ marginTop: 18 }}>
          <div style={{ background: "#1a1a1a", color: "#fffef8", padding: "5px 12px", fontFamily: "Georgia, serif", fontSize: 16 }}>Recently Found</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, padding: 8, background: "#fffef8", border: "1px solid #8a8270", borderTop: "none" }}>
            {LF_ITEMS.slice(0, 5).filter(o => baseItems.includes(o)).map(o => <ObjectCard key={o.id} o={o} compact onOpen={setOpen} saved={saved.includes(o.id)} onToggleSave={toggleSave} />)}
          </div>
        </div>

        {/* Sections by type */}
        {sectionOrder.map(t => {
          const rows = byType[t];
          if (!rows || !rows.length) return null;
          const id = t.toLowerCase().replace(/\s+/g, "-");
          return (
            <div key={t} id={id} style={{ marginTop: 22 }}>
              <div style={{ background: "#1a1a1a", color: "#fffef8", padding: "6px 12px", fontFamily: "Georgia, serif", fontSize: 18 }}>{t}{t === "Approved Room" ? "s" : t === "Physical" || t === "Digital" || t === "Cultural" ? " Objects" : ""}</div>
              <div style={{ background: "#ebe5d4", padding: "5px 12px", fontSize: 11, color: "#3a3328", borderLeft: "1px solid #8a8270", borderRight: "1px solid #8a8270", borderBottom: "1px solid #8a8270", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                {{
                  "Physical": "Things found in rooms, lots, cars, motels, bars.",
                  "Digital": "Things found inside the system.",
                  "Cultural": "Recognizable, real-world-adjacent artifacts. Out of context, on purpose.",
                  "Room Myth": "Objects attached to stories. Verification: refused.",
                  "Approved Room": "Real places. Verified public facts only. Breakroom note kept separate.",
                  "Product Artifact": "Objects that lead to merchandise.",
                  "Historical Reprint": "Old clippings. Cited where possible. Otherwise marked."
                }[t]}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: t === "Approved Room" ? "1fr" : "repeat(auto-fill, minmax(240px, 1fr))", gap: 8, padding: 8, background: "#fffef8", border: "1px solid #8a8270", borderTop: "none" }}>
                {rows.map(o => t === "Approved Room"
                  ? <ApprovedRoomRow key={o.id} o={o} />
                  : <ObjectCard key={o.id} o={o} onOpen={setOpen} saved={saved.includes(o.id)} onToggleSave={toggleSave} />
                )}
              </div>
            </div>
          );
        })}

        {/* Missing Again */}
        <div style={{ marginTop: 22 }}>
          <div style={{ background: "#1a1a1a", color: "#fffef8", padding: "6px 12px", fontFamily: "Georgia, serif", fontSize: 18 }}>Missing Again</div>
          <div style={{ background: "#fffef8", border: "1px solid #8a8270", borderTop: "none", padding: 12, fontSize: 12, lineHeight: 1.7 }}>
            {LF_ITEMS.filter(o => o.status === "Missing Again" && baseItems.includes(o)).map(o => (
              <div key={o.id} style={{ borderBottom: "1px dotted #c4bdac", padding: "4px 0" }}>
                <a href="#" onClick={(e)=>{e.preventDefault(); setOpen(o);}} style={lflink}><strong>{o.name}</strong></a>
                <span style={{ color: "#5a4a35" }}> · {o.id} · last seen {o.found.toLowerCase()} · </span>
                <span style={{ color: realityColor(o.reality), fontWeight: "bold" }}>{o.reality}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, fontStyle: "italic", color: "#a33", fontFamily: "Georgia, serif" }}>Claim denied. Object recognized you first.</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 26, padding: "16px 0", borderTop: "1px solid #c4bdac", fontSize: 11, color: "#5a4a35", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span>
            <a href="#top" style={lflink}>Back to top</a> ·{" "}
            <a href="#" onClick={(e)=>e.preventDefault()} style={lflink}>Printer friendly version</a> ·{" "}
            <a href="#" onClick={(e)=>e.preventDefault()} style={lflink}>Email this drawer</a> ·{" "}
            <a href="#" onClick={(e)=>{e.preventDefault(); go("staff");}} style={{...lflink, color:"#8a8270"}}>·</a>
          </span>
          <span style={{ fontStyle: "italic", fontFamily: "Georgia, serif" }}>The room remembers objects better than people.</span>
        </div>
      </div>

      {open && <ObjectFile o={open} onClose={() => setOpen(null)} go={go} saved={saved.includes(open.id)} onToggleSave={() => toggleSave(open.id)} />}
    </div>
  );
}

// ============= OBJECT CARD =============
function ObjectCard({ o, onOpen, compact, saved, onToggleSave }) {
  return (
    <div style={{ border: "1px solid #c4bdac", background: "#faf7ec", padding: 8, position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ width: "100%", aspectRatio: "1.2 / 1", background: o.type === "Digital" ? "linear-gradient(180deg, #1a5a35 0%, #0d2818 100%)" : "repeating-linear-gradient(45deg, #d8d2c4 0 6px, #c4bdac 6px 12px)", border: "1px solid #8a8270", display: "flex", alignItems: "center", justifyContent: "center", color: o.type === "Digital" ? "#7fff7f" : "#5a4a35", fontFamily: "Courier New, monospace", fontSize: 9, letterSpacing: "0.12em", textAlign: "center", padding: 4, position: "relative" }}>
        [{o.id}]
        {o.status === "Found" && <div style={{ position: "absolute", top: 4, right: 4, background: "#a33", color: "white", fontSize: 8, padding: "1px 4px", letterSpacing: "0.1em", transform: "rotate(6deg)", fontFamily: "Courier New, monospace" }}>FOUND</div>}
        {o.status === "Redacted" && <div style={{ position: "absolute", inset: "30%", background: "#000" }}></div>}
      </div>
      <div style={{ marginTop: 6 }}>
        <a href="#" onClick={(e)=>{e.preventDefault(); onOpen(o);}} style={{ color: "#1f4cc4", textDecoration: "underline", fontSize: 13, fontWeight: "bold" }}>{o.name}</a>
        <div style={{ fontSize: 10, fontFamily: "Courier New, monospace", color: "#5a4a35", marginTop: 2 }}>{o.id} · {o.status}</div>
        {!compact && (
          <div style={{ fontSize: 10, color: "#3a3328", lineHeight: 1.5, marginTop: 4 }}>
            <strong>Found:</strong> {o.found}<br/>
            <strong>Reality:</strong> <span style={{ color: realityColor(o.reality), fontWeight: "bold" }}>{o.reality}</span>
            {o.product && <><br/><strong>Product:</strong> <span style={{color:"#1f4cc4"}}>{o.product}</span></>}
          </div>
        )}
        <div style={{ fontSize: 11, marginTop: 6, fontStyle: "italic", color: "#1a1a1a", lineHeight: 1.4 }}>{o.desc}</div>
      </div>
      <div style={{ marginTop: "auto", paddingTop: 8, fontSize: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
        <a href="#" onClick={(e)=>{e.preventDefault(); onOpen(o);}} style={lflink}>View File</a>
        <span style={{color:"#888"}}>·</span>
        <a href="#" onClick={(e)=>{e.preventDefault(); onToggleSave(o.id);}} style={{...lflink, color: saved ? "#1a5a35" : "#1f4cc4"}}>{saved ? "✓ Saved" : "Save to File"}</a>
        {o.unlock && <><span style={{color:"#888"}}>·</span><a href="#" onClick={(e)=>e.preventDefault()} style={{...lflink, color:"#a33"}}>Open Clue</a></>}
      </div>
    </div>
  );
}

// ============= APPROVED ROOM ROW =============
function ApprovedRoomRow({ o }) {
  const verified = o.reality === "Real" && !o.name.includes("CANDIDATE");
  return (
    <div style={{ border: "1px solid " + (verified ? "#1a5a35" : "#c4bdac"), background: verified ? "#faf7ec" : "repeating-linear-gradient(45deg, #faf7ec 0 6px, #ebe5d4 6px 12px)", padding: 12, display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 14 }}>
      <div>
        <div style={{ fontSize: 10, fontFamily: "Courier New, monospace", color: verified ? "#1a5a35" : "#8a8270", letterSpacing: "0.1em" }}>{verified ? "● APPROVED ROOM" : "○ CANDIDATE · UNDER REVIEW"}</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: verified ? "#1a1a1a" : "#5a4a35", marginTop: 2 }}>{o.name}</div>
        <div style={{ fontSize: 11, fontFamily: "Courier New, monospace", color: "#5a4a35", marginTop: 2 }}>{o.id} · {o.found}</div>
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.5 }}>
        <div style={{ fontSize: 10, color: "#5a4a35", letterSpacing: "0.1em" }}>VERIFIED NOTES</div>
        <div style={{ marginTop: 2 }}>{o.desc}</div>
        <div style={{ fontSize: 10, color: "#5a4a35", letterSpacing: "0.1em", marginTop: 8 }}>BREAKROOM NOTE</div>
        <div style={{ marginTop: 2, fontFamily: "Georgia, serif", fontStyle: "italic" }}>{o.meaning}</div>
      </div>
      <div style={{ fontSize: 10, color: "#5a4a35", display: "flex", flexDirection: "column", gap: 6 }}>
        <button style={lfbtn}>View Room File</button>
        <a href="#" onClick={(e)=>e.preventDefault()} style={lflink}>Related Myth</a>
        {o.note && <div style={{ fontStyle: "italic", color: "#a33", fontFamily: "Georgia, serif" }}>↪ {o.note}</div>}
      </div>
    </div>
  );
}

// ============= OBJECT FILE MODAL =============
function ObjectFile({ o, onClose, go, saved, onToggleSave }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9500, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 30, overflow: "auto" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background: "#fffef8", border: "2px solid #1a1a1a", boxShadow: "6px 6px 0 rgba(0,0,0,0.3)", width: "min(820px, 100%)", fontFamily: "Verdana, sans-serif", fontSize: 12, color: "#1a1a1a" }}>

        <div style={{ background: "linear-gradient(180deg, #d8d2c4 0%, #c4bdac 100%)", borderBottom: "1px solid #8a8270", padding: "5px 12px", fontSize: 11, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#3a3328" }}>SleeperNet {">"} The Breakroom {">"} Lost &amp; Found {">"} <strong>{o.name}</strong></span>
          <button onClick={onClose} style={{...lfbtn, fontSize: 10, padding: "1px 8px"}}>[X] Close</button>
        </div>

        <div style={{ padding: "14px 22px 0" }}>
          <div style={{ fontSize: 10, fontFamily: "Courier New, monospace", color: "#5a4a35", letterSpacing: "0.1em" }}>LOST &amp; FOUND FILE</div>
          <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 30, fontWeight: "normal", margin: "2px 0 0" }}>{o.name}</h2>
        </div>

        <div style={{ padding: 22, display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 }}>
          <div>
            <div style={{ width: "100%", aspectRatio: "1 / 1", background: o.type === "Digital" ? "linear-gradient(180deg, #1a5a35 0%, #0d2818 100%)" : "repeating-linear-gradient(45deg, #d8d2c4 0 8px, #c4bdac 8px 16px)", border: "1px solid #8a8270", display: "flex", alignItems: "center", justifyContent: "center", color: o.type === "Digital" ? "#7fff7f" : "#5a4a35", fontFamily: "Courier New, monospace", fontSize: 11, letterSpacing: "0.12em", padding: 6, textAlign: "center", position: "relative" }}>
              [{o.id} · {o.name.toLowerCase()}]
              <div style={{ position: "absolute", top: 8, right: 8, background: "#a33", color: "white", fontSize: 11, fontFamily: "Courier New, monospace", padding: "2px 8px", letterSpacing: "0.15em", transform: "rotate(7deg)", boxShadow: "1px 1px 0 rgba(0,0,0,0.3)" }}>{o.status === "Redacted" ? "REDACTED" : o.status === "Claimed" ? "CLAIMED" : "FOUND"}</div>
            </div>
            <div style={{ textAlign: "center", marginTop: 4, fontSize: 10, color: "#1f4cc4", textDecoration: "underline" }}>click image for larger view</div>
          </div>
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <tbody>
                <LFMeta k="Item #" v={<span style={{ fontFamily: "Courier New, monospace" }}>{o.id}</span>} />
                <LFMeta k="Type" v={o.type} />
                <LFMeta k="Status" v={o.status} />
                <LFMeta k="Found Location" v={o.found} />
                <LFMeta k="Reality Status" v={<span style={{ color: realityColor(o.reality), fontWeight: "bold" }}>{o.reality}</span>} />
                {o.product && <LFMeta k="Related Product" v={<a href="#" style={lflink}>{o.product}</a>} />}
                {o.unlock && <LFMeta k="Unlock Clue" v={<span style={{color:"#a33"}}>{o.unlock}</span>} />}
                <LFMeta k="First Logged" v="1:47 AM" />
                <LFMeta k="Last Updated" v="Never correctly" />
              </tbody>
            </table>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: "bold", borderBottom: "1px solid #c4bdac", paddingBottom: 2 }}>Description</div>
              <p style={{ margin: "6px 0", lineHeight: 1.6 }}>{o.desc}</p>
            </div>

            {o.meaning && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: "bold", borderBottom: "1px solid #c4bdac", paddingBottom: 2 }}>Meaning</div>
                <p style={{ margin: "6px 0", lineHeight: 1.6, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 14 }}>{o.meaning}</p>
              </div>
            )}

            {o.note && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: "bold", borderBottom: "1px solid #c4bdac", paddingBottom: 2 }}>Room Note</div>
                <p style={{ margin: "6px 0", lineHeight: 1.6, color: "#a33", fontFamily: "Georgia, serif", fontStyle: "italic" }}>↪ {o.note}</p>
              </div>
            )}

            <div style={{ marginTop: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button style={lfbtn} onClick={onToggleSave}>{saved ? "✓ Saved to File" : "Save to File"}</button>
              {o.product && <button style={lfbtn} onClick={() => { onClose(); go("rack"); }}>Open Related Product</button>}
              {o.unlock && <button style={{...lfbtn, color: "#a33"}}>Open Clue</button>}
              <button style={lfbtn}>Claim Item</button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #c4bdac", background: "#ebe5d4", padding: "6px 14px", fontSize: 10, fontFamily: "Courier New, monospace", color: "#5a4a35", display: "flex", justifyContent: "space-between" }}>
          <span><a href="#" onClick={(e)=>e.preventDefault()} style={lflink}>Email this file</a> · <a href="#" onClick={(e)=>e.preventDefault()} style={lflink}>Printer friendly</a></span>
          <span>The room remembers objects better than people.</span>
        </div>
      </div>
    </div>
  );
}

// ============= UTILITIES =============
function LFMeta({ k, v }) {
  return (
    <tr>
      <td style={{ padding: "3px 8px 3px 0", color: "#5a4a35", width: 130, verticalAlign: "top", borderBottom: "1px dotted #c4bdac" }}>{k}:</td>
      <td style={{ padding: "3px 0", borderBottom: "1px dotted #c4bdac" }}>{v}</td>
    </tr>
  );
}

function LFDD({ label, value, options, onChange }) {
  return (
    <label style={{ display: "block", fontSize: 11 }}>
      <div style={{ color: "#3a3328", marginBottom: 2 }}>{label}:</div>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", boxSizing: "border-box", fontFamily: "Verdana, sans-serif", fontSize: 11, padding: "1px 2px", border: "1px solid #8a8270", background: "#fffef8" }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

const lflink = { color: "#1f4cc4", textDecoration: "underline" };
const lfbtn = {
  fontFamily: "Tahoma, Verdana, Arial, sans-serif", fontSize: 11,
  padding: "3px 10px", background: "linear-gradient(180deg, #fffef8 0%, #d8d2c4 100%)",
  border: "1px solid #8a8270", borderTopColor: "#fffef8", borderLeftColor: "#fffef8",
  borderRightColor: "#5a4a35", borderBottomColor: "#5a4a35",
  color: "#1a1a1a", cursor: "pointer", boxShadow: "1px 1px 0 rgba(0,0,0,0.15)",
};

window.LostFound = LostFound;

// ============= UNLOCK REVEALS =============
// The five secret payoffs. Each is a real document, not a teaser.
function UnlockReveal({ id, onClose, go }) {
  const C = UNLOCK_CONTENT[id];
  if (!C) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", zIndex: 9600, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 30, overflow: "auto" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background: C.bg || "#fffef8", color: C.fg || "#1a1a1a", border: "2px solid #1a1a1a", boxShadow: "6px 6px 0 rgba(0,0,0,0.3)", width: "min(680px, 100%)", fontFamily: C.font || "Courier New, monospace", padding: 0 }}>
        <div style={{ background: "#1a1a1a", color: "#fffef8", padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "Courier New, monospace", fontSize: 11, letterSpacing: "0.15em" }}>
          <span>◆ {C.title}</span>
          <button onClick={onClose} style={{ all: "unset", cursor: "pointer", padding: "0 6px" }}>×</button>
        </div>
        <div style={{ padding: "20px 26px", fontSize: 13, lineHeight: 1.7 }}>
          {C.body}
        </div>
        <div style={{ background: "#ebe5d4", padding: "6px 14px", fontFamily: "Courier New, monospace", fontSize: 10, color: "#5a4a35", letterSpacing: "0.1em", display: "flex", justifyContent: "space-between" }}>
          <span>{C.footer || "FILED · LOST & FOUND · DO NOT SHARE"}</span>
          <button onClick={onClose} style={{ all: "unset", cursor: "pointer", color: "#1a1a1a" }}>[ close ]</button>
        </div>
      </div>
    </div>
  );
}

const UNLOCK_CONTENT = {
  "back-booth": {
    title: "BACK BOOTH NOTE · UNFOLDED",
    bg: "#f4ead8",
    font: "'Caveat', Georgia, cursive",
    body: (
      <div style={{ fontSize: 22, lineHeight: 1.4, color: "#3a2818" }}>
        <p style={{ margin: "0 0 14px" }}>If you found this you sat in the right booth.</p>
        <p style={{ margin: "0 0 14px" }}>The clock is right twice a day. We checked. It happens at <strong>1:47</strong>, both times.</p>
        <p style={{ margin: "0 0 14px" }}>Don't take the key. The room is not for sleeping in.</p>
        <p style={{ margin: 0, textAlign: "right", fontStyle: "italic", fontSize: 18 }}>— management (the real kind)</p>
      </div>
    ),
    footer: "OBJECT LF-M001 · BACK BOOTH NAPKIN · UNFOLDED ONCE",
  },
  "room-8-file": {
    title: "ROOM 8 · MAINTENANCE LOG",
    bg: "#fffef8",
    font: "Courier New, monospace",
    body: (
      <div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ borderBottom: "2px solid #1a1a1a" }}><th style={{ textAlign: "left", padding: "4px 6px" }}>DATE</th><th style={{ textAlign: "left", padding: "4px 6px" }}>ENTRY</th><th style={{ textAlign: "left", padding: "4px 6px" }}>BY</th></tr></thead>
          <tbody>
            <tr style={{ borderBottom: "1px dotted #c4bdac" }}><td style={{ padding: "6px" }}>—</td><td style={{ padding: "6px" }}>Clock above door reads 1:47. Adjusted.</td><td style={{ padding: "6px" }}>R.</td></tr>
            <tr style={{ borderBottom: "1px dotted #c4bdac" }}><td style={{ padding: "6px" }}>—</td><td style={{ padding: "6px" }}>Clock reads 1:47 again. Adjusted again.</td><td style={{ padding: "6px" }}>R.</td></tr>
            <tr style={{ borderBottom: "1px dotted #c4bdac" }}><td style={{ padding: "6px" }}>—</td><td style={{ padding: "6px" }}>Clock returned to 1:47 on its own. Stopped adjusting.</td><td style={{ padding: "6px" }}>R.</td></tr>
            <tr style={{ borderBottom: "1px dotted #c4bdac" }}><td style={{ padding: "6px" }}>—</td><td style={{ padding: "6px" }}>Key left in tray. Not by guest. Not by us.</td><td style={{ padding: "6px" }}>—</td></tr>
            <tr style={{ borderBottom: "1px dotted #c4bdac" }}><td style={{ padding: "6px" }}>—</td><td style={{ padding: "6px" }}>Lights on a timer. Timer disagrees with clock. Both are correct.</td><td style={{ padding: "6px" }}>R.</td></tr>
            <tr><td style={{ padding: "6px" }}>—</td><td style={{ padding: "6px", color: "#a33", fontStyle: "italic" }}>Stopped logging. The room is fine.</td><td style={{ padding: "6px" }}>—</td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: 14, fontSize: 11, fontStyle: "italic", color: "#5a4a35" }}>R. signed every entry. We don't know who R. is. Nobody on staff has the initial.</div>
      </div>
    ),
    footer: "ROOM 8 · MAINTENANCE LOG · NEVER REQUESTED · NEVER PURGED",
  },
  "staff-teaser": {
    title: "DELETED SEARCH HISTORY · RECOVERED",
    bg: "#0a0908",
    fg: "#33ff66",
    font: "VT323, Courier New, monospace",
    body: (
      <div style={{ fontSize: 18, lineHeight: 1.5 }}>
        <div style={{ opacity: 0.6 }}>&gt; recovered from cache · do not redistribute</div>
        <div style={{ marginTop: 16 }}>&gt; how to quit a job i never applied for</div>
        <div>&gt; is the wall clock cursed or stuck</div>
        <div>&gt; "applause money" tax form</div>
        <div>&gt; staff only door code "<span style={{ background: "rgba(51,255,102,0.2)", padding: "0 4px" }}>1:47</span>" "<span style={{ background: "rgba(51,255,102,0.2)", padding: "0 4px" }}>chalk up</span>" "<span style={{ background: "rgba(51,255,102,0.2)", padding: "0 4px" }}>swan</span>"</div>
        <div>&gt; what does the swan want</div>
        <div>&gt; how to leave without going home</div>
        <div style={{ marginTop: 16, opacity: 0.6 }}>&gt; cache cleared. five times. it keeps coming back.</div>
      </div>
    ),
    footer: "LF-D003 · DO NOT REDISTRIBUTE · YOU FOUND THIS",
  },
  "the-lot": {
    title: "THE LOT · NIGHT MAP",
    bg: "#1a1714",
    fg: "#f4ead8",
    font: "Courier New, monospace",
    body: (
      <div style={{ fontSize: 13, lineHeight: 1.7 }}>
        <pre style={{ margin: 0, fontFamily: "inherit", color: "#ffaa6b", whiteSpace: "pre-wrap" }}>{`
   ┌─────────────────────────────────┐
   │   [bodega]              [pole]  │
   │                                 │
   │      ░lowrider░       (the spot │
   │      ░idling░         is here)  │
   │                                 │
   │   ── speed bump ── ── crack ──  │
   │                                 │
   │  [phone booth]    [the door]    │
   └─────────────────────────────────┘
`}</pre>
        <div style={{ marginTop: 10, fontStyle: "italic" }}>The driver parks adjacent to everything. He never parks. The radio is on something we can't tune to. The passenger seat is empty most nights and full some nights.</div>
        <div style={{ marginTop: 10 }}>If you walk past the lot at <strong style={{color:"#ffaa6b"}}>1:47 AM</strong> and the radio gets louder, keep walking.</div>
      </div>
    ),
    footer: "TIMING SLIP LF-0055 · LOT MAP · UNVERIFIED",
  },
};

window.LostFound = LostFound;
