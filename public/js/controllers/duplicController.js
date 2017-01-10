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
        this.originScoreId = res.data._id;
        this.originScore = res.data;
        console.log(this.originScore);
        this.currentScore = "";
        this.copy.nameScore = this.newName;
        this.scoreService.create(this.copy.nameScore, this.copy.levelScore, this.copy.tempoScore, this.copy.wordingScore).then((res) => {
            this.duplicScoreId = res.data._id;
            this.duplicScore = res.data;
            console.log(this.duplicScore);
        });
        for(let i = 0; i < this.originScore.bars.length;i++){
          this.barService.create(this.originScore.bars[i].numBitBar, this.originScore.bars[i].referenceValueBar, this.originScore.bars[i].orderBar).then((res) => {
              this.currentBarId = res.data._id;
              this.scoreService.addBarToScore(this.duplicScoreId,this.currentBarId).then((res) => {
              });
          });
          for(let o = 0; o < this.originScore.bars[i].notes.length;o++){
            this.noteService.getOne(this.originScore.bars[i].notes[o]).then((res) => {
              this.noteService.create(res.data.heigthNote,res.data.valueNote,res.data.orderNote).then((res) => {
                  console.log(res.data);
                 this.barService.addNoteToBar(this.currentBarId, res.data).then((res) => {
                });
             });
            });
          }
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
