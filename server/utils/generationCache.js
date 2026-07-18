class GenerationCache {
  constructor(ttlMs = 24 * 60 * 60 * 1000, maxSize = 1000) {
    this.cache = new Map();
    this.ttlMs = ttlMs;
    this.maxSize = maxSize;
  }

  _generateKey(goal, duration, equipment) {
    const eqString = equipment && equipment.length > 0 
      ? [...equipment].sort().map(e => e.toLowerCase().trim()).join(',') 
      : 'none';
    return `${goal.toLowerCase().trim()}_${duration}_${eqString}`;
  }

  get(goal, duration, equipment) {
    const key = this._generateKey(goal, duration, equipment);
    const item = this.cache.get(key);
    
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(goal, duration, equipment, data) {
    if (this.cache.size >= this.maxSize) {
      // Simple eviction: remove the first item (oldest inserted)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const key = this._generateKey(goal, duration, equipment);
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttlMs
    });
  }
}

module.exports = new GenerationCache();
