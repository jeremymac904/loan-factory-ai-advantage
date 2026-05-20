'use client';

import { useSyncExternalStore } from 'react';
import { readDemoRole, type DemoRoleId } from '@/lib/demo-roles';

const SSR_FALLBACK: DemoRoleId = 'team-leader';

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('lfa-role-changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('lfa-role-changed', callback);
    window.removeEventListener('storage', callback);
  };
}

// Cache the snapshot so useSyncExternalStore stays referentially stable —
// reading localStorage on every call would return a fresh string each time.
let cachedRole: DemoRoleId | null = null;

function getSnapshot(): DemoRoleId {
  const fresh = readDemoRole();
  if (cachedRole !== fresh) cachedRole = fresh;
  return cachedRole;
}

function getServerSnapshot(): DemoRoleId {
  return SSR_FALLBACK;
}

/**
 * Reads the active demo role from localStorage and subscribes to changes.
 * Uses useSyncExternalStore — the React-idiomatic way to bridge external
 * state — so it satisfies the react-hooks/set-state-in-effect rule.
 */
export function useDemoRole(): DemoRoleId {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
