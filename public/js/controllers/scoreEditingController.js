function scoreEditingController(scoreService, noteService, $location, $routeParams) {
    this.hide = $location.$$url.indexOf('/score/editing/') >= 0 ? true : false;
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;
    this.currentScoreId = $routeParams.id;





    this.verificationdelapartition = () => {
        console.log("Route param : ", $routeParams);
    };

    this.load = () => {

        // Requete sur la partition pour récupérer les notes la première mesure "score.bars[0]"

        this.scoreService.getOne(this.currentScoreId).then((res) => {
            this.score = res.data;
            this.noteCURRENT = [];
            this.numBitBar = this.score.numBitBar;
            this.referenceValueBar = this.score.referenceValueBar;
            console.log("Toutes les notes présentes sur la première mesure ", this.score.notes);

            // Requete sur la partition pour récupérer les notes la première mesure "score.bars[0]"

            for (let note of this.score.notes) {
                this.noteService.getOne(note._id).then((res) => {
                    this.noteCURRENT.push(res.data);
                    console.log(this.noteCURRENT);
                });
            }

        });


    };

    this.load();

    this.barCreate = () => {
        this.barService.create(this.bar).then(() => {
            this.load();
        });
    };

    // this.noteService.create(this.note).then(() => {
    //     this.load();
    // });

    this.addChiffrage = () => {

        if (this.chiffrage == "3x4") {
            this.numBitBar = 3;
            this.referenceValueBar = 4;
        } else {
            this.numBitBar = 4;
            this.referenceValueBar = 4;
        }
        this.scoreService.update(this.currentScoreId, this.numBitBar, this.referenceValueBar).then(() => {
            console.log("Chiffrage ok " + res.data._id);
        });
    };


    this.addNote = (id) => {
        this.noteService.getOne(id).then((res) => {
            this.noteService.getNoteWhereOrderGreaterThanX(this.currentScoreId, res.data.orderNote).then((res2) => {
                this.noteService.create('sol2', '1', res.data.orderNote+1, this.currentScoreId).then((res3) => {
                    this.scoreService.addNoteToScore(this.currentScoreId, res3.data._id).then(() => {
                        this.load();
                    });
                });
            });
        });
    };

    this.deleteNote = (id) => {
        this.noteService.delete(id).then(() => {
            this.delete();
        });
    };
}
