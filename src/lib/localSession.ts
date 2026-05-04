export const LOCAL_PROFILE_KEY = 'breakroom.omnishift.profile';
export const LOCAL_SHIFT_KEY = 'breakroom.omnishift.shift';
export const LOCAL_AFTER_HOURS_KEY = 'breakroom.afterhours.profile';

export type LocalShiftStatus = 'on_shift' | 'clocked_out' | 'still_out';

export type LocalEmployeeProfile = {
  email: string;
  alias?: string;
  employee_id: string;
  department: string;
  role_name: string;
  assigned_object_slug: string;
  house_rule: string;
  uniform_recommendation_slug: string;
  preferred_light?: string;
  preferred_place?: string;
  shift_status: LocalShiftStatus;
  clocked_out_at?: string;
};

export function loadLocalProfile(): LocalEmployeeProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(LOCAL_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalEmployeeProfile;
  } catch {
    return null;
  }
}

export function saveLocalProfile(profile: LocalEmployeeProfile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
  window.localStorage.setItem(LOCAL_SHIFT_KEY, profile.shift_status);
}

export function markLocalClockedOut() {
  if (typeof window === 'undefined') return;
  const profile = loadLocalProfile();
  const clockedOutAt = new Date().toISOString();
  if (profile) {
    saveLocalProfile({ ...profile, shift_status: 'clocked_out', clocked_out_at: clockedOutAt });
  } else {
    window.localStorage.setItem(LOCAL_SHIFT_KEY, 'clocked_out');
  }
}

export function isLocalClockedOut() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(LOCAL_SHIFT_KEY) === 'clocked_out' || loadLocalProfile()?.shift_status === 'clocked_out';
}
