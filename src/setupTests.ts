import '@testing-library/jest-dom';

// react-dom/server.browser (React 18) requires TextEncoder / TextDecoder which
// jest-environment-jsdom does not expose from Node. Polyfill them from the Node
// built-in 'util' module so imports of react-dom/server don't throw.
import { TextDecoder, TextEncoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });

// jsdom 25 with Vitest's environment may not expose localStorage methods;
// replace it with a simple in-memory implementation when needed.
if (
  typeof localStorage === 'undefined' ||
  typeof localStorage.getItem !== 'function'
) {
  const store = new Map<string, string>();
  const fakeLs = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, String(v)),
    removeItem: (k: string) => store.delete(k),
    clear: () => store.clear(),
    get length() {
      return store.size;
    },
    key: (i: number) => [...store.keys()][i] ?? null,
  };
  Object.defineProperty(window, 'localStorage', {
    value: fakeLs,
    writable: true,
  });
  Object.defineProperty(window, 'sessionStorage', {
    value: { ...fakeLs },
    writable: true,
  });
}
