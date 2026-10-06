// Build each SDK this frontend depends on whose dist/ is missing: a source
// checkout of its application. An artefact checkout ships dist/ built.
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

for (const app of ["application-a", "application-b"]) {
  const sdk = `imports/${app}/sdk`;
  if (existsSync(`${sdk}/dist`)) continue;
  console.log(`building ${sdk}`);
  execFileSync("npm", ["ci", "--no-audit", "--no-fund"], { cwd: sdk, stdio: "inherit" });
  execFileSync("npm", ["run", "build"], { cwd: sdk, stdio: "inherit" });
}
