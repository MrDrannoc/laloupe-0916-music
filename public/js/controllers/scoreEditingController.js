function scoreEditingController(scoreService, noteService, $location, $routeParams) {
    this.hide = $location.$$url.indexOf('/score/editing/') >= 0 ? true : false;
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;
    this.currentScoreId = $routeParams.id;


    this.scoreChoice = (id) => {
        console.log(id)
        this.$location.path('/score/editing/' + id);
    };



    this.verificationdelapartition = () => {
        console.log(this.currentScoreId);
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
                    console.log("Notes de la partition ", this.noteCURRENT);

                })
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

        // Requete sur la partition pour récupérer la première mesure "score.bars[0]"
        this.currentNoteId = id;
        console.log("Valeur de la note : " + this.noteValue + " | Hauteur de la note : " + this.noteHeigth);


        this.noteService.getOne(this.currentNoteId).then((res) => {


            // Incrémentation de l'ordre de la note
            this.currentNoteOrder = res.data.orderNote + 1;
            console.log("Ordre de cette putain de current note : " + this.currentNoteOrder)


            this.noteService.getNoteWhereOrderGreaterThanX(this.currentScoreId, this.currentNoteOrder).then((res) => {

                // Création de la note avec les valeurs saisies dans les select
                this.noteValue = Number(this.noteValue);

                this.noteService.create(this.noteHeigth, this.noteValue, this.currentNoteOrder).then((res) => {

                    this.currentNoteId = res.data._id;

                    // Ajout de la note dans la mesure récupérée

                    this.scoreService.addNoteToScore(this.currentScoreId, this.currentNoteId).then(() => {
                    });

                });


            })
        })

    };

    this.deleteNote = (id) => {
        this.noteService.delete(id).then(() => {
            this.delete();
        });
    };
}
