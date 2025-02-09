import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix dirname in ES Modules
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function deleteFilesInDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      deleteFilesInDir(fullPath); // Recursively go into subdirectories
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      fs.unlinkSync(fullPath); // Delete the file
    }
  });
}

const targetDir = "."; // Change this if needed
deleteFilesInDir(targetDir);

console.log("✅ All .ts and .tsx files deleted!");
