const kyscrape = require('../src/index');
const logger = require('../src/utils/logger');

(async () => {
    logger.info('--- KyScrape Modern Features Test ---');

    try {
        const url = 'https://www.wikipedia.org';

        // 1. Test Built-in Cheerio ($)
        logger.info('Testing Built-in Cheerio...');
        const { $ } = await kyscrape(url);
        const title = $('h1').text() || 'Wikipedia';
        logger.success(`Extracted Title: ${title}`);

        // 2. Test Screenshot
        logger.info('Taking Screenshot...');
        await kyscrape.screenshot(url, 'wikipedia.png');

        // 3. Test PDF
        logger.info('Generating PDF...');
        await kyscrape.pdf(url, 'wikipedia.pdf');

        logger.success('All modern features tested successfully!');

    } catch (err) {
        logger.error(`Error: ${err.message}`);
    } finally {
        await kyscrape.close();
    }
})();
