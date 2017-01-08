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
        this.scoreService.getOne(this.currentScoreId).then((res) => {
            this.score = res.data;
            this.noteCURRENT = [];
            this.numBitBar = this.score.bars[0].numBitBar;
            this.referenceValueBar = this.score.bars[0].referenceValueBar;
            console.log("kikoo " + this.score.bars[0].notes);
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


    this.addChiffrage = () => {
      this.scoreService.getOne(this.currentScoreId).then((res) => {
          this.score = res.data;
      });
      this.currentBar = this.score.bars[0]._id;
      if(this.chiffrage == "3x4"){
        this.numBitBar = 3;
        this.referenceValueBar = 4;
      } else {
        this.numBitBar = 4;
        this.referenceValueBar = 4;
      }
        this.barService.update(this.currentBar,this.numBitBar, this.referenceValueBar).then(() => {
            console.log("Chiffrage ok " + res.data._id);
        });
    };

    this.addNote = () => {
        console.log(this.noteValue + " | " + this.noteHeigth);
        this.scoreService.getOne(this.currentScoreId).then((res) => {
            this.score = res.data;
        });
        this.currentBar = this.score.bars[0]._id;
        console.log("La BARRE " + this.score.bars[0]._id);
        this.noteService.create(this.noteHeigth, this.noteValue, 1).then((res) => {

            this.currentNote = res.data._id;
            console.log("Nouvelle note " + res.data._id);
            this.barService.addNoteToBar(this.currentBar, this.currentNote).then(() => {
                console.log("Ajout Note dans Mesure");
            });
        });
    };
}
