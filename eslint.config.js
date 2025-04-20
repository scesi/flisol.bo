// eslint.config.js
import js from '@eslint/js'
import * as tseslint from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['**/*.d.ts', '/.astro']),
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: [
      '**/*.d.ts',
      '/.astro',
      './.astro/',
      'node_modules/',
      'dist/',
      'build/',
      '.vercel/',
      '.output/',
      'public/',
    ],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      // You can customize your rules here
      'react/react-in-jsx-scope': 'off',
    },
  },
])
