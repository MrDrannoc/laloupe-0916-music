function scoreEditingController(scoreService, barService, noteService, $location, $routeParams) {
    this.scoreService = scoreService;
    this.barService = barService;
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

            console.log("Toutes les notes présentes sur la première mesure " + this.score.bars[0].notes);

            // Requete sur la partition pour récupérer les notes la première mesure "score.bars[0]"

            for (let note of this.score.bars[0].notes) {
                this.noteService.getOne(note).then((res) => {
                    this.noteCURRENT.push(res.data);
                    console.log(this.noteCURRENT);
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


    this.addNote = () => {

        // Requete sur la partition pour récupérer la première mesure "score.bars[0]"

        console.log("Valeur de la note : " + this.noteValue + " | Hauteur de la note : " + this.noteHeigth);

        this.scoreService.getOne(this.currentScoreId).then((res) => {
            this.score = res.data;
        });

        this.currentBar = this.score.bars[0]._id;

        // Création de la note avec les valeurs saisies dans les select

        console.log("Id de la mesure utilisée  " + this.currentBar);

        this.noteService.create(this.noteHeigth, this.noteValue, 1).then((res) => {
            this.currentNote = res.data._id;

            console.log("Id de la nouvelle note créée " + res.data._id);

            // Ajout de la note dans la mesure récupérée

            this.barService.addNoteToBar(this.currentBar, this.currentNote).then(() => {
                console.log("Ajout Note dans Mesure OK");
            });

        });
    };
}
