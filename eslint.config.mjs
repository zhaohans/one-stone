// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "*.js",
      "*.cjs",
      "*.mjs",
      "*.json",
      "babel.config.js",
      "postcss.config.js",
      "jest.config.js",
      "tailwind.config.ts",
      "server.cjs",
      "server.ts",
      "upload-to-drive.js",
      "api/*.js",
      "backend/*.js",
      "backend/**/*.js",
      "*.config.*",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/.storybook/**",
      "**/stories/**",
      "**/__tests__/**",
      "**/*.d.ts",
      "dist/**",
      "build/**",
    ],
    files: ["src/**/*.{ts,tsx}", "backend/src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },
];
