'use strict'

class StoreCache {
    constructor(store) {
        this._store = store;
    }

    get all () {
        return this._store.all();
    }

    get type () {
        return this._store.type();
    }

    get key() {
        return this._store.key();
    }

    async close() {
        return this._store.close();
    }

    async drop() {
        this._store.drop();
    }

    async load() {
        this._store.load();
    }

    sync(heads) {
        return this._store.sync(heads);
    }

    loadMoreFrom(amount, entries) {
        this._store.loadMoreFrom(amount, entries);
    }

    async saveSnapshot() {
        return this._store.saveSnapshot();
    }

    async loadFromSnapshot (onProgressCallback) {
        return this._store.loadFromSnapshot(onProgressCallback);
    }
}

module.exports = StoreCache;