// Allow test files using jest.fn() / jest.mock() syntax to type-check under Vitest.
// At runtime, jest is aliased to vi via setupTests.ts.
declare const jest: typeof import('vitest')['vitest'];
declare namespace jest {
  // jest.Mock<T> → vitest's Mock type
  type Mock<T = any> = import('vitest').Mock<T>;
}
