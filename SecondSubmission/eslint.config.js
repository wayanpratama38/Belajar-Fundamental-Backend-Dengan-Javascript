import globals from "globals";
import eslintPluginJs from "@eslint/js";

export default [
  eslintPluginJs.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-console": "off",
    },
  },
];