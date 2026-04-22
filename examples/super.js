const kyscrape = require('../src/index');
const logger = require('../utils/logger');

(async () => {
    logger.info('--- KyScrape CLEAN & SIMPLE TEST ---');

    const urls = [
        'https://www.google.com',
        'https://www.wikipedia.org'
    ];

    logger.info('Mass Scraping using Nitro Engine with Auto-Fallback...');
    const results = await kyscrape.all(urls, { limit: 2 });
    
    results.forEach((res, i) => {
        console.log(`[Result ${i+1}] Engine: ${res.engine} | Status: ${res.status}`);
    });

    logger.info('--- TEST COMPLETED ---');
    await kyscrape.close();
})();
