import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'dist*/**',
    'node_modules/**',
    '*.cjs',
    '*.mjs',
    '*.js',
    'tmp.jsx',
    'api/**'
  ]),
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        Buffer: 'readonly',
        process: 'readonly',
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-useless-assignment': 'warn',
      'no-empty': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/exhaustive-deps': 'warn'
    }
  },
])
