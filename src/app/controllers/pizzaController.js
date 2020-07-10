
const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Pizza = require('../models/pizza');

const router = express.Router();

router.use(authMiddleware);

router.post('/register', async (req, res) => {
    try {
        const pizza = await Pizza.create(req.body);
        return res.send({ pizza });
    } catch (err) {
        console.log("id" + req.flavorId);
        console.log(err);
        return res.status(400).send({ error: 'Error creating pizza' });
    }
});

router.put('/:pizzaId', async (req, res) => {
    try {

        const { name, flavor, request } = req.body;
        const pizza = await (await Pizza.findByIdAndUpdate(req.params.pizzaId, { name, flavor, request }));

        return res.send({ pizza });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error creating new pizza' });
    }
});

router.put('/:pizzaId', async (req, res) => {
    try {
        const { name, flavor, request } = req.body;
        const pizza = await Pizza.findByIdAndUpdate(req.params.pizzaId, {
            name, flavor, request
        }, { new: true });

        pizza.flavor = [];

        await Pizza.remove({ flavor: flavor._id });


        await Promise.all(flavor.map(async flavor => {
            const pizzaFlavor = Pizza({ flavor });

            await pizzaFlavor.save();

            pizza.flavor.push(pizzaFlavor);
        }));

        await pizza.save();

        return res.send({ pizza });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error update new request' });
    }
});


router.get('/', async (req, res) => {

    try {
        const pizza = await Pizza.find({});
        return res.send({ pizza });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error loading pizza' });
    }
});
router.delete('/:pizzaId', async (req, res) => {
    try {
        await Pizza.findByIdAndRemove(req.params.pizzaId);
        return res.send();
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error deleting pizza' });
    }
});

router.get('/:pizzaId', async (req, res) => {

    try {
        const pizza = await Pizza.findById(req.params.pizzaId);
        return res.send({ pizza });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error loading pizza' });
    }
});


module.exports = app => app.use('/pizza', router);