import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable Next.js image optimization warnings
      "@next/next/no-img-element": "off",
      
      // Disable TypeScript unused vars errors
      "@typescript-eslint/no-unused-vars": "off",
      
      // Disable accessibility alt text warnings
      "jsx-a11y/alt-text": "off",
      
      // Disable TypeScript explicit any errors
      "@typescript-eslint/no-explicit-any": "off",
      
      // Disable React unescaped entities errors
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;