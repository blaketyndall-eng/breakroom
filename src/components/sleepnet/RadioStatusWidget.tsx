/**
 * Compact radio status widget for the SleepNet portal.
 * Shows current channel status. Links to full /radio page.
 */

export default function RadioStatusWidget() {
  // The radio stream URL comes from environment (if a real stream is configured)
  const streamUrl = import.meta.env.PUBLIC_BREAKROOM_RADIO_STREAM_URL || null;

  return (
    <section className="old-shell radio-status-widget">
      <div className="old-header">Radio 1:47 / Status</div>
      <div className="old-body">
        <p className="radio-status-line">
          {streamUrl ? (
            <>Channel 1:47 — <span className="blink">LIVE</span></>
          ) : (
            <>Channel 1:47 — OFF AIR</>
          )}
        </p>
        <p className="radio-status-meta">
          {streamUrl
            ? 'Stream active. Volume at your own risk.'
            : 'Broadcast scheduled. Check back after hours.'}
        </p>
        <p><a className="old-button" href="/radio">Open Radio</a></p>
      </div>
    </section>
  );
}
