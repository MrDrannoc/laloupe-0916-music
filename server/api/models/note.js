import mongoose from 'mongoose';
import Score from './score.js';

const noteSchema = new mongoose.Schema({
    heigthNote: String,
    valueNote: Number,
    orderNote: Number,
    score: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Score'
    }
});

let model = mongoose.model('Note', noteSchema);

export default class Note {

    findAll(req, res) {
        console.log("ouplaboom");
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
                orderNote: req.body.orderNote,
                score: req.body.score
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
            orderNote: req.body.orderNote
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

    getNoteWhereOrderGreaterThanX(req, res) {
        console.log("id lors de la requete : " + req.body.score_id);
        let numTmp = req.body.note_Order;
        model.update({
                score: req.body.score_id,
                orderNote: {
                    $gt: numTmp
                }
            }, {
                $inc: {
                    orderNote: 1
                }
            },
            { multi: true },
            (err, notes) => {
                if (err) {
                    res.status(500).send(err.message);
                } else {
                    res.sendStatus(200);
                }
            });
    }
}
