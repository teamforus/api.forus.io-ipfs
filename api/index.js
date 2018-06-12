"use strict";

var express = require('express');
var router = express.Router();
module.exports = router;


const bodyParser = require('body-parser');
router.use(bodyParser.json());

const orbitDB = require('../orbitdb');
router.use(orbitDB.getMiddleware(orbitDB));

router.route('/helloworld-message')
    .get(async (req, res) => {
        res.json({
            "message": req.orbitDB.get("helloworld-message").map(e => e.message)[0] || "Hello world!"
        });
    })
    .put(async (req, res) => {
        const messageContainer = req.body;
        if (!messageContainer.message) {
            res.status(400).send();
        }

        const record = {
            "id": "helloworld-message",
            "message": messageContainer.message
        };
        
        req.orbitDB.put(record)
        .then(hash => {
            res.status(200).send();
        })
        .catch((error => {
            res.status(500).json({"error": error});
        }));
        
    });

router.route('/:resource/:id')
    .get(async (req, res) => {
        var result = req.orbitDB.get(req.params.id).map(e => e);
        if (1 == result.length) {
            res.json(result[0]);
        } else {
            res.status(404).json({});
        }
    })
    .put(async (req, res) => {
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


router.route('/:resource')
    .get(async (req, res) => {
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
    .post(async (req, res) => {
        const item = req.body;
        if (!item.id) {
            res.status(400).send();
        }

        req.orbitDB.put(item).then(hash => {
            res.json({'hash': hash });
        })
    });

