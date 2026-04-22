const { fetch, Agent } = require('undici');
const logger = require('../utils/logger');
const identity = require('../utils/identity');

class NitroEngine {
    constructor() {
        // Agent akan dibuat per request untuk rotasi TLS yang lebih baik
    }

    async request(url, options = {}) {
        const startTime = Date.now();
        const id = identity.get(); 

        logger.nitro(`Requesting with Identity: ${id.userAgent.substring(0, 40)}...`);

        const agent = new Agent({
            keepAliveTimeout: 10,
            tls: {
                ...id.tls,
                rejectUnauthorized: false
            }
        });

        const defaultHeaders = {
            'User-Agent': id.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            ...id.headers,
            'Upgrade-Insecure-Requests': '1'
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers: { ...defaultHeaders, ...options.headers },
                dispatcher: agent
            });

            const duration = Date.now() - startTime;
            logger.nitro(`Completed in ${duration}ms | Status: ${response.status}`);

            return response;
        } catch (error) {
            logger.error(`Nitro Engine Failed: ${error.message}`);
            throw error;
        }
    }
}

module.exports = NitroEngine;
