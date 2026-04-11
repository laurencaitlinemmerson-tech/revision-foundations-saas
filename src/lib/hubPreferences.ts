import type { HubBranch } from '@/app/hub/hubTypes';

export const HUB_PREFERENCE_KEY = 'tnl_preferred_branch';

export function getPreferredBranch(): HubBranch | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(HUB_PREFERENCE_KEY);
  return value === 'adult' || value === 'childrens' ? value : null;
}

export function savePreferredBranch(branch: HubBranch) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(HUB_PREFERENCE_KEY, branch);
}
