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
  ]),
  {
    rules: {
      // Escalated to error so an unused import/variable fails CI instead of
      // silently accumulating (see docs/PROJECT-REVIEW-BN.md).
      "@typescript-eslint/no-unused-vars": "error",
      // Downgraded to warn: the two current occurrences (ContactForm.tsx's
      // post-submit reset, and vendored components/ui/carousel.tsx) are
      // documented, intentional trade-offs, not bugs to fix on every commit.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
