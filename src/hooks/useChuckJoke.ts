import { useCallback, useEffect, useRef, useState } from 'react';
import type { CategoryId } from '../lib/categories';

interface ApiResponse {
  value: string;
  icon_url?: string;
  url?: string;
}

interface State {
  joke: string;
  isLoading: boolean;
  error: string | null;
  /** Monotonically increasing — useful to retrigger reveal animations. */
  ticket: number;
}

const ENDPOINT = 'https://api.chucknorris.io/jokes/random';

export function useChuckJoke(category: CategoryId) {
  const [state, setState] = useState<State>({
    joke: '',
    isLoading: true,
    error: null,
    ticket: 0,
  });
  const abortRef = useRef<AbortController | null>(null);
  const ticketRef = useRef(0);

  const fetchJoke = useCallback(async (cat: CategoryId) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((s) => ({ ...s, isLoading: true, error: null }));

    const url = cat === 'random' ? ENDPOINT : `${ENDPOINT}?category=${cat}`;
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as ApiResponse;
      ticketRef.current += 1;
      setState({
        joke: data.value,
        isLoading: false,
        error: null,
        ticket: ticketRef.current,
      });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      ticketRef.current += 1;
      setState({
        joke: '',
        isLoading: false,
        error: (err as Error).message ?? 'Signal lost.',
        ticket: ticketRef.current,
      });
    }
  }, []);

  useEffect(() => {
    void fetchJoke(category);
    return () => abortRef.current?.abort();
  }, [category, fetchJoke]);

  const refresh = useCallback(() => {
    void fetchJoke(category);
  }, [category, fetchJoke]);

  return { ...state, refresh };
}
