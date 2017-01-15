import express from 'express';
import Score from '../models/score.js';
import Auth from '../middlewares/authorization.js';

let router = express.Router();

module.exports = (app) => {

    var score = new Score();

    router.get('/', score.findAll);

    router.get('/:id', score.findById);

    router.post('/', score.create);

    router.put('/addNoteToScore/', score.addNoteToScore);

    router.put('/deleteNoteFromScore/', score.deleteNoteFromScore);

    router.put('/:id', score.update);

    router.delete('/:id', score.delete);

    app.use('/scores', router);

    // router.post('/', Auth.isAdministrator, score.create);
    //
    // router.put('/addNoteToScore/', Auth.isAdministrator, score.addNoteToScore);
    //
    // router.put('/deleteNoteFromScore/', Auth.isAdministrator, score.deleteNoteFromScore);
    //
    // router.put('/:id', Auth.isAdministrator, score.update);
    //
    // router.delete('/:id', Auth.isAdministrator, score.delete);
    //
    // app.use('/scores', Auth.hasAuthorization, router);

};
