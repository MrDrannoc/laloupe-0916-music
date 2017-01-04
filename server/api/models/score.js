import mongoose from 'mongoose';
import Bar from './bar.js';
import Note from './note.js';

const scoreSchema = new mongoose.Schema({
    nameScore: String,
    levelScore: String,
    tempoScore: String,
    bars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bar'
    }],
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }]
});

let model = mongoose.model('Score', scoreSchema);

export default class Score {

    findAll(req, res) {
        model.find({}, (err, scores) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    res.json(scores);
                }
            })
            .populate('bars');
    }

    findById(req, res) {
        model.findById(req.params.id, (err, score) => {
                if (err || !score) {
                    res.sendStatus(403);
                } else {
                    res.json(score);
                }
            })
            .populate('bars');
    }

    create(req, res) {
        model.create({
                tempoScore: req.body.tempoScore
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
            tempoScore: req.body.tempoScore
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
    addBarToScore(score_id, bar_id, res) {
        model.findByIdAndUpdate(score_id, {
                $push: {
                    bars: bar_id
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

    deleteBarFromScore(score_id, bar_id, res) {
        model.findByIdAndUpdate(score_id, {
                $pull: {
                    bars: bar_id
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
