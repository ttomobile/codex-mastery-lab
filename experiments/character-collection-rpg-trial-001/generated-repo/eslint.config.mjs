import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...nextTypescript,
  {
    ignores: ["node_modules/**", ".next/**", "coverage/**", "playwright-report/**", "test-results/**"]
  }
];

export default eslintConfig;
