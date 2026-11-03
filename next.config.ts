import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withSerwist } from "@serwist/turbopack";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const examMathCompileAliases: Record<string, string> = {
  "@mcq/exam-math-compile": "../../shared/exam-math-compile/src/index.ts",
  "@mcq/exam-math-compile/prepare-latex-content":
    "../../shared/exam-math-compile/src/prepare-latex-content.ts",
  "@mcq/exam-math-compile/math-latex-repairs":
    "../../shared/exam-math-compile/src/math-latex-repairs.ts",
};

const examMathCompileAliasesAbsolute: Record<string, string> = {
  "@mcq/exam-math-compile": path.join(
    rootDir,
    "../../shared/exam-math-compile/src/index.ts",
  ),
  "@mcq/exam-math-compile/prepare-latex-content": path.join(
    rootDir,
    "../../shared/exam-math-compile/src/prepare-latex-content.ts",
  ),
  "@mcq/exam-math-compile/math-latex-repairs": path.join(
    rootDir,
    "../../shared/exam-math-compile/src/math-latex-repairs.ts",
  ),
};

const internalApiBase =
  process.env.INTERNAL_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:9001/api/v1";

const nextConfig: NextConfig = {
  transpilePackages: ["@mcq/exam-math-compile"],
  turbopack: {
    resolveAlias: examMathCompileAliases,
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      ...examMathCompileAliasesAbsolute,
    };
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
      ".jsx": [".tsx", ".jsx"],
      ...config.resolve.extensionAlias,
    };
    return config;
  },
  reactStrictMode: true,
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${internalApiBase}/:path*`,
      },
    ];
  },
};

export default withSerwist(nextConfig);
