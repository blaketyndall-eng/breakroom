import { useEffect } from 'react';
import { recordFactionSignal } from '@/lib/factionDrift';
import type { FactionSignalSource } from '@/lib/factionDrift';

type Props = {
  factionSlug: string;
  source?: FactionSignalSource;
  metadata?: Record<string, unknown>;
};

export default function FactionDriftTracker({ factionSlug, source = 'visit_faction_page', metadata = {} }: Props) {
  useEffect(() => {
    recordFactionSignal({ factionSlug, source, weight: 1, metadata });
  }, [factionSlug, source]);

  return null;
}
