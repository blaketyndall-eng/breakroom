/**
 * RadioPlayer — renders inside the .r147-winamp chrome (defined in
 * radio-redesign.css). Component supplies LED readout + iframe slot;
 * visual chrome is owned by CSS so the player can drop into any tree.
 *
 * Fallback copy reads as period-correct radio downtime instead of dev
 * placeholder when no stream URL is configured.
 */
export default function RadioPlayer() {
  const stream =
    import.meta.env.PUBLIC_BREAKROOM_RADIO_STREAM_URL ||
    import.meta.env.PUBLIC_LIVE365_PLAYER_EMBED_URL;

  return (
    <div className="r147-winamp">
      <div className="r147-winamp-titlebar">
        <span>BREAKROOM RADIO — CHANNEL 1:47</span>
        <span className="r147-winamp-controls">_ □ ×</span>
      </div>
      <div className="r147-winamp-body">
        <div className="r147-winamp-led">
          <div className="r147-winamp-led-row">
            <span>NOW PLAYING</span>
            <span>147MHz</span>
          </div>
          <div className="r147-winamp-led-row">
            <span>Lot Weather → Compliance Hour</span>
            <span>STEREO</span>
          </div>
        </div>

        <div className="r147-winamp-bars" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="r147-winamp-bar" />
          ))}
        </div>

        {stream ? (
          <iframe
            src={stream}
            title="Breakroom Radio"
            className="r147-winamp-iframe"
          />
        ) : (
          <div className="r147-winamp-fallback" aria-label="dead air, tone test, carrier wave">
            <span className="r147-winamp-fallback-text">
              DEAD AIR · TONE TEST · CARRIER WAVE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
