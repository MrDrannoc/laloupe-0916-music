function duplicController(scoreService, noteService, $location, $routeParams) {
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;
    this.copy = {};



    this.duplic = (name) => {
        this.newName = this.nameScoreDuplic;
        this.scoreService.getOne(this.id).then((res) => {
            this.copy = res.data;
            this.originScoreId = res.data._id;
            this.originScore = res.data;
            this.currentNoteId = "";
            this.scoreService.create(this.newName, this.copy.levelScore, this.copy.tempoScore, this.copy.wordingScore).then((res0) => {
                this.duplicScoreId = res0.data._id;
                this.duplicScore = res0.data;
            });
            for (let o = 0; o < this.originScore.notes.length; o++) {
                this.noteService.getOne(this.originScore.notes[o]._id).then((res1) => {
                    this.noteService.create(res1.data.heigthNote, res1.data.valueNote, res1.data.orderNote).then((res2) => {
                        this.currentNoteId = res2.data._id;
                        this.scoreService.addNoteToScore(this.duplicScoreId, res2.data._id).then((res) => {});
                    });
                });
            }
        });
    };
    this.load = () => {
        this.scoreService.getAll().then((res) => {
            this.scores = res.data;
        });
    };

    this.load();
}
