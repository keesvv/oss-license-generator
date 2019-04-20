const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const crawler = require('./crawler');
const args = process.argv.slice(2);
const appPath = args[0];

if (!appPath) {
  logger.error('Path to app is missing, please specify the app directory.');
} else if (!fs.existsSync(appPath)) {
  logger.error('The specified path does not exist.');
}

const modulesPath = path.join(appPath, 'node_modules');
logger.info('Checking for node_modules...');

if (!fs.existsSync(modulesPath)) {
  logger.error('node_modules cannot be found.');
} else {
  logger.info('node_modules found, scanning...');
}

const licenseFiles = crawler.crawl(appPath, 'LICENSE', 'LICENSE.md', 'LICENSE.MD');
const licenseContent = crawler.mapLicenseContents(licenseFiles);
const result = crawler.parseContent(licenseContent);

logger.info(`Found ${licenseFiles.length} license files.`);
logger.info('Writing to file...');

try {
  fs.writeFileSync('oss-license.md', result);
  logger.info('Write successful. Licenses are written to oss-license.md');
} catch (error) {
  logger.error('An error has occured while writing to file:');
  logger.error(error);
}
