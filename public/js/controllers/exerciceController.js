function exerciceController(scoreService, noteService, $location, $routeParams, $timeout, $interval) {
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
                    if (this.noteCURRENT.length == this.score.notes.length) {
                        this.noteCURRENT.sort(function(a, b) {
                            return (a.orderNote > b.orderNote) ? 1 : ((b.orderNote > a.orderNote) ? -1 : 0);
                        });
                    }
                });
            }

        });


    };
    this.load();
    this.isPlaying = false;
    this.pulseControl = () => {
        console.log('L\'exercice n\'a pas débuté !');
    };
    this.play = () => {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.tempo = this.score.tempoScore;
            this.beatAtStart = this.score.numBitBar;
            $interval(() => {
                this.beatAtStart--;
                if (this.beatAtStart >= 0) {
                    //Play a beat
                    console.log('I beat one time');
                }
            }, 1 * 60 / this.tempo * 1000, this.score.numBitBar + 1).then(() => {
                angular.element('.redBar').css('transition', '0s linear').css('margin-left', '123px').css('margin-top', '100px');
                let containerWidth = angular.element('.star').width(),
                    containerHeight = Math.floor((angular.element('.star').height() - 300) / 300),
                    currentLen = 101,
                    lineNumber = 0,
                    totalWidth = 0,
                    lineWidth = [0],
                    lineDuration = [0],
                    totalDuration = 0;
                playAt = [];
                let c = 0;
                for (let note of this.noteCURRENT) {
                    playAt.push({
                        when: totalDuration,
                        note: 'assets/midi/' + note.valueNote + '/' + note.heigthNote + '.mid'
                    });
                    currentLen += note.valueNote * 140;
                    totalWidth += note.valueNote * 140;
                    c++;
                    if (currentLen > containerWidth) {
                        currentLen = note.valueNote * 140;
                        lineNumber++;
                        lineDuration[lineNumber] = 0;
                    }
                    lineWidth[lineNumber] = currentLen;
                    totalDuration += note.valueNote * 60 / this.tempo * 1000;
                    lineDuration[lineNumber] += note.valueNote * 60 / this.tempo;
                }
                let last = 0,
                    current = 0;
                this.pulseControl = () => {
                    console.log('L\'exercice a débuté :)');
                };
                for (var i = 0; i <= containerHeight; i++) {
                    $timeout(() => {
                        angular.element('.redBar').css('transition', lineDuration[current] + 's linear').css('margin-left', lineWidth[current] + 'px');
                        $timeout(() => {
                            if (current != lineWidth.length - 1) {
                                current++;
                                angular.element('.redBar').css('transition', '0s').css('margin-left', '0px').css('margin-top', (Number(angular.element('.redBar').css('margin-top').replace(/px/, '')) + 300) + "px");
                            }
                        }, (lineDuration[current]) * 1000);
                    }, last * 1000);
                    last += lineDuration[i] + 0.1;
                }
                for (let note of playAt) {
                    $timeout(() => {
                        console.log('Now listening : ' + note.note);
                    }, note.when);
                }
                $timeout(() => {
                    this.isPlaying = false;
                }, totalDuration);
            });
        }
    };


}
