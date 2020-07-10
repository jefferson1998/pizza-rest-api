const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth.json');

const Client = require('../models/client');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {
    const { cpf } = req.body;
    try {
        if (await Client.findOne({ cpf }))
            return res.status(400).send({ error: 'Client already exists' });

        const client = await Client.create(req.body);

        client.password = undefined;

        return res.send({
            client,
            token: generateToken({ id: client.id }),
        });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { cpf, password } = req.body;

    const client = await Client.findOne({ cpf }).select('+password');

    if (!client)
        return res.status(400).send({ error: 'Client not found' });

    if (!await bcrypt.compare(password, client.password))
        return res.status(400).send({ error: 'Invalid password' });

    client.password = undefined;



    res.send({
        client,
        token: generateToken({ id: client.id }),
    });
});

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const client = await Client.findOne({ email });

        if (!client)
            return res.status(400).send({ error: 'Client not found' });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await Client.findByIdAndUpdate(client.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email,
            from: '011212',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            if (err)
                console.log(err);
            return res.status(400).send({ error: 'Cannot send forgot password email' });

            return res.send();
        });
        console.log(token, now);
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: 'Error on forgot password, try again' });
    }
})

module.exports = app => app.use('/auth', router);