"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
const cache = new Map<string, string | null>();

function read(key: string): string | null {
  if (!cache.has(key)) {
    try {
      cache.set(key, window.localStorage.getItem(key));
    } catch {
      cache.set(key, null);
    }
  }
  return cache.get(key) ?? null;
}

/**
 * Cờ boolean lưu trong localStorage, đọc qua `useSyncExternalStore`.
 * Không dùng `useEffect` + `setState` nên không bị cascading render
 * (React Compiler / eslint-plugin-react-hooks v7 sẽ cảnh báo kiểu đó),
 * và snapshot phía server luôn là `defaultValue` nên hydration khớp.
 */
export function usePersistedFlag(
  key: string,
  defaultValue: boolean,
  enabled = true,
): readonly [boolean, (next: boolean) => void] {
  const subscribe = useCallback((onChange: () => void) => {
    listeners.add(onChange);
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === key) {
        cache.delete(key);
        onChange();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [key]);

  const raw = useSyncExternalStore(
    subscribe,
    () => (enabled ? read(key) : null),
    () => null,
  );

  const set = useCallback(
    (next: boolean) => {
      cache.set(key, next ? "1" : "0");
      if (enabled) {
        try {
          window.localStorage.setItem(key, next ? "1" : "0");
        } catch {
          /* localStorage bị chặn — bỏ qua */
        }
      }
      listeners.forEach((listener) => listener());
    },
    [key, enabled],
  );

  return [raw === null ? defaultValue : raw === "1", set] as const;
}
