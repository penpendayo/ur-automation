import { define } from '@agaroot/eslint-config-definer';
import { react } from '@agaroot/eslint-config-react';
import { commonConfig } from '@ur-automation/config-common/eslint.config.mjs';

export const reactConfig = define([
  commonConfig,
  react,
]);

export default commonConfig({ // configs/react自体はreactを使わないので、commonを使う
  tsconfigPath: './tsconfig.json',
});
