import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  { ignores: ['coverage', 'dist', 'jest.config.js'] },
  { plugins: eslintConfigPrettier },
  { rules: { 'no-process-env': 'error' } },
);
