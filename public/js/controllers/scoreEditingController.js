function scoreEditingController(scoreService, noteService, $location, $routeParams) {
    this.hide = $location.$$url.indexOf('/score/editing/') >= 0 ? true : false;
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;
    this.currentScoreId = $routeParams.scoreId;

    this.verificationdelapartition = () => {
        console.log("Route param : ", $routeParams);
    };

    this.load = () => {

        // Requete sur la partition pour récupérer les notes

        this.scoreService.getOne(this.currentScoreId).then((res) => {
            this.score = res.data;
            this.noteCURRENT = [];
            this.numBitBar = this.score.numBitBar;
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

    this.addChiffrage = () => {

        if (this.chiffrage == "3x4") {
            this.numBitBar = 3;
            this.referenceValueBar = 4;
        } else {
            this.numBitBar = 4;
            this.referenceValueBar = 4;
        }
        this.scoreService.update(this.currentScoreId, this.numBitBar, this.referenceValueBar).then(() => {});
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
