const chalk = require('chalk');

const logger = {
    info: (msg) => console.log(`${chalk.blue('ℹ')} [KyScrape] ${msg}`),
    success: (msg) => console.log(`${chalk.green('✔')} [KyScrape] ${msg}`),
    warn: (msg) => console.log(`${chalk.yellow('⚠')} [KyScrape] ${msg}`),
    error: (msg) => console.log(`${chalk.red('✖')} [KyScrape] ${msg}`),
    nitro: (msg) => console.log(`${chalk.cyan('🚀')} [Nitro-Engine] ${msg}`),
    stealth: (msg) => console.log(`${chalk.magenta('🕵️')} [Stealth-Engine] ${msg}`),
};

module.exports = logger;
