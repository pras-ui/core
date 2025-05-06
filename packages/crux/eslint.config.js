import { eslint } from "@pras-ui/config";

export default eslint.defineEslintConfig([
  ...eslint.config,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      "react/prop-types": "off",
    },
  },
]);
