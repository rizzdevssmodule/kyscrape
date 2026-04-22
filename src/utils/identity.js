const UserAgent = require('user-agents');

class IdentityManager {
    constructor() {
        this.uaGenerator = new UserAgent({ deviceCategory: 'desktop' });
    }

    /**
     * Generate a complete browser identity with modern TLS fingerprints
     */
    get() {
        const ua = this.uaGenerator.random();
        
        // TLS Fingerprint (Modern & Industry Standard)
        // Using static high-quality ciphers to avoid "anomaly" detection while maintaining bypass capability
        const tlsConfig = {
            ciphers: 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384',
            sigalgs: 'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256',
            minVersion: 'TLSv1.2'
        };

        return {
            userAgent: ua.toString(),
            headers: {
                'Sec-Ch-Ua': `"${ua.data.browser}";v="${ua.data.version.split('.')[0]}", "Not-A.Brand";v="99"`,
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': `"${ua.data.platform}"`,
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1'
            },
            tls: tlsConfig
        };
    }
}

module.exports = new IdentityManager();
