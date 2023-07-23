import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      all: true,
      include: ["app/**"],
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
    unstubEnvs: true,
    restoreMocks: true,
  },
});
