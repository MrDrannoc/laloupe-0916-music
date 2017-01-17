import express from 'express';
import Note from '../models/note.js';
import Auth from '../middlewares/authorization.js';

let router = express.Router();

module.exports = (app) => {

    var note = new Note();

    router.get('/', note.findAll);

    router.get('/:id', note.findById);

    router.post('/', Auth.isAdministrator, note.create);

    router.put('/note', Auth.isAdministrator, note.getNoteWhereOrderGreaterThanXAndInc);

    router.put('/decNote', Auth.isAdministrator, note.getNoteWhereOrderGreaterThanXAndDec);

    router.put('/:id', Auth.isAdministrator, note.update);

    router.delete('/:id', Auth.isAdministrator, note.delete);

    app.use('/notes', Auth.hasAuthorization, router);

};
