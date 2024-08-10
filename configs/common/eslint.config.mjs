import { common } from '@agaroot/eslint-config-common';
import { define } from '@agaroot/eslint-config-definer';
import { javascript } from '@agaroot/eslint-config-javascript';
import { style } from '@agaroot/eslint-config-style';
import { typescript } from '@agaroot/eslint-config-typescript';

export const commonConfig = define([
  common,
  javascript,
  typescript,
  style,
]);

export default commonConfig({
  tsconfigPath: './tsconfig.json',
});
