const kyscrape = require('../src/index');
const logger = require('../src/utils/logger');

(async () => {
    logger.info('Starting Modern KyScrape Test...');

    try {
        // 1. Simple Usage (Modern & Clean)
        const response = await kyscrape('https://www.google.com');

        console.log('\n--- MODERN RESULT ---');
        console.log(`Used Engine : ${response.engine}`);
        console.log(`Status      : ${response.status}`);
        console.log(`Data (text) : ${response.text().substring(0, 50)}...`);
        console.log('---------------------\n');

        // 2. Destructuring (Professional style)
        const { engine, data, json } = await kyscrape('https://jsonplaceholder.typicode.com/todos/1');
        
        if (engine === 'nitro') {
            logger.success(`Fast fetch successful! ID: ${json().id}`);
        }

    } catch (err) {
        logger.error(`Test Failed: ${err.message}`);
    } finally {
        await kyscrape.close();
    }
})();
