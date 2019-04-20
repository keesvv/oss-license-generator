module.exports = {
  info: (message) => {
    console.info(`[i] ${message}`);
  },
  error: (message, exit = true) => {
    console.error(`[!] ${message}`);
    if (exit) process.exit(1);
  }
};
