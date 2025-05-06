import {
  defineEslintConfig,
  eslintConfig,
  eslintGlobalIgnores,
} from "./eslint.js";
import { prettierConfig } from "./prettier.js";

const eslint = {
  config: eslintConfig,
  defineEslintConfig,
  eslintGlobalIgnores,
};

const prettier = {
  config: prettierConfig,
};

export { eslint, prettier };
