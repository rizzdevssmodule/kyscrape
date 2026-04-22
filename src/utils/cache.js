class CacheManager {
    constructor(ttl = 60000) { // Default 1 menit
        this.cache = new Map();
        this.ttl = ttl;
    }

    set(key, value) {
        this.cache.set(key, {
            data: value,
            timestamp: Date.now()
        });
    }

    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const isExpired = Date.now() - entry.timestamp > this.ttl;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    clear() {
        this.cache.clear();
    }
}

module.exports = new CacheManager();
