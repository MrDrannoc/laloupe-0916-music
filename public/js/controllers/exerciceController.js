function exerciceController(scoreService, noteService, $location, $routeParams, $timeout, $interval, $scope) {
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;
    this.currentScoreId = $routeParams.exerciceId;
    this.load = () => {
        this.scoreService.getOne(this.currentScoreId).then((res) => {
            this.score = res.data;
            this.noteCURRENT = [];
            this.numBeatBar = this.score.numBeatBar;
            this.referenceValueBar = this.score.referenceValueBar;
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
    this.wrongNote = () => {
        if (this.isPlaying) {
            this.errors++;
        }
    }
    this.play = () => {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.tempo = this.score.tempoScore;
            this.beatAtStart = this.score.numBeatBar;
            this.metronome();
            $interval(() => {
                this.beatAtStart--;
                if (this.beatAtStart >= 0) {
                    //Play a beat
                    console.log('I beat one time');
                }
            }, 1 * 60 / this.tempo * 1000, this.score.numBeatBar).then(() => {
                angular.element('.redBar').css('opacity', '1');
                angular.element('.redBar').css('transition', '0s linear').css('margin-left', '123px').css('margin-top', '100px');
                let containerWidth = angular.element('.star').width(),
                    containerHeight = Math.floor((angular.element('.star').height() - 300) / 300),
                    currentLen = 101,
                    lineNumber = 0,
                    totalWidth = 0,
                    lineWidth = [0],
                    lineDuration = [0],
                    totalDuration = 0,
                    playAt = [],
                    pulses = [],
                    beat = 0,
                    microtimeStart = new Date().getTime(),
                    start = microtimeStart;
                this.errors = 0;
                this.endTime = 0;
                let c = 0;
                for (let note of this.noteCURRENT) {
                    if (note.valueNote < 5) {
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
                        beat += Number(note.valueNote);
                        for (let i = beat; i >= 1; i--) {
                            beat--;
                            pulses.push({
                                start: start,
                                end: start + (60 / this.tempo * 1000),
                                validated: false
                            });
                            start += (60 / this.tempo * 1000);
                        }
                    }
                }
                let last = 0,
                    current = 0;
                this.pulseControl = () => {
                    console.log('L\'exercice a débuté :)');
                    let clickAt = new Date().getTime();
                    if (pulses.filter((p) => {
                            return !p.validated && p.start < clickAt && p.end > clickAt;
                        }).length == 1) {
                        console.log('PERFECT !');
                        pulses.map((p) => {
                            if (!p.validated && p.start < clickAt && p.end > clickAt) {
                                p.validated = true;
                                angular.element('#flash').addClass('green');
                                $timeout(function() {
                                  angular.element('#flash').removeClass("green");
                                }, 300);
                                angular.element('#flash').html('<p>'+['Super','YES','Bravo'][(Math.floor(Math.random() * (3 - 1 + 1)) + 1)-1]+' !</p>');
                                $timeout(function() {
                                  angular.element('#flash').html("");
                                }, 300);

                            }
                            return p;
                        });
                    } else {
                        console.log(':\'( T\'ES NUL LA LOUTRE ! (' + pulses.filter((p) => {
                            return !p.validated && p.start < clickAt && p.end > clickAt;
                        }).length + ' validés)');
                        this.errors++;
                        angular.element('#flash').addClass('red');
                        $timeout(function() {
                          angular.element('#flash').removeClass("red");
                        }, 300);
                        angular.element('#flash').html('<p>'+['Dommage','Manqué','Non'][(Math.floor(Math.random() * (3 - 1 + 1)) + 1)-1]+' !</p>');
                        $timeout(function() {
                          angular.element('#flash').html("");
                        }, 300);

                    }
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
                    last += lineDuration[i] + 0.05;
                }
                // for (let note of playAt) {
                //     $timeout(() => {
                //         console.log('Now listening : ' + note.note);
                //         MIDIjs.play(note.note);
                //     }, note.when);
                // }
                $timeout(() => {
                    this.isPlaying = false;
                    this.errors += pulses.filter((p) => {
                        return !p.validated;
                    }).length;
                    this.endTime = new Date().getTime() - microtimeStart;
                    if (this.errors > 0) {
                        $('#myModalLoose').modal('show');
                    } else {
                        $('#myModalWin').modal('show');
                    }
                    console.log(this.errors, this.endTime, pulses);
                }, totalDuration);
            });
        }
    };

    this.metronome = () => {
        let time = 60 / this.score.tempoScore * 1000,
            aiguille = angular.element('#wand');
        $interval(() => {
            aiguille.css('animation', "halfTempRight " + time / 1000 + "s infinite linear");
            aiguille.css('transform', 'rotate(-20deg)');
        }, time * 2);
        $timeout(() => {
            $interval(() => {
                aiguille.css('animation', "halfTempLeft " + time / 1000 + "s infinite linear");
                aiguille.css('transform', 'rotate(20deg)');
            }, time * 2);
        }, time);
    };
}
