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

    async request(url, options = {}) {
        await this.init();
        const context = await this.browser.newContext();
        const page = await context.newPage();
        
        logger.stealth(`Navigating to: ${url}`);
        
        try {
            await page.goto(url, { waitUntil: 'networkidle' });
            
            // Logika Bypass Cloudflare/WAF yang lebih kuat
            let isBlocked = true;
            let retries = 0;
            while (isBlocked && retries < 10) {
                const title = await page.title();
                const content = await page.content();
                
                if (title.includes('Just a moment...') || title.includes('Attention Required') || content.includes('cf-challenge')) {
                    logger.warn(`Cloudflare challenge detected (Attempt ${retries + 1}). Waiting for solve...`);
                    
                    // Simulasi interaksi manusia ringan untuk memicu bypass
                    await page.mouse.move(Math.random() * 500, Math.random() * 500);
                    await page.waitForTimeout(3000); 
                    retries++;
                } else {
                    isBlocked = false;
                }
            }

            if (isBlocked) {
                logger.error('Failed to bypass Cloudflare after several attempts.');
            } else {
                logger.success('Bypass successful! Page is ready.');
            }

            // Fitur Visual: Hanya ambil jika bypass berhasil atau sudah maksimal usaha
            if (options.screenshot) {
                // Tunggu sebentar agar rendering selesai sempurna setelah bypass
                await page.waitForTimeout(1000);
                await page.screenshot({ path: options.screenshot, fullPage: true });
                logger.success(`Screenshot saved to: ${options.screenshot}`);
            }

            // Fitur Visual: PDF jika diminta
            if (options.pdf) {
                await page.pdf({ path: options.pdf, format: 'A4' });
                logger.success(`PDF saved to: ${options.pdf}`);
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
