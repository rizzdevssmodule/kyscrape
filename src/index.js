const NitroEngine = require('./engines/nitro');
const StealthEngine = require('./engines/stealth');
const logger = require('./utils/logger');
const { parallel } = require('./utils/concurrency');
const cache = require('./utils/cache');
const cheerio = require('cheerio');

class KyScrape {
    constructor(options = {}) {
        this.nitro = new NitroEngine();
        this.stealth = new StealthEngine();
        this.options = {
            autoStealth: options.autoStealth !== false,
            ...options
        };
    }

    async fetch(url, options = {}) {
        // Check cache first
        const cachedData = cache.get(url);
        if (cachedData && !options.noCache) {
            logger.info(`Cache Hit: ${url}`);
            return cachedData;
        }

        try {
            // Jika user minta screenshot atau pdf, langsung pakai stealth
            if (options.screenshot || options.pdf) {
                const result = await this.stealthRequest(url, options);
                cache.set(url, result);
                return result;
            }

            const response = await this.nitro.request(url, options);

            if ([403, 503, 429].includes(response.status) && this.options.autoStealth) {
                logger.warn(`Nitro Engine blocked. Switching to Stealth...`);
                const stealthResult = await this.stealthRequest(url, options);
                cache.set(url, stealthResult);
                return stealthResult;
            }

            const rawData = await response.text();
            const formatted = this._formatResponse('nitro', response.status, rawData);
            
            cache.set(url, formatted);
            return formatted;

        } catch (error) {
            if (this.options.autoStealth) {
                logger.warn(`Nitro Engine error. Falling back to Stealth...`);
                return await this.stealthRequest(url, options);
            }
            throw error;
        }
    }

    async stealthRequest(url, options = {}) {
        const result = await this.stealth.request(url, options);
        return this._formatResponse('stealth', result.status, result.content, result.cookies);
    }

    _formatResponse(engine, status, data, cookies = []) {
        const $ = cheerio.load(data);
        return {
            engine,
            status,
            data,
            cookies,
            $, // Built-in Cheerio
            text: () => data,
            json: () => JSON.parse(data),
            toString: () => data
        };
    }

    async close() {
        await this.stealth.close();
    }
}

// Global instance for simple usage
const defaultInstance = new KyScrape();

const kyscrape = async (url, options = {}) => {
    return await defaultInstance.fetch(url, options);
};

// Expose internal class and instance
kyscrape.Core = KyScrape;
kyscrape.instance = defaultInstance;
kyscrape.close = () => defaultInstance.close();

/**
 * Screenshot convenience method
 */
kyscrape.screenshot = (url, path, options = {}) => {
    return kyscrape(url, { ...options, screenshot: path });
};

/**
 * PDF convenience method
 */
kyscrape.pdf = (url, path, options = {}) => {
    return kyscrape(url, { ...options, pdf: path });
};

/**
 * Mass scraping with concurrency control
 */
kyscrape.all = async (urls, options = {}) => {
    const limit = options.limit || 5;
    const tasks = urls.map(url => () => kyscrape(url, options));
    return await parallel(tasks, limit);
};

module.exports = kyscrape;
