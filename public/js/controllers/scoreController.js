function scoreController(scoreService, noteService, $location, $routeParams) {
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;
    this.numBitBar = 4;
    this.referenceValueBar = 4;

    this.scoreCreate = (score) => {
        this.scoreService.create(score.nameScore, score.levelScore, score.tempoScore, score.wordingScore, this.numBitBar, this.referenceValueBar).then((res) => {

            this.currentScore = res.data._id;
            console.log("PARTITION OK");
            this.orderNote = 1;
            this.noteService.create("sol2", 1, 1).then((res) => {
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

    this.scoreDelete = (id) => {
        this.scoreService.delete(id).then(() => {
            this.load();
        });
    };

    this.scoreChoice = (id) => {
        this.$location.path('/score/editing/'+id);
    };


    this.load = () => {
        this.scoreService.getAll().then((res) => {
            this.scores = res.data;
        });
    };

    this.load();
  }
