"use strict";

const crypto = require('crypto');
var express = require('express');
var router = express.Router();
module.exports = router;


const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use (function (error, req, res, next){
    if("entity.parse.failed" == error.type) {
        res.status(400).json({
            result: false,
            error: "Invallid request body"
        });
    }
});

const orbitDB = require('../orbitdb');
router.use(orbitDB.getMiddleware(orbitDB));

router.route('/docs/:resource/:id')
    .get((req, res) => {
        var result = req.orbitDB.get(req.params.id).map(e => e);
        if (1 == result.length) {
            res.json(result[0]);
        } else {
            res.status(404).json({});
        }
    })
    .put((req, res) => {
        const item = req.body;
        item.id = req.params.id;
        if (!item.id) {
            res.status(400).send();
        }

        req.orbitDB.put(item).then(hash => {
            res.json({'hash': hash });
        })
        
    })
    .delete(async (req, res) => {
        const hash = await req.orbitDB.del(req.params.id);
        res.json({'hash': hash });
    });


router.route('/docs/:resource')
    .get((req, res) => {
        var result = [];
        
        var query = {};
        if (req.query.filter) {
            query = JSON.parse(req.query.filter);
        }
        result = req.orbitDB.query((doc) => {
            for (var key in query) {
                if (doc[key] != query[key]) {
                    return false;
                }
            }
            return true;
        });

        var sortby = null;
        if (req.query.sortby) {
            sortby = req.query.sortby;
        }
        
        var sortdir = "asc";
        if (req.query.sortdir && req.query.sortdir.toLowerCase() == "desc") {
            sortdir = "desc";
        }

        if (sortby) {
            result.sort((a, b) => {
                var result = 0;

                if(a[sortby] && b[sortby]) {
                    if (a[sortby] > b[sortby]) {
                        result = 1;
                    } else if (a[sortby] < b[sortby]) {
                        result = -1;
                    }
                } else {
                    if(a[sortby]) {
                        result = 1;
                    } else {
                        result = -1;
                    }
                }

                if (sortdir == "desc") {
                    result = -result;
                }

                return result;
            });
        }
        
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        result = result.slice(skip, limit+1);
        
        res.json(result);
    })
    .post((req, res) => {
        const item = req.body;
        if (!item.id) {
            const idHash = crypto.createHash('sha256');
            idHash.update(crypto.randomBytes(256).toString('base64'));
            item.id = idHash.digest('hex');
        }

        req.orbitDB.put(item).then(hash => {
            res.json({'result': 'true', 'id': item.id });
        })

    });

