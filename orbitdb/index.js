"use strict";

const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');
const OrbitDBCache = require('../orbitdb-cache');

module.exports = {

    dbPrefix: process.env.ORBITDB_PREFIX || 'forus.kindpakket.',
    orbitDbDir: process.env.ORBITDB_DIR || '/data/orbitdb',

    ipfsOptions: {
        repo: process.env.IPFS_REPO_DIR || '/data/ipfs',
        init: true,
        EXPERIMENTAL: {
            pubsub: true
        }
    },

    IPFS: null,
    orbitDB: null,
    server: null,
    dbs: {},

    getIPFS: async function() {
        if (this.IPFS) {
            return new Promise((accept, reject) => { accept(this.IPFS) });
        }

        return new Promise((accept, reject) => {
            this.IPFS = new IPFS(this.ipfsOptions);
            this.IPFS.on('ready', function() {
                accept(this);
            });
        });
    },

    getOrbitDB: async function() {
        if (this.orbitDB) {
            return this.orbitDB;
        }

        const IPFS = await this.getIPFS();
        const orbitDB = new OrbitDB(IPFS, this.orbitDbDir);
        this.orbitDB = new OrbitDBCache(orbitDB);
        return this.orbitDB;
    },

    getDatabase: async function(dbName) {
        if (!this.dbs[dbName]) {
            const orbitDB = await this.getOrbitDB();
            this.dbs[dbName] = await orbitDB.docs(this.dbPrefix + dbName, { indexBy: 'id' });
            await this.dbs[dbName].load();
        }

        return this.dbs[dbName];
    },

    getMiddleware(self) {
        return async function (req, res, next) {
            const pathParts = req.path.replace(/^\//g, '').replace(/\/$/g, '').split('/');
            if (!pathParts[0]) {
                res.status(400).send();
                return;
            }
            
            req.orbitDB = await self.getDatabase(pathParts[0]);    
            next();
        }
    }

};
