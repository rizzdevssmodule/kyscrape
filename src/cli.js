#!/usr/bin/env node

const kyscrape = require('./index');
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const url = args.find(a => a.startsWith('http'));
const isJson = args.includes('--json');
const isHtml = args.includes('--html');
const outputFile = args.find(a => !a.startsWith('http') && !a.startsWith('--'));

if (!url) {
    console.log('\nUsage: kyscrape <url> [options] [filename]');
    console.log('\nOptions:');
    console.log('  --json    Output as JSON');
    console.log('  --html    Output as HTML (default)');
    console.log('\nExamples:');
    console.log('  kyscrape https://api.com/data --json');
    console.log('  kyscrape https://site.com result.html');
    console.log('  kyscrape https://api.com/data --json data.json\n');
    process.exit(1);
}

(async () => {
    logger.info(`Starting KyScrape for: ${url}`);

    try {
        const result = await kyscrape(url);

        let finalData = result.data;
        let displayData = '';

        // Handle JSON Mode
        if (isJson) {
            try {
                finalData = JSON.stringify(result.json(), null, 2);
                displayData = finalData;
            } catch (e) {
                logger.warn('Failed to parse as JSON, falling back to raw data.');
                displayData = finalData;
            }
        } else {
            displayData = finalData.substring(0, 500) + '...';
        }

        console.log('\n' + '='.repeat(40));
        console.log(`Engine Used : ${result.engine.toUpperCase()}`);
        console.log(`Status Code : ${result.status}`);
        console.log(`Format      : ${isJson ? 'JSON' : 'HTML'}`);
        console.log('='.repeat(40) + '\n');

        // Jika user minta output ke terminal (raw)
        if (!outputFile) {
            console.log(finalData); // Print FULL data to console if no file specified
            console.log('\n' + '-'.repeat(40));
            logger.info('Tip: Add a filename to save the output: kyscrape <url> output.txt');
        } 
        
        // Jika user minta simpan ke file
        if (outputFile) {
            const fullPath = path.resolve(process.cwd(), outputFile);
            fs.writeFileSync(fullPath, finalData);
            logger.success(`Output saved to: ${fullPath}`);
        }

    } catch (err) {
        logger.error(`Critical Error: ${err.message}`);
    } finally {
        await kyscrape.close();
    }
})();
