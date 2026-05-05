import { useEffect, useMemo, useState } from 'react';
import { ARTIFACTS } from '@/lib/artifacts';
import { getLocalArtifactSlugs } from '@/lib/secrets';
import { supabase } from '@/lib/supabaseClient';

type SavedArtifactRow = {
  artifact_slug: string;
};

export default function ArtifactGrid() {
  const [artifactSlugs, setArtifactSlugs] = useState<string[]>([]);
  const [status, setStatus] = useState('Reading local evidence drawer.');

  useEffect(() => {
    let ignore = false;

    async function loadArtifacts() {
      const localSlugs = getLocalArtifactSlugs();
      setArtifactSlugs(localSlugs);

      if (!supabase) {
        setStatus('Local evidence drawer only. Supabase is not configured in this room.');
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) {
        setStatus('Local evidence drawer only. Sign in to carry artifacts between rooms.');
        return;
      }

      const { data, error } = await supabase
        .from('saved_artifacts')
        .select('artifact_slug')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (ignore) return;

      if (error) {
        setStatus('Could not reach saved artifacts. Showing local evidence only.');
        return;
      }

      const remoteSlugs = (data as SavedArtifactRow[] | null)?.map((row) => row.artifact_slug) ?? [];
      setArtifactSlugs(Array.from(new Set([...localSlugs, ...remoteSlugs])));
      setStatus(remoteSlugs.length ? 'Loaded local and saved artifacts.' : 'No saved artifacts yet. The drawer is waiting.');
    }

    loadArtifacts();

    return () => {
      ignore = true;
    };
  }, []);

  const unlocked = useMemo(() => new Set(artifactSlugs), [artifactSlugs]);

  return (
    <div className="old-shell artifact-shell">
      <div className="old-header">Evidence Drawer / Saved Artifacts / Room Memory</div>
      <div className="old-body">
        <p className="memo-box">{status}</p>
        <div className="artifact-grid">
          {ARTIFACTS.map((artifact) => {
            const isUnlocked = unlocked.has(artifact.slug);
            return (
              <article key={artifact.slug} className={`artifact-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                <div className="artifact-photo stripe">
                  <span>{isUnlocked ? artifact.stamp : '██████'}</span>
                </div>
                <p className="artifact-type">{isUnlocked ? artifact.artifactType : 'locked file'}</p>
                <h2>{isUnlocked ? artifact.title : '████████ ████'}</h2>
                <p>{isUnlocked ? artifact.description : 'This artifact has not been filed in your drawer yet.'}</p>
                <p><a href={artifact.source}>{isUnlocked ? 'Return to source' : 'Search related room'}</a></p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
