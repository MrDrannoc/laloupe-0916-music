import express from 'express';
import Score from '../models/score.js';
/*import Auth from '../middlewares/authorization.js';*/

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

    app.use('/scores', /*Auth.hasAuthorization,*/ router);

};
