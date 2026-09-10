import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

/**
 * Next 16 xuất flat config gốc — không cần FlatCompat như bản 15.
 * `next` đã gộp sẵn core-web-vitals + rules cho TypeScript và React Compiler.
 */
export default defineConfig([
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  ...next,
  prettier,
]);
