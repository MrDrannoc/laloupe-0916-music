function exerciceController(scoreService, noteService, $location, $routeParams, $timeout) {
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;
    this.currentScoreId = $routeParams.exerciceId;
    function algoRythme(mesureValeur,tempoScore,allNotes) {
        var time;
        var index = 0;
        var interval = 0;
        var tempo = 60 / tempoScore;

        function callback() {
            if (index > allNotes.length - 1) {
                console.log("FIN");
                clearTimeout(time);
            } else {
              console.log(allNotes[index].valueNote);
              
                interval = (allNotes[index].valueNote * 1000)  * tempo;
                time = setTimeout(callback, interval);
                index++;
            }
        }
        time = setTimeout(callback, interval);
    }
    this.play = () => {
        this.scoreService.getOne(this.currentScoreId).then((res) => {
            console.log(res.data);
            this.allNotes = res.data.notes;
            algoRythme(res.data.numBitBar,res.data.tempoScore,this.allNotes);
        });
    };

    this.load = () => {

        // Requete sur la partition pour récupérer les notes la première mesure "score.bars[0]"

        this.scoreService.getOne(this.currentScoreId).then((res) => {
            this.score = res.data;
            this.noteCURRENT = [];
            this.numBitBar = this.score.numBitBar;
            this.referenceValueBar = this.score.referenceValueBar;
            //console.log("Toutes les notes présentes sur la première mesure ", this.score.notes);

            // Requete sur la partition pour récupérer les notes la première mesure "score.bars[0]"

            for (let note of this.score.notes) {
                this.noteService.getOne(note._id).then((res) => {
                    this.noteCURRENT.push(res.data);
                    //console.log(this.noteCURRENT);
                    if (this.noteCURRENT.length == this.score.notes.length) {
                        $timeout(() => {
                            this.mainWidth = 0;
                            for (note of angular.element('.note')) {
                                this.mainWidth += note.width;
                            }
                            angular.element('.btnPlay').onClick(function(){
                              
                            });
                        }, 0);
                    }
                });
            }

        });


    };
    this.load();

}
