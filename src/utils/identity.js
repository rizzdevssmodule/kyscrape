const UserAgent = require('user-agents');

class IdentityManager {
    constructor() {
        this.uaGenerator = new UserAgent({ deviceCategory: 'desktop' });
    }

    /**
     * Generate a complete browser identity
     */
    get() {
        const ua = this.uaGenerator.random();
        
        // Simulasikan TLS Ciphers yang umum dipakai Chrome/Firefox modern
        // Ini adalah "rahasia" untuk bypass JA3 fingerprinting di level dasar
        const ciphers = [
            'TLS_AES_128_GCM_SHA256',
            'TLS_AES_256_GCM_SHA384',
            'TLS_CHACHA20_POLY1305_SHA256',
            'ECDHE-ECDSA-AES128-GCM-SHA256',
            'ECDHE-RSA-AES128-GCM-SHA256',
            'ECDHE-ECDSA-AES256-GCM-SHA384',
            'ECDHE-RSA-AES256-GCM-SHA384',
            'ECDHE-ECDSA-CHACHA20-POLY1305',
            'ECDHE-RSA-CHACHA20-POLY1305'
        ].join(':');

        return {
            userAgent: ua.toString(),
            browserData: ua.data,
            tls: {
                ciphers,
                sigalgs: 'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pkcs1_sha1',
                minVersion: 'TLSv1.2',
                maxVersion: 'TLSv1.3'
            },
            headers: {
                'Sec-Ch-Ua': `"${ua.data.browser}";v="${ua.data.version.split('.')[0]}", "Not-A.Brand";v="99"`,
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': `"${ua.data.platform}"`,
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        };
    }
}

module.exports = new IdentityManager();
