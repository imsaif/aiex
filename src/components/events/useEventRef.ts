'use client';

import { useEffect, useState } from 'react';

/**
 * Which channel brought this visitor: `?ref=linkedin`, `?ref=whatsapp` and so on,
 * one link per channel. Kept for the tab (sessionStorage) so it survives a
 * reload, and removed from the address bar so a re-shared link does not carry
 * someone else's channel. Passed into analytics and onto the Dodo payment as
 * `metadata_ref`, so each booking records where it came from.
 */
const KEY = 'event-ref';
const VALID = /^[a-z0-9-]{1,32}$/;

export function useEventRef(): { ref: string; ready: boolean } {
  const [state, setState] = useState({ ref: '', ready: false });
  useEffect(() => {
    const url = new URL(window.location.href);
    const fromUrl = (url.searchParams.get('ref') ?? '').toLowerCase();
    if (fromUrl) {
      url.searchParams.delete('ref');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
    let value = '';
    try {
      if (VALID.test(fromUrl)) window.sessionStorage.setItem(KEY, fromUrl);
      value = window.sessionStorage.getItem(KEY) ?? '';
    } catch {
      value = VALID.test(fromUrl) ? fromUrl : '';
    }
    setState({ ref: VALID.test(value) ? value : '', ready: true });
  }, []);
  return state;
}
