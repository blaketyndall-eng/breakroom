import { BREAKROOM_DATA } from '@/content/data/breakroom';

export function generateEmployee(seed = 'guest') {
  const n = Math.abs(hash(seed));
  return {
    id: `OS-${String(n % 9999).padStart(4, '0')}`,
    department: pick(BREAKROOM_DATA.departments, n),
    role: pick(BREAKROOM_DATA.roles, n >> 2),
    shift: pick(BREAKROOM_DATA.shifts, n >> 3),
    uniform: pick(BREAKROOM_DATA.uniforms, n >> 4),
    object: pick(BREAKROOM_DATA.objectsForHire, n >> 5),
    houseRule: pick(BREAKROOM_DATA.houseRules, n >> 6)
  };
}

function pick<T>(arr: T[], n: number): T { return arr[n % arr.length]; }
function hash(value: string) { return value.split('').reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0); }
