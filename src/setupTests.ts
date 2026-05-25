import '@testing-library/jest-dom';

// react-dom/server.browser (React 18) requires TextEncoder / TextDecoder which
// jest-environment-jsdom does not expose from Node. Polyfill them from the Node
// built-in 'util' module so imports of react-dom/server don't throw.
import { TextDecoder, TextEncoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });
