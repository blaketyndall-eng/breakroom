export type ArtifactDefinition = {
  slug: string;
  title: string;
  artifactType: string;
  description: string;
  stamp: string;
  source: string;
};

export const ARTIFACTS: ArtifactDefinition[] = [
  {
    slug: 'after-hours-badge',
    title: 'After Hours Badge',
    artifactType: 'badge',
    description: 'Issued after the supervisor connection went dark. Slightly warm. Not recognized by management.',
    stamp: 'CLOCKED OUT',
    source: '/after-hours',
  },
  {
    slug: 'dial-tone-slip',
    title: 'Dial Tone Slip',
    artifactType: 'transmission_slip',
    description: 'A receipt from a phone nobody owns. The bottom line is all static.',
    stamp: 'MISSED CALL',
    source: '/phone',
  },
  {
    slug: 'radio-147-station-id',
    title: 'Radio 1:47 Station ID',
    artifactType: 'radio_log',
    description: 'Dead air with your fingerprints on it. Filed between weather and apology.',
    stamp: 'ON AIR',
    source: '/radio',
  },
  {
    slug: 'bathroom-wall-witness-card',
    title: 'Bathroom Wall Witness Card',
    artifactType: 'wall_card',
    description: 'Wood panel memory. Marker smell not included. The wall claims it saw nothing.',
    stamp: 'WITNESS',
    source: '/sign-the-wall',
  },
  {
    slug: 'pending-marker-receipt',
    title: 'Pending Marker Receipt',
    artifactType: 'receipt',
    description: 'Visible locally. Waiting for the back office to blink.',
    stamp: 'PENDING',
    source: '/sign-the-wall',
  },
  {
    slug: 'object-evidence-card',
    title: 'Object Evidence Card',
    artifactType: 'evidence_card',
    description: 'Filed by the drawer, not by staff. The object may remember you now.',
    stamp: 'HANDLED',
    source: '/lost-found',
  },
  {
    slug: 'issued-goods-request',
    title: 'Issued Goods Request',
    artifactType: 'file_request',
    description: 'Not a cart. Not a sale. A file request that looks like inventory if you squint.',
    stamp: 'FILE ONLY',
    source: '/rack',
  },
];

export function getArtifactBySlug(slug: string) {
  return ARTIFACTS.find((artifact) => artifact.slug === slug) ?? null;
}
