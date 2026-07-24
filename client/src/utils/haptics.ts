/**
 * Haptic Feedback Utility using navigator.vibrate
 * Configurable for accessibility and user preference.
 */

const HAPTICS_KEY = 'lami_haptics_enabled';

export function isHapticsSupported(): boolean {
  return typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator;
}

export function isHapticsEnabled(): boolean {
  if (!isHapticsSupported()) return false;
  const saved = localStorage.getItem(HAPTICS_KEY);
  return saved !== 'false'; // default true
}

export function setHapticsEnabled(enabled: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(HAPTICS_KEY, String(enabled));
  }
}

export function triggerHaptic(pattern: number | number[] = 15): void {
  if (isHapticsEnabled()) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration error if blocked by browser policy
    }
  }
}

export function hapticTap(): void {
  triggerHaptic(12);
}

export function hapticSuccess(): void {
  triggerHaptic([15, 30, 25]);
}

export function hapticWarning(): void {
  triggerHaptic([20, 40, 20, 40, 20]);
}

export function hapticSelection(): void {
  triggerHaptic(8);
}
