import { define } from '@agaroot/eslint-config-definer';
import { next } from '@agaroot/eslint-config-next';
import { react } from '@agaroot/eslint-config-react';
import { commonConfig } from '@ur-automation/config-common/eslint.config.mjs';

export const nextConfig = define([
  commonConfig,
  react,
  next,
]);

export default commonConfig({ // configs/nextjs自体はreactを使わないので、commonを使う
  tsconfigPath: './tsconfig.json',
});
