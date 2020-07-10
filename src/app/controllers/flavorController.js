
const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Flavor = require('../models/flavor');


const router = express.Router();

router.use(authMiddleware);


router.post('/register', async (req, res) => {
    try {
        const flavor = await Flavor.create(req.body);
        return res.send({ flavor });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error register Flavor' });
    }
});

router.put('/:flavorId', async (req, res) => {
    try {
        const { name, description, value, ingredients } = req.body;

        const flavor = await Flavor.findByIdAndUpdate(req.params.flavorId, { name, description, value, ingredients });
        flavor.save();
        return res.send({ flavor });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error updating new flavor' });
    }
});

router.get('/', async (req, res) => {

    try {
        const flavor = await Flavor.find({});
        return res.send({ flavor });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error loading flavor' });
    }
});

router.delete('/:flavorId', async (req, res) => {
    try {
        await Flavor.findByIdAndRemove(req.params.flavorId);
        return res.send();
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error deleting flavor' });
    }
});

router.get('/:flavorId', async (req, res) => {

    try {
        const flavor = await Flavor.findById(req.params.flavorId);
        return res.send({ flavor });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error loading flavor' });
    }
});

module.exports = app => app.use('/flavor', router);