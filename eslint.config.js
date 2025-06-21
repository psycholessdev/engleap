// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  prettier,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["**/*config*.js", "**/*config*.ts"], // Ignore all config files
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      parser: tseslint.parser,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 1,
    },
  },
]);
