"use strict";

const DocumentStoreCache = require('./stores/DocumentStoreCache');

class OrbitDBCache {
    constructor(orbitDB) {
      this._orbitDB = orbitDB;
    }

    async feed(address, options = {}) {
        return await this._orbitDB.feed(address, options);
    }

    async log(address, options) {
        return await this._orbitDB.log(address, options);
    }

    async eventlog(address, options = {}) {
        return await this.log(address, options);
    }

    async keyvalue(address, options) {
        return await this._orbitDB.keyvalue(address, options);
    }

    async kvstore(address, options) {
        return await this.keyvalue(address, options);
    }

    async counter(address, options = {}) {
        return await this._orbitDB.counter(address, options);
    }

    async docs(address, options = {}) {
        const docstore = await this._orbitDB.docs(address, options);
        return await new DocumentStoreCache(docstore);
    }

    async docstore(address, options = {}) {
        return await this.docs(address, options);
    }

    async disconnect() {
        await this._orbitDB.disconnect();
    }

    async stop() {
        await this._orbitDB.stop();
    }

}

module.exports = OrbitDBCache;
