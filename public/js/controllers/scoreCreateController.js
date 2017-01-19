function scoreCreateController(scoreService, noteService, $location, $routeParams) {
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;
    this.numBeatBar = 4;
    this.referenceValueBar = 4;

    this.scoreCreate = (score) => {
        this.scoreService.create(score.nameScore, score.levelScore, score.tempoScore, score.wordingScore, this.numBeatBar, this.referenceValueBar).then((res) => {

            this.currentScore = res.data._id;
            this.orderNote = 1;
            this.noteService.create("sol2", 1, 1,this.currentScore).then((res) => {
                this.currentNote = res.data._id;

                this.scoreService.addNoteToScore(this.currentScore, this.currentNote).then(() => {
                    this.$location.path('/score/editing/' + this.currentScore);
                });

            });
        });
    };

    this.load = () => {
        this.scoreService.getAll().then((res) => {
            this.scores = res.data;
        });
    };

    this.load();
  }
