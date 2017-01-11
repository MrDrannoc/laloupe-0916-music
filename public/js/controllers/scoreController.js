function scoreController(scoreService, noteService, $location, $routeParams) {
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;
    this.numBitBar = 4;
    this.referenceValueBar = 4;

    this.scoreCreate = (score) => {
        this.scoreService.create(score.nameScore, score.levelScore, score.tempoScore, score.wordingScore, this.score.numBitBar, this.score.referenceValueBar).then((res) => {

            this.currentScore = res.data._id;
            console.log("PARTITION OK");
            this.orderNote = 1;
            this.noteService.create("sol2", "noire", 1).then((res) => {
                this.currentNote = res.data._id;
                console.log("Id de la nouvelle note créée " + res.data._id);

                // Ajout de la note dans la mesure récupérée

                this.scoreService.addNoteToScore(this.currentScore, this.currentNote).then(() => {
                    console.log("Ajout Note dans Partition OK");
                    this.$location.path('/score/editing/' + this.currentScore);
                });

            });
        });
    };
//
// this.scoreService.addBarToScore(score._id,)

this.scoreChoice = (id) => {
    console.log(id)
    this.$location.path('/score/editing/' + id);
};



this.verificationdelapartition = () => {
    console.log($routeParams.id);
};

this.load = () => {
    this.scoreService.getAll().then((res) => {
        this.scores = res.data;
    });
};

this.load();

this.barCreate = () => {
    this.barService.create(this.bar).then(() => {
        this.load();
    });
};
this.noteCreate = () => {
    this.noteService.create(this.note).then(() => {
        this.load();
    });
};
}
