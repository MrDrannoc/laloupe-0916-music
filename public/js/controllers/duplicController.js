function duplicController(scoreService, barService, noteService, $location, $routeParams) {
    this.scoreService = scoreService;
    this.barService = barService;
    this.noteService = noteService;
    this.$location = $location;
    this.copy = {};



    this.duplic = (name) => {
      this.newName = this.nameScoreDuplic;
      this.scoreService.getOne(this.id).then((res)=>{
        this.copy = res.data;
        this.copy.nameScore = this.newName;
        this.scoreService.create(this.copy.nameScore, this.copy.levelScore, this.copy.tempoScore, this.copy.wordingScore).then((res) => {

            this.currentScore = res.data._id;
            this.numBitBar = 0;
            this.referenceValueBar = 0;
            this.orderBar = 1;

            this.barService.create(this.numBitBar, this.referenceValueBar, this.orderBar).then((res) => {

                this.currentBar = res.data._id;
                this.scoreService.addBarToScore(this.currentScore, this.currentBar).then(() => {
                    console.log("Ajout mesure dans partition");
                });
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
