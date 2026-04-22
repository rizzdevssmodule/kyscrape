const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const logger = require('../utils/logger');

chromium.use(stealth);

class StealthEngine {
    constructor() {
        this.browser = null;
    }

    async init() {
        if (!this.browser) {
            logger.stealth('Launching Stealth Browser...');
            this.browser = await chromium.launch({ headless: true });
        }
    }

    async request(url) {
        await this.init();
        const context = await this.browser.newContext();
        const page = await context.newPage();
        
        logger.stealth(`Navigating to: ${url}`);
        
        try {
            // Wait for network idle to ensure Cloudflare/WAF challenge is solved
            await page.goto(url, { waitUntil: 'networkidle' });
            
            // Cek apakah masih kena block
            const title = await page.title();
            if (title.includes('Just a moment...') || title.includes('Attention Required')) {
                logger.warn('Cloudflare challenge detected, waiting for solve...');
                await page.waitForTimeout(5000); // Tunggu sebentar untuk auto-solve
            }

            const content = await page.content();
            const cookies = await context.cookies();
            
            await context.close();
            return { content, cookies, status: 200 };
        } catch (error) {
            logger.error(`Stealth Engine Failed: ${error.message}`);
            await context.close();
            throw error;
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

module.exports = StealthEngine;
