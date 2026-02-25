import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Function to read JSON
function readJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Function to write JSON
function writeJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// 1. Update package.json
const packageJsonPath = path.join(rootDir, 'package.json');
const pkg = readJSON(packageJsonPath);

const oldVersion = pkg.version; // e.g., "1.0.0"
let [major, minor, patch] = oldVersion.split('.').map(Number);

// Increment patch automatically for simplicity
patch += 1;
const newVersion = `${major}.${minor}.${patch}`;

pkg.version = newVersion;
writeJSON(packageJsonPath, pkg);
console.log(`\u001b[32m✔ Updated package.json from v${oldVersion} to v${newVersion}\u001b[0m`);

// 2. Update Android build.gradle
const gradlePath = path.join(rootDir, 'android/app/build.gradle');
try {
    let gradleFile = fs.readFileSync(gradlePath, 'utf8');

    // Update versionName
    gradleFile = gradleFile.replace(/versionName\s+".*"/, `versionName "${newVersion}"`);

    // Update versionCode (increment it)
    const versionCodeMatch = gradleFile.match(/versionCode\s+(\d+)/);
    if (versionCodeMatch) {
        const oldCode = parseInt(versionCodeMatch[1], 10);
        const newCode = oldCode + 1;
        gradleFile = gradleFile.replace(/versionCode\s+\d+/, `versionCode ${newCode}`);
        console.log(`\u001b[32m✔ Updated build.gradle versionCode from ${oldCode} to ${newCode} and versionName to ${newVersion}\u001b[0m`);
    }

    fs.writeFileSync(gradlePath, gradleFile, 'utf8');

} catch (error) {
    console.error('\u001b[31m✖ Could not update build.gradle:\u001b[0m', error.message);
}

// 3. Update or Create .env file for the Web App to read
const envPath = path.join(rootDir, '.env');
try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (envContent.includes('VITE_APP_VERSION=')) {
        envContent = envContent.replace(/VITE_APP_VERSION=.*/, `VITE_APP_VERSION=${newVersion}`);
    } else {
        envContent += `\nVITE_APP_VERSION=${newVersion}\n`;
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
    console.log(`\u001b[32m✔ Updated .env with VITE_APP_VERSION=${newVersion}\u001b[0m`);
} catch (error) {
    console.error('\u001b[31m✖ Could not update .env:\u001b[0m', error.message);
}

console.log('\n\u001b[1;32m🎉 Version bump complete! App is now at v' + newVersion + '\u001b[0m');
console.log('You can now build for Web or Android.\n');
