import { realpathSync } from "node:fs";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";

const sdks = {
  "@gitscale-demo/application-a-sdk": "imports/application-a/sdk",
  "@gitscale-demo/application-b-sdk": "imports/application-b/sdk",
};

// In development each SDK is its sources, so an SDK edit reloads like the
// frontend's own. In a workspace each is a link to another checkout, which
// Vite serves only when allowed. /api/a and /api/b go where API_A_URL and
// API_B_URL say, as nginx sends them in the image.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve:
    command === "serve"
      ? {
          alias: Object.fromEntries(
            Object.entries(sdks).map(([name, dir]) => [
              name,
              `${realpathSync(dir)}/src/index.ts`,
            ]),
          ),
        }
      : {},
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        ...Object.values(sdks).map((dir) => realpathSync(dir)),
      ],
    },
    proxy: {
      "/api/a": process.env.API_A_URL ?? "http://localhost:8081",
      "/api/b": process.env.API_B_URL ?? "http://localhost:8082",
    },
  },
}));
