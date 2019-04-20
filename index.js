const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const args = process.argv.slice(2);
const appPath = args[0];

if (!appPath) {
  logger.error('Path to app is missing, please specify the app directory.');
} else if (!fs.existsSync(appPath)) {
  logger.error('The specified path does not exist.');
}

logger.info('Checking for node_modules...');
const modulesPath = path.join(appPath, 'node_modules');

if (!fs.existsSync(modulesPath)) {
  logger.error('node_modules cannot be found.');
} else {
  logger.info('node_modules found, scanning...');
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

logger.info(`Found ${licenses.length} license files.`);

licenses.forEach((license) => {
  const content = fs.readFileSync(license.licensePath, 'utf-8');
  licenseContent.push({ entry: license.entry, content });
});

logger.info('Gathering results...');
let result = '';
licenseContent.forEach((i) => {
  result += `## ${i.entry}\n\n${i.content}\n\n`;
});

logger.info('Writing to file...');
fs.writeFileSync('oss-license.md', result);

logger.info('Write successful. Licenses are written to oss-license.md');
