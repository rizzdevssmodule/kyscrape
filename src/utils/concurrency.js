const logger = require('./logger');

async function parallel(tasks, limit) {
    const results = [];
    const executing = new Set();
    
    logger.info(`Concurrency Manager: Starting ${tasks.length} tasks with limit ${limit}`);

    for (const task of tasks) {
        const p = Promise.resolve().then(() => task());
        results.push(p);
        executing.add(p);
        
        const clean = () => executing.delete(p);
        p.then(clean).catch(clean);
        
        if (executing.size >= limit) {
            await Promise.race(executing);
        }
    }
    
    return Promise.all(results);
}

module.exports = { parallel };
