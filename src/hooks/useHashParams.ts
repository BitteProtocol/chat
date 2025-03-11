import { useEffect, useState } from 'react';

interface HashParamOptions {
  /**
   * If true, hash params will be parsed and state updated
   * whenever the hash changes, not just on mount
   */
  listenToChanges?: boolean;
}

/**
 * A custom hook for parsing and accessing URL hash parameters
 * @param options Configuration options
 * @returns Object containing hash parameters and related utilities
 */
export function useHashParams<T extends Record<string, string>>(
  options: HashParamOptions = {},
): {
  hashParams: T;
  clearHashParams: () => void;
} {
  const { listenToChanges = true } = options;
  const [hashParams, setHashParams] = useState<T>({} as T);

  // Function to parse the hash parameters
  const parseHashParams = () => {
    if (typeof window === 'undefined') return;

    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const entries = Object.fromEntries(params.entries());
      setHashParams(entries as T);
    } else {
      setHashParams({} as T);
    }
  };

  // Clear hash parameters from URL
  const clearHashParams = () => {
    if (typeof window === 'undefined') return;

    window.history.replaceState(
      null,
      document.title,
      window.location.pathname + window.location.search,
    );
    setHashParams({} as T);
  };

  useEffect(() => {
    // Parse hash parameters on initial mount
    parseHashParams();

    // Set up event listener for hash changes if requested
    if (listenToChanges) {
      const handleHashChange = () => {
        parseHashParams();
      };

      window.addEventListener('hashchange', handleHashChange);
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
    }

    return undefined;
  }, [listenToChanges]);

  return { hashParams, clearHashParams };
}
