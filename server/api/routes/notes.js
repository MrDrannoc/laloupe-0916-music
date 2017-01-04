import express from 'express';
import Note from '../models/note.js';
/*import Auth from '../middlewares/authorization.js';*/

let router = express.Router();

module.exports = (app) => {

    var note = new Note();

    router.get('/', note.findAll);

    router.get('/:id', note.findById);

    router.post('/', note.create);

    router.put('/:id', note.update);

    router.delete('/:id', note.delete);

    app.use('/notes', /*Auth.hasAuthorization,*/ router);

};
