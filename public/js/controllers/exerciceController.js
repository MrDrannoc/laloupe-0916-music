function exerciceController(scoreService, noteService, $location, $routeParams, $timeout, $interval, $scope, $http) {
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;
    this.metronomeSwitch = false;
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
            $http.get('/api/scores/gimmidi/' + this.score._id).then((resMidi) => {
                let syncedMidi = "data:audio/midi;base64," + resMidi.data;
                MIDI.loadPlugin({
                    soundfontUrl: "./soundfont/",
                    instrument: "acoustic_grand_piano",
                    onsuccess: () => {
                        MIDI.Player.BPM = this.tempo;
                        MIDI.Player.loadFile(syncedMidi, () => {
                            this.isPlaying = true;
                            $('html, body').animate({
                                scrollTop: angular.element('.playBtn').offset().top - angular.element('.navbar').height()
                            }, 0);
                            this.tempo = this.score.tempoScore;
                            this.beatAtStart = this.score.numBeatBar;
                            $interval(() => {
                                this.beatAtStart--;
                                if (this.beatAtStart >= 0) {
                                    //Play a beat
                                    // MIDI.setVolume(0, 127);
                                    MIDI.noteOn(0, 50, 127, 0);
                                    MIDI.noteOff(0, 50, 0.10);
                                    MIDI.Player.stop();
                                }
                            }, 1 * 60 / this.tempo * 1000, this.score.numBeatBar).then(() => {
                                MIDI.Player.start();
                                $timeout(() => {
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
                                    this.success= 0;
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
                                                    this.success++;
                                                    angular.element('#flash').show().addClass('green');
                                                    $timeout(function() {
                                                        angular.element('#flash').removeClass("green").hide();
                                                    }, 300);
                                                    angular.element('#flash').html('<p>' + ['Super', 'YES', 'Bravo'][(Math.floor(Math.random() * (3 - 1 + 1)) + 1) - 1] + ' !</p>');
                                                    $timeout(function() {
                                                        angular.element('#flash').html("");
                                                    }, 300);

                                                }
                                                return p;
                                            });
                                        } else {
                                            this.errors++;
                                            angular.element('#flash').show().addClass('red');
                                            $timeout(function() {
                                                angular.element('#flash').removeClass("red").hide();
                                            }, 300);
                                            angular.element('#flash').html('<p>' + ['Dommage', 'Manqué', 'Non'][(Math.floor(Math.random() * (3 - 1 + 1)) + 1) - 1] + ' !</p>');
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
                                                    $('html, body').animate({
                                                        scrollTop: angular.element('.playBtn').offset().top + (300 * current) - angular.element('.navbar').height()
                                                    }, 0);
                                                    angular.element('.redBar').css('transition', '0s').css('margin-left', '0px').css('margin-top', (Number(angular.element('.redBar').css('margin-top').replace(/px/, '')) + 300) + "px");

                                                }
                                            }, (lineDuration[current]) * 1000);
                                        }, last * 1000);
                                        last += lineDuration[i] + 0.05;
                                    }
                                    $timeout(() => {
                                        MIDI.Player.stop();
                                        this.isPlaying = false;
                                        this.datGoodAnswers = pulses.length;
                                        this.errors += pulses.filter((p) => {
                                            return !p.validated;
                                        }).length;
                                        this.endTime = new Date().getTime() - microtimeStart;
                                        if (this.errors > 0) {
                                            $('#myModalLoose').modal('show');
                                        } else {
                                            $('#myModalWin').modal('show');
                                        }
                                    }, totalDuration);
                                }, 60 / this.tempo * 1000);
                            });
                        });
                    }
                });
            });
        };
    };
    this.metronomeInterval = [undefined, undefined, undefined];
    this.metronome = () => {
        $scope.$on('toggleMetronome', () => {
            let time = 60 / this.score.tempoScore * 1000,
                aiguille = angular.element('#wand');
            this.metronomeInterval[0] = $interval(() => {
                aiguille.css('animation', "halfTempRight " + time / 1000 + "s infinite linear");
                aiguille.css('transform', 'rotate(-20deg)');
            }, time * 2);
            this.metronomeInterval[2] = $timeout(() => {
                this.metronomeInterval[1] = $interval(() => {
                    aiguille.css('animation', "halfTempLeft " + time / 1000 + "s infinite linear");
                    aiguille.css('transform', 'rotate(20deg)');
                }, time * 2);
            }, time);
        });
        if (this.metronomeSwitch) {
            $scope.$emit('toggleMetronome');
        } else {
            $timeout.cancel(this.metronomeInterval[2]);
            $interval.cancel(this.metronomeInterval[0]);
            $interval.cancel(this.metronomeInterval[1]);
            angular.element('#wand').css('animation', 'none');
            angular.element('#wand').css('transform', 'none');
            this.metronomeInterval = [undefined, undefined, undefined];
        }
    };
}
