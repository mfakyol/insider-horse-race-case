import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock CSS modules
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock SCSS modules - return class names as-is for testing
vi.mock("*.module.scss", () => ({
  default: new Proxy(
    {},
    {
      get: (_target, prop) => prop,
    }
  ),
}));
