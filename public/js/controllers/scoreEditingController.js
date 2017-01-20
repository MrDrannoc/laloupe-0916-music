function scoreEditingController(scoreService, noteService, $location, $routeParams) {
    this.hide = $location.$$url.indexOf('/score/editing/') >= 0 ? true : false;
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;
    this.currentScoreId = $routeParams.scoreId;


    this.verificationdelapartition = () => {
        console.log("Route param : ", $routeParams);
        MIDIjs.play('./assets/midi/bobby_sharp_unchain_my_heart.mid');
    };

    this.load = () => {
        this.hide = $location.$$url.indexOf('/score/editing/') >= 0;
        // Requete sur la partition pour récupérer les notes

        this.scoreService.getOne(this.currentScoreId).then((res) => {
            this.score = res.data;
              console.log(this.score);
            this.noteCURRENT = [];
            this.numBeatBar = this.score.numBeatBar;
            this.referenceValueBar = this.score.referenceValueBar;
            console.log("Toutes les notes présentes", this.score.notes);

            // Ajout des notes de la partition dans le tableau noteCURRENT

            for (let note of this.score.notes) {
                this.noteService.getOne(note._id).then((res) => {
                    this.noteCURRENT.push(res.data);
                });
            }
            console.log(this.noteCURRENT);
        });


    };

    this.load();

    this.editScore = () => {
        if (this.score.nameScore === undefined || this.score.levelScore === undefined || this.score.tempoScore === undefined || this.score.wordingScore === undefined) {
            alert("Partition non mise à jour, certains champs n'ont pas été complété");
        } else {
            this.scoreService.update(this.currentScoreId, this.score.nameScore, this.score.levelScore, this.score.tempoScore, this.score.wordingScore).then(() => {
                this.load();
            });
        }
    };

    this.addChiffrage = () => {

        if (this.chiffrage == "3x4") {
            this.numBeatBar = 3;
            this.referenceValueBar = 4;
        } else {
            this.numBeatBar = 4;
            this.referenceValueBar = 4;
        }
        this.scoreService.updateChiffrage(this.currentScoreId, this.numBeatBar, this.referenceValueBar).then(() => {});
    };


    this.addNote = (id) => {
        this.noteService.getOne(id).then((res) => {
            this.noteService.getNoteWhereOrderGreaterThanXAndInc(this.currentScoreId, res.data.orderNote).then(() => {
                this.noteService.create('sol2', '1', res.data.orderNote + 1, this.currentScoreId).then((res2) => {
                    this.scoreService.addNoteToScore(this.currentScoreId, res2.data._id).then(() => {
                        this.load();
                    });
                });
            });
        });
    };

    this.editNote = (note) => {
        this.noteService.update(note._id, note).then(() => {
            this.load();
        });
    };

    this.deleteNote = (id) => {
        if (this.noteCURRENT.length > 1) {
            this.noteService.getOne(id).then((res) => {
                this.noteService.getNoteWhereOrderGreaterThanXAndDec(this.currentScoreId, res.data.orderNote).then(() => {
                    this.scoreService.deleteNoteFromScore(this.currentScoreId, res.data._id).then(() => {
                        this.noteService.delete(res.data._id).then(() => {
                            this.load();
                        });
                    });
                });
            });
        }
    };


}
