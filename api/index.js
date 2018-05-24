"use strict";

var express = require('express');
var router = express.Router();
module.exports = router;


const bodyParser = require('body-parser');
router.use(bodyParser.json());

const orbitDB = require('../orbitdb');
router.use(orbitDB.getMiddleware(orbitDB));

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
    .post(async (req, res) => {
        const item = req.body;
        if (!item.id) {
            res.status(400).send();
        }

        req.orbitDB.put(item).then(hash => {
            res.json({'hash': hash });
        })
    });

