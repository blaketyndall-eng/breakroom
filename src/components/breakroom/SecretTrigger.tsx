import { useEffect, useState } from 'react';
import { unlockByTrigger } from '@/lib/secrets';
import type { UnlockResult } from '@/lib/secrets';

export default function SecretTrigger({ trigger, path, label = 'room memory' }: { trigger: string; path: string; label?: string }) {
  const [status, setStatus] = useState('checking');
  const [receipt, setReceipt] = useState<UnlockResult | null>(null);

  useEffect(() => {
    let ignore = false;

    async function run() {
      const result = await unlockByTrigger(trigger, path, { label });
      if (ignore) return;
      setStatus(result?.artifact ? `filed: ${result.artifact.title}` : 'no file');
      if (result?.artifact && !result.alreadyUnlocked) {
        setReceipt(result);
        window.setTimeout(() => setReceipt(null), 5200);
      }
    }

    run();

    return () => {
      ignore = true;
    };
  }, [trigger, path, label]);

  const artifact = receipt?.comboArtifact ?? receipt?.artifact;

  return (
    <>
      <span className="secret-trigger-status">{status}</span>
      {artifact && (
        <aside className="artifact-toast" role="status">
          <p className="artifact-toast-kicker">NEW FILE PRINTED</p>
          <h2>{artifact.title}</h2>
          <p>{artifact.description}</p>
          <p className="artifact-toast-meta">Evidence drawer count: {receipt?.artifactCount ?? 0}</p>
          <a href="/artifacts">Open drawer</a>
        </aside>
      )}
    </>
  );
}
