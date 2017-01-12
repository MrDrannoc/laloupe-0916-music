function scoreController(scoreService, noteService, $location, $routeParams) {
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;


    this.scoreCreate = (score) => {
        this.scoreService.create(score.nameScore, score.levelScore, score.tempoScore, score.wordingScore).then((res) => {

            this.currentScore = res.data._id;
            console.log(res.data._id);
            console.log("PARTITION OK");
            this.numBitBar = 4;
            this.referenceValueBar = 4;
            this.orderBar = 1;

            this.barService.create(this.numBitBar, this.referenceValueBar, this.orderBar).then((res) => {

                this.currentBar = res.data._id;
                console.log(res.data._id);
                console.log("BAR VIDE OK");
                this.scoreService.addBarToScore(this.currentScore, this.currentBar).then(() => {
                    console.log("Ajout mesure dans partition");
                    this.$location.path('/score/editing/'+this.currentScore);
                });
                this.noteService.create("sol2", "noire", 1).then((res) => {
                    this.currentNote = res.data._id;



                    console.log("Id de la nouvelle note créée " + res.data._id);

                    // Ajout de la note dans la mesure récupérée

                    this.barService.addNoteToBar(this.currentBar, this.currentNote).then(() => {
                        console.log("Ajout Note dans Mesure OK");
                    });

                });
            });
        });
        //
        // this.scoreService.addBarToScore(score._id,)
    };

    this.scoreDelete = (id) => {
        this.scoreService.delete(id).then(() => {
            this.load();
        });
    };

    this.scoreChoice = (id) => {
        this.$location.path('/score/editing/'+id);
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
  }
