import { define } from '@agaroot/eslint-config-definer';
import { commonConfig } from '@ur-automation/config-common/eslint.config.mjs';

export const nodejsConfig = define([
  commonConfig,
]);

export default commonConfig({
  tsconfigPath: './tsconfig.json',
});
