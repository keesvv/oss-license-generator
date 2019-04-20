const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const appPath = args[0];

const info = (message) => {
  console.info(`[i] ${message}`);
}

const error = (message) => {
  console.error(`[!] ${message}`);
  process.exit(1);
}

if (!appPath) {
  error('Path to app is missing, please specify the app directory.');
} else if (!fs.existsSync(appPath)) {
  error('The specified path does not exist.');
}

info('Checking for node_modules...');
const modulesPath = path.join(appPath, 'node_modules');

if (!fs.existsSync(modulesPath)) {
  error('node_modules cannot be found.');
} else {
  info('node_modules found, scanning...');
}

const entries = fs.readdirSync(modulesPath);
let licenses = [];
let licenseContent = [];

entries.forEach((entry) => {
  const licensePath = path.join(modulesPath, entry, 'LICENSE.md');
  if (fs.existsSync(licensePath)) {
    licenses.push({ entry, licensePath });
  }
});

info(`Found ${licenses.length} license files.`);

licenses.forEach((license) => {
  const content = fs.readFileSync(license.licensePath, 'utf-8');
  licenseContent.push({ entry: license.entry, content });
});

info('Gathering results...');
let result = '';
licenseContent.forEach((i) => {
  result += `## ${i.entry}\n\n${i.content}\n\n`;
});

info('Writing to file...');
fs.writeFileSync('oss-license.md', result);

info('Write successful. Licenses are written to oss-license.md');
