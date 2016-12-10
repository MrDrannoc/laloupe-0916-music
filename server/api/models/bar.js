import mongoose from 'mongoose';
var Score = require('testScore.js');
var Note = require('testNote.js');

const barSchema = new mongoose.Schema({
    numBitBar: String,
    referenceValueBar: String,
    score: {
        type: Schema.Types.ObjectId,
        ref: 'Score'
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }]
});

let model = mongoose.model('Bar', barSchema);

export default class Bar {

    findAll(req, res) {
        model.find({}, (err, bars) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    res.json(bars);
                }
            })
            .populate('notes');
    }

    findById(req, res) {
        model.findById(req.params.id, (err, bar) => {
                if (err || !bar) {
                    res.sendStatus(403);
                } else {
                    res.json(bar);
                }
            })
            .populate('notes');
    }

    create(req, res) {
        model.create({
                numBitBar: req.body.numBitBar,
                referenceValueBar: req.body.referenceValueBar,
                notes: req.body.notes
            },
            (err, bar) => {
                if (err) {
                    res.status(500).send(err.message);
                } else {
                    res.json(bar);
                }
            });
    }

    update(req, res) {
        model.update({
            _id: req.params.id
        }, {
            numBitBar: req.body.numBitBar,
            referenceValueBar: req.body.referenceValueBar
        }, (err, bar) => {
            if (err || !bar) {
                res.status(500).send(err.message);
            } else {
                res.json(bar);
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
        })
    }

    addNoteToBar(bar_id, note_id, res) {
        model.findByIdAndUpdate(note_id, {
                $push: {
                    notes: note_id
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

    deleteNoteFromBar(bar_id, note_id, res) {
        model.findByIdAndUpdate(bar_id, {
                $pull: {
                    notes: note_id
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
