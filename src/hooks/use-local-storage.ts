import { useEffect, useRef } from 'react'

export const STORAGE_DEBOUNCE_MS = 500

export function readLocalStorage<T>(
  key: string,
  fallback: T,
  guard: (value: unknown) => value is T,
): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) {
      return fallback
    }

    const parsed: unknown = JSON.parse(raw)
    return guard(parsed) ? parsed : fallback
  } catch (error) {
    console.error(error)
    return fallback
  }
}

export function useLocalStorage<T>(key: string, value: T) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error(error)
      }
    }, STORAGE_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [key, value])
}

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay = STORAGE_DEBOUNCE_MS,
) {
  const callbackRef = useRef(callback)
  const timerRef = useRef(0)

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current)
  }, [])

  return (...args: Args) => {
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }
}
