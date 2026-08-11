import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // flat config는 .eslintignore를 읽지 않으므로 빌드 산출물을 명시적으로 제외
  { ignores: [".next/**", "out/**", "build/**"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // 반드시 마지막에 위치: Prettier와 충돌하는 포맷 관련 규칙을 off로 덮어씀
  eslintConfigPrettier,
];

export default eslintConfig;
