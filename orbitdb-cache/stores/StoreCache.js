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
        return await this._store.close();
    }

    async drop() {
        await this._store.drop();
    }

    async load (amount) {
        await this._store.load(amount);
    }

    sync(heads) {
        return this._store.sync(heads);
    }

    loadMoreFrom(amount, entries) {
        this._store.loadMoreFrom(amount, entries);
    }

    async saveSnapshot() {
        return await this._store.saveSnapshot();
    }

    async loadFromSnapshot (onProgressCallback) {
        return await this._store.loadFromSnapshot(onProgressCallback);
    }
}

module.exports = StoreCache;