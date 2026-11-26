import { useSyncExternalStore } from 'react';
import { getTouchSnapshot, subscribeTouch } from '@/utils/inputMode';

/** True when the visitor is using a touch screen (see utils/inputMode.ts). */
export function useTouchInput(): boolean {
  return useSyncExternalStore(subscribeTouch, getTouchSnapshot, () => false);
}
