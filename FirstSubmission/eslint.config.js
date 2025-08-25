import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    languageOptions: { globals: globals.node },
    extends : ['airbnb-base'],
    rules : {
      "no-console" : "off"
    } 
  },
]);
