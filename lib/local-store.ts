"use client";

import { useSyncExternalStore } from "react";

/**
 * Um "store" reativo sobre localStorage, seguro para useSyncExternalStore:
 * o snapshot só é reanalisado quando a string bruta muda, evitando o loop
 * de renderização que JSON.parse a cada chamada causaria (ver Fase 5/6 —
 * OrderConfirmation e TrackingLookup tiveram esse bug antes desta função
 * existir).
 */
export function createLocalStore<T>(key: string, defaultValue: T) {
  type Listener = () => void;
  let listeners: Listener[] = [];
  let cachedRaw: string | null = null;
  let cachedValue: T = defaultValue;

  function notify() {
    for (const listener of listeners) listener();
  }

  function subscribe(listener: Listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function get(): T {
    if (typeof window === "undefined") return defaultValue;
    const raw = window.localStorage.getItem(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedValue = raw ? (JSON.parse(raw) as T) : defaultValue;
      } catch {
        cachedValue = defaultValue;
      }
    }
    return cachedValue;
  }

  function set(value: T) {
    window.localStorage.setItem(key, JSON.stringify(value));
    notify();
  }

  function clear() {
    window.localStorage.removeItem(key);
    notify();
  }

  function useValue(): T {
    return useSyncExternalStore(subscribe, get, () => defaultValue);
  }

  return { get, set, clear, subscribe, useValue };
}
