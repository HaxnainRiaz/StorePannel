import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Pin root when parent folders also contain package-lock.json (avoids wrong workspace root).
    root: __dirname,
  },
};

export default nextConfig;
