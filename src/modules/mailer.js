const nodemailer = require('nodemailer');
const path = require('path');
const { host, port, user, pass } = require('../config/mailer.json');
const hbs = require('nodemailer-express-handlebars');

var transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass,
    }
});

transport.use('compile', hbs({
    viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve('./resources/mail/')
    },
    viewPath: path.resolve('./resources/mail/'),
    extName: '.html',
}));

module.exports = transport;