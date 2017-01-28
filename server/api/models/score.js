import mongoose from 'mongoose';
import Note from '../models/note.js';
var Midi = require('jsmidgen');
var fs = require('fs');
var btoa = require('btoa');

function noteiconv(note) {
    let iconv = {
        "do": "c",
        "si": "b",
        "la": "a",
        "so": "g",
        "fa": "f",
        "mi": "e",
        "re": "d"
    }
    if (note.substr(-1) <= 3 && note.substr(-1) >= 1 && ['do', 're', 'mi', 'fa', 'so', 'la', 'si'].indexOf(note.substring(0, 2)) != -1) {
        note = iconv[note.substring(0, 2)] + note.substr(-1);
    }
    return note;
}

const scoreSchema = new mongoose.Schema({
    nameScore: String,
    levelScore: Number,
    tempoScore: Number,
    wordingScore: String,
    numBeatBar: Number,
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

    generateMidi(req, res) {
        model.findById(req.params.id)
            .populate('notes')
            .exec((err, score) => {
                if (err || !score) {
                    res.sendStatus(403);
                } else {
                    var file = new Midi.File();
                    var track = new Midi.Track();
                    file.addTrack(track);
                    track.setTempo(score.tempoScore);
                    track.addNote(0,'c4',128);
                    score.notes.sort(function(a, b) {
                        return (a.orderNote > b.orderNote) ? 1 : ((b.orderNote > a.orderNote) ? -1 : 0);
                    }).forEach(function(note) {
                        if (note.valueNote < 5) {
                            track.addNote(0, noteiconv(note.heigthNote), (128 * note.valueNote));
                        }
                    });
                    let b64mid = btoa(file.toBytes());
                    res.send(b64mid);
                }
            });
    }

    create(req, res) {
        model.create({
                nameScore: req.body.nameScore,
                levelScore: req.body.levelScore,
                tempoScore: req.body.tempoScore,
                wordingScore: req.body.wordingScore,
                numBeatBar: req.body.numBeatBar,
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
        }, (err, score) => {
            if (err || !score) {
                res.status(500).send(err.message);
            } else {
                res.json(score);
            }
        });
    }


    updateChiffrage(req, res) {
        model.update({
            _id: req.params.id
        }, {
            numBeatBar: req.body.numBeatBar,
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
