import express from 'express';
import User from '../models/user.js';
import Auth from '../middlewares/authorization.js';

let router = express.Router();

module.exports = (app) => {

    var user = new User();

    app.get('/loggedin', Auth.hasAuthorization, (req, res, next) => {
        res.sendStatus(200);
    });

    app.get('/isadmin', Auth.isAdministrator, (req, res, next) => {
        res.sendStatus(200);
    });

    app.post('/login', user.connect);

    router.get('/', Auth.isAdministrator, user.findAll);

    router.get('/suspend/:id', Auth.isAdministrator, user.suspend);

    router.get('/:id', Auth.hasAuthorization, user.findById);

    router.post('/', Auth.isAdministrator, user.create);

    router.put('/:id', Auth.isAdministrator, user.update);

    router.delete('/:id', Auth.isAdministrator, user.delete);

    app.use('/users', router);

};
