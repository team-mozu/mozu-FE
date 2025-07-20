import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname);
const workspacesDir = path.join(rootDir, "packages");
const envFile = path.join(rootDir, ".env");

const excludedWorkspaces = [
  "design-token",
  "eslint-config",
  "prettier-config",
];

const copyEnvFile = () => {
  if (!fs.existsSync(envFile)) {
    console.error(".env file not found in the root directory.");
    process.exit(1);
  }

  fs.readdir(workspacesDir, (err, folders) => {
    if (err) {
      console.error("Failed to read packages directory:", err);
      process.exit(1);
    }

    folders.forEach(folder => {
      if (excludedWorkspaces.includes(folder)) {
        console.log(`Skipping ${folder}`);
        return;
      }

      const workspacePath = path.join(workspacesDir, folder);
      const destEnvFile = path.join(workspacePath, ".env");

      fs.lstat(workspacePath, (err, stats) => {
        if (err || !stats.isDirectory()) {
          return;
        }

        fs.copyFile(envFile, destEnvFile, err => {
          if (err) {
            console.error(`Failed to copy .env file to ${workspacePath}:`, err);
          } else {
            console.log(`.env file copied to ${workspacePath}`);
          }
        });
      });
    });
  });
};

copyEnvFile();
