import mongoose from 'mongoose';
import Score from './score.js';
import Bar from './bar.js';
var Schema=mongoose.Schema;

const noteSchema = new mongoose.Schema({
    heigthNote: String,
    valueNote: String,
    urlNote: String,
    score: {
        type: Schema.Types.ObjectId,
        ref: 'Score'
    },
    bar: {
        type: Schema.Types.ObjectId,
        ref: 'Bar'
    }
});

let model = mongoose.model('Note', noteSchema);

export default class Note {

    findAll(req, res) {
        model.find({}, (err, notes) => {
            if (err) {
                res.sendStatus(403);
            } else {
                res.json(notes);
            }
        });
    }

    findById(req, res) {
        model.findById(req.params.id, (err, note) => {
            if (err || !note) {
                res.sendStatus(403);
            } else {
                res.json(note);
            }
        });
    }

    create(req, res) {
        model.create({
                heigthNote: req.body.heigthNote,
                valueNote: req.body.valueNote,
                urlNote: req.body.urlNote
            },
            (err, note) => {
                if (err) {
                    res.status(500).send(err.message);
                } else {
                    res.json(note);
                }
            });
    }

    update(req, res) {
        model.update({
            _id: req.params.id
        }, {
            heigthNote: req.body.heigthNote,
            valueNote: req.body.valueNote,
            urlNote: req.body.urlNote
        }, (err, note) => {
            if (err || !note) {
                res.status(500).send(err.message);
            } else {
                res.json(note);
            }
        });
    }

    delete(req, res) {
        model.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.sendStatus(200);
            }
        });
    }
}
