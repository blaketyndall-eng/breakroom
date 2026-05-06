import { useState } from 'react';
import { submitRadioRequest, getRadioRequests } from '@/lib/radio';
import type { RadioRequest } from '@/lib/radio';

export default function RadioRequestForm() {
  const [message, setMessage] = useState('');
  const [handle, setHandle] = useState('');
  const [lastRequest, setLastRequest] = useState<RadioRequest | null>(null);
  const [requests, setRequests] = useState<RadioRequest[]>(() => {
    if (typeof window === 'undefined') return [];
    return getRadioRequests();
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    const req = submitRadioRequest(message.trim(), handle.trim() || undefined);
    setLastRequest(req);
    setMessage('');
    setRequests(getRadioRequests());
  }

  return (
    <div className="radio-request-form-wrapper">
      <form className="radio-request-form" onSubmit={handleSubmit}>
        <p className="radio-request-notice">
          The station does not take requests. It takes evidence and calls it programming.
        </p>
        <label className="radio-request-label">
          <span>Handle (optional)</span>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Anonymous Regular"
            maxLength={40}
          />
        </label>
        <label className="radio-request-label">
          <span>Message / Evidence</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave something on the wire..."
            maxLength={280}
            rows={3}
          />
        </label>
        <button className="old-button" type="submit">Put On The Wire</button>
      </form>

      {lastRequest && (
        <div className={`radio-request-feedback radio-req-${lastRequest.status}`}>
          {lastRequest.status === 'aired' && (
            <p>Your message was aired. The phone behind the bar read it out loud.</p>
          )}
          {lastRequest.status === 'pending' && (
            <p>Message filed. It may or may not be aired. The station does not explain.</p>
          )}
        </div>
      )}

      {requests.length > 0 && (
        <div className="radio-request-history">
          <span className="radio-request-history-label">YOUR SUBMISSIONS</span>
          {requests.slice(0, 5).map((req) => (
            <div key={req.id} className={`radio-request-entry radio-req-${req.status}`}>
              <span className="radio-request-status">{req.status}</span>
              <span className="radio-request-msg">{req.message}</span>
              <span className="radio-request-time">
                {new Date(req.timestamp).toLocaleString(undefined, {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
