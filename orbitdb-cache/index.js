"use strict";

const DocumentStoreCache = require('./stores/DocumentStoreCache');

class OrbitDBCache {
    constructor(orbitDB) {
      this._orbitDB = orbitDB;
    }

    async feed(address, options = {}) {
        return this._orbitDB.feed(address, options);
    }

    async log(address, options) {
        return this._orbitDB.log(address, options);
    }

    async eventlog(address, options = {}) {
        return this.log(address, options);
    }

    async keyvalue(address, options) {
        return this._orbitDB.keyvalue(address, options);
    }

    async kvstore(address, options) {
        return this.keyvalue(address, options);
    }

    async counter(address, options = {}) {
        return this._orbitDB.counter(address, options);
    }

    async docs(address, options = {}) {
        const docstore = await this._orbitDB.docs(address, options);
        return new DocumentStoreCache(docstore);
    }

    async docstore(address, options = {}) {
        return this.docs(address, options);
    }

    async disconnect() {
        this._orbitDB.disconnect();
    }

    async stop() {
        this._orbitDB.stop();
    }

}

module.exports = OrbitDBCache;
