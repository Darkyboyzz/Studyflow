import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local conversion/debug helpers and generated design exports.
    "convert.js",
    "fix.js",
    "fix2.js",
    "fix3.js",
    "test-auth.js",
    "UI/**",
    "extracted_ui/**",
    "scratch/**",
  ]),
]);

export default eslintConfig;
