module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["xo", "plugin:vitest-globals/recommended", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["**/*.test.js"],
      env: {
        "vitest-globals/env": true,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["prettier", "vitest-globals"],
  rules: {
    "prettier/prettier": "error",
  },
};
