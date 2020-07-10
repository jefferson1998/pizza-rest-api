const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Request = require('../models/request');
const Pizza = require('../models/pizza');
const router = express.Router();

router.use(authMiddleware);

router.post('/register', async (req, res) => {
    try {
        const { value, discount, pizzas } = req.body;
        const request = await Request.create({ value, discount });

        await Promise.all(pizzas.map(async pizza => {
            const requestPizza = new Pizza({ ...pizza, request: request._id });

            await requestPizza.save();

            request.pizzas.push(requestPizza);
        }));

        await request.save();

        return res.send({ request });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error creating new request' });
    }
});

router.put('/:requestId', async (req, res) => {
    try {
        const { value, discount, pizzas } = req.body;
        const request = await Request.findByIdAndUpdate(req.params.requestId, {
            value, discount
        }, { new: true });

        request.pizzas = [];

        await Pizza.remove({ request: request._id });


        await Promise.all(pizzas.map(async pizza => {
            const requestPizza = Pizza({ ...pizza, request: request._id });

            await requestPizza.save();

            request.pizzas.push(requestPizza);
        }));

        await request.save();

        return res.send({ request });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error update new request' });
    }
});

router.delete('/:requestId', async (req, res) => {
    try {
        await Request.findByIdAndRemove(req.params.requestId);
        return res.send();
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error deleting request' });
    }
});

router.get('/', async (req, res) => {

    try {
        const requests = await Request.find().populate(['pizzas']);
        return res.send({ requests });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error loading requests' });
    }
});

router.get('/:requestId', async (req, res) => {

    try {
        const request = await Request.findById(req.params.requestId);
        return res.send({ request });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error loading request' });
    }
});


module.exports = app => app.use('/request', router);