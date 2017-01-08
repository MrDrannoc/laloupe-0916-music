import express from 'express';
import Bar from '../models/bar.js';
/*import Auth from '../middlewares/authorization.js';*/

let router = express.Router();

module.exports = (app) => {

    var bar = new Bar();

    router.get('/', bar.findAll);

    router.get('/:id', bar.findById);

    router.post('/', bar.create);

    router.put('/bar/', bar.addNoteToBar);

    router.put('/:id', bar.update);

    router.delete('/:id', bar.delete);

    app.use('/bars', /*Auth.hasAuthorization,*/ router);

};
