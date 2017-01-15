import mongoose from 'mongoose';
import Note from '../models/note.js';

const scoreSchema = new mongoose.Schema({
    nameScore: String,
    levelScore: Number,
    tempoScore: Number,
    wordingScore: String,
    numBitBar: Number,
    referenceValueBar: Number,
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }]
});

let model = mongoose.model('Score', scoreSchema);

export default class Score {

    findAll(req, res) {
        model.find({})
          .populate('notes')
          .exec((err, scores) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    res.json(scores);
                }
            });
    }

    findById(req, res) {
        model.findById(req.params.id)
            .populate('notes')
            .exec((err, score) => {
                    if (err || !score) {
                        res.sendStatus(403);
                    } else {
                        res.json(score);
                    }
                });
    }

    create(req, res) {
        model.create({
                nameScore: req.body.nameScore,
                levelScore: req.body.levelScore,
                tempoScore: req.body.tempoScore,
                wordingScore: req.body.wordingScore,
                numBitBar: req.body.numBitBar,
                referenceValueBar: req.body.referenceValueBar
            },
            (err, score) => {
                if (err) {
                    res.status(500).send(err.message);
                } else {
                    res.json(score);
                }
            });
    }

    update(req, res) {
        model.update({
            _id: req.params.id
        }, {
            nameScore: req.body.nameScore,
            levelScore: req.body.levelScore,
            tempoScore: req.body.tempoScore,
            wordingScore: req.body.wordingScore,
            numBitBar: req.body.numBitBar,
            referenceValueBar: req.body.referenceValueBar
        }, (err, score) => {
            if (err || !score) {
                res.status(500).send(err.message);
            } else {
                res.json(score);
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
    addNoteToScore(req, res) {
        model.findByIdAndUpdate(req.body.score_id, {
                $push: {
                    notes: req.body.note_id
                }
            },
            function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.sendStatus(200);
                }
            });
    }

    deleteNoteFromScore(req, res) {
        model.findByIdAndUpdate(req.body.score_id, {
                $pull: {
                    notes: req.body.note_id
                }
            },
            function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.sendStatus(200);
                }
            });
    }
}
