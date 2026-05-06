import { useState } from 'react';
import { isWireRoomAuthenticated, authenticateWireRoom } from '@/lib/wireRoom';

type Props = {
  children: React.ReactNode;
};

export default function WireRoomGate({ children }: Props) {
  const [authed, setAuthed] = useState(isWireRoomAuthenticated());
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (authenticateWireRoom(passphrase.trim())) {
      setAuthed(true);
      setError(null);
    } else {
      setError('Passphrase not recognized. Staff denies the URL.');
      setPassphrase('');
    }
  }

  if (authed) {
    return <>{children}</>;
  }

  return (
    <div className="wire-gate">
      <div className="wire-gate-header">WIRE ROOM ACCESS</div>
      <p className="wire-gate-notice">This section requires clearance. If you do not have it, this page does not exist.</p>
      <form className="wire-gate-form" onSubmit={handleSubmit}>
        <label className="wire-gate-label" htmlFor="wire-pass">Passphrase</label>
        <input
          id="wire-pass"
          type="password"
          className="wire-gate-input"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="enter passphrase"
          autoComplete="off"
        />
        <button type="submit" className="old-button">Authenticate</button>
      </form>
      {error && <p className="wire-gate-error">{error}</p>}
    </div>
  );
}
