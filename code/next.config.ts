import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // App lives in `code/`; avoid Next picking a parent lockfile as the workspace root.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
