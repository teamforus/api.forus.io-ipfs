'use strict'

const StoreCache = require('./StoreCache');

class DocumentStoreCache extends StoreCache {
    constructor(store) {
        super(store)
    }

    get(key, caseSensitive = false) {
        return this._store.get(key, caseSensitive);
    }

    query(mapper) {
        return this._store.query(mapper);
    }

    batchPut(docs, onProgressCallback) {
        return this._store.batchPut(docs, onProgressCallback);
    }

    put(doc) {
        return this._store.put(doc);
    }

    del(key) {
        return this._store.del(key);
    }
}

module.exports = DocumentStoreCache;