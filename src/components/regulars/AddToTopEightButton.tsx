import { useState, useEffect } from 'react';
import { isInTopEight, addToTopEight, removeFromTopEight, getTopEight } from '@/lib/topEight';

type Props = {
  handle: string;
  displayName: string;
};

export default function AddToTopEightButton({ handle, displayName }: Props) {
  const [inList, setInList] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setInList(isInTopEight(handle));
  }, [handle]);

  function handleToggle() {
    if (inList) {
      removeFromTopEight(handle);
      setInList(false);
      setMessage('Removed from Top 8.');
    } else {
      const current = getTopEight();
      if (current.length >= 8) {
        setMessage('Top 8 is full. Remove someone first.');
      } else {
        addToTopEight({ handle, displayName });
        setInList(true);
        setMessage('Added to Top 8.');
      }
    }
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="add-top-eight-wrapper">
      <button
        type="button"
        className={`old-button add-top-eight-btn ${inList ? 'in-list' : ''}`}
        onClick={handleToggle}
      >
        {inList ? '★ In Your Top 8' : '+ Add to Top 8'}
      </button>
      {message && <span className="add-top-eight-msg">{message}</span>}
    </div>
  );
}
