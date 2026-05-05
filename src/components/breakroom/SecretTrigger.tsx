import { useEffect, useState } from 'react';
import { unlockByTrigger } from '@/lib/secrets';

export default function SecretTrigger({ trigger, path, label = 'room memory' }: { trigger: string; path: string; label?: string }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let ignore = false;

    async function run() {
      const artifact = await unlockByTrigger(trigger, path, { label });
      if (ignore) return;
      setStatus(artifact ? `filed: ${artifact.title}` : 'no file');
    }

    run();

    return () => {
      ignore = true;
    };
  }, [trigger, path, label]);

  return <span className="secret-trigger-status">{status}</span>;
}
