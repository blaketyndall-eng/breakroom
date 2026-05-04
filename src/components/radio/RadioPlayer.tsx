export default function RadioPlayer() {
  const stream = import.meta.env.PUBLIC_BREAKROOM_RADIO_STREAM_URL || import.meta.env.PUBLIC_LIVE365_PLAYER_EMBED_URL;
  return (
    <div className="old-shell" style={{ background: '#111', color: '#33ff66' }}>
      <div className="old-header" style={{ background: '#000', color: '#33ff66' }}>BREAKROOM RADIO / CHANNEL 1:47</div>
      <div className="old-body" style={{ fontFamily: 'var(--type-mono)' }}>
        <p>Status: ON AIR / probably</p>
        <p>Signal: cigarette-yellow</p>
        <p>Now Playing: Lot Weather into OmniShift Compliance Hour</p>
        {stream ? <iframe src={stream} title="Breakroom Radio" style={{ width: '100%', minHeight: 140, border: '1px solid #33ff66' }} /> : <div className="stripe" style={{ height: 140 }}>[stream URL pending]</div>}
      </div>
    </div>
  );
}
