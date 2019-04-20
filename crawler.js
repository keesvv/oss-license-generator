const fs = require('fs');
const path = require('path');

module.exports = {
  crawl: (directory, ...files) => {
    const modulesPath = path.join(directory, 'node_modules');
    const entries = fs.readdirSync(modulesPath);
    let licenseFiles = [];

    entries.forEach(entry => {
      files.forEach(file => {
        const licensePath = path.join(modulesPath, entry, file);
        if (fs.existsSync(licensePath)) {
          licenseFiles.push({
            module: entry,
            licensePath
          });
        }
      });
    });

    return licenseFiles;
  },
  mapLicenseContents: (licenseFiles) => {
    return licenseFiles.map(license => {
      const licenseContent = fs.readFileSync(license.licensePath, 'utf-8');

      return {
        module: license.module,
        licenseContent
      };
    });
  }
};
