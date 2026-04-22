#!/usr/bin/env node

const kyscrape = require('./index');
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const url = args.find(a => a.startsWith('http'));
const isJson = args.includes('--json');
const isHtml = args.includes('--html');

// Visual Flags
const ssIdx = args.indexOf('--ss');
const screenshotPath = ssIdx !== -1 ? args[ssIdx + 1] : null;

const pdfIdx = args.indexOf('--pdf');
const pdfPath = pdfIdx !== -1 ? args[pdfIdx + 1] : null;

const outputFile = args.find(a => !a.startsWith('http') && !a.startsWith('--') && a !== screenshotPath && a !== pdfPath);

if (!url) {
    console.log('\nUsage: kyscrape <url> [options] [filename]');
    console.log('\nOptions:');
    console.log('  --json           Output as JSON');
    console.log('  --ss <file>      Take a full-page screenshot');
    console.log('  --pdf <file>     Save page as PDF');
    console.log('\nExamples:');
    console.log('  kyscrape https://example.com --ss result.png');
    console.log('  kyscrape https://example.com --pdf doc.pdf');
    console.log('  kyscrape https://api.site.com --json data.json\n');
    process.exit(1);
}

(async () => {
    logger.info(`Starting KyScrape for: ${url}`);

    try {
        let result;

        if (screenshotPath) {
            logger.info('Capturing Screenshot...');
            result = await kyscrape.screenshot(url, screenshotPath);
        } else if (pdfPath) {
            logger.info('Generating PDF...');
            result = await kyscrape.pdf(url, pdfPath);
        } else {
            result = await kyscrape(url);
        }

        let finalData = result.data;
        let displayData = '';

        if (isJson) {
            try {
                finalData = JSON.stringify(result.json(), null, 2);
            } catch (e) {
                logger.warn('Failed to parse as JSON, falling back to raw data.');
            }
        }

        console.log('\n' + '='.repeat(40));
        console.log(`Engine Used : ${result.engine.toUpperCase()}`);
        console.log(`Status Code : ${result.status}`);
        console.log('='.repeat(40) + '\n');

        if (outputFile) {
            const fullPath = path.resolve(process.cwd(), outputFile);
            fs.writeFileSync(fullPath, finalData);
            logger.success(`Output saved to: ${fullPath}`);
        } else if (!screenshotPath && !pdfPath) {
            console.log(finalData);
        }

    } catch (err) {
        logger.error(`Critical Error: ${err.message}`);
    } finally {
        await kyscrape.close();
    }
})();
