const aliases = ['Nun Dog', 'House Money', 'Motel 8', 'Coffee Regular', 'The Rail', 'Bad Light Blake', 'Chalk Witness', 'Missed Connection'];
const lights = ['pool lamp green', 'motel blue', 'dashboard green', 'beer-sign red', 'fluorescent bad white'];
const objects = ['Motel Key No. 8', 'Swan Feather', 'Timing Slip', 'Fuzzy Dice', 'Coffee Mug'];

export function generateAfterHoursPersona(seed = 'guest') {
  const n = Math.abs(hash(seed));
  return {
    playerAlias: aliases[n % aliases.length],
    fakeHandicap: (n % 7) + 2,
    preferredLight: lights[(n >> 2) % lights.length],
    signatureObject: objects[(n >> 3) % objects.length],
    assignedTable: `Table ${((n >> 4) % 8) + 1}`,
    afterHoursStatus: 'still out',
    regularNote: 'Shows up late enough to be trusted. Do not lend them chalk.'
  };
}

function hash(value: string) { return value.split('').reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0); }
