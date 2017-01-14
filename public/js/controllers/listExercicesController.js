function listExercicesController(scoreService, noteService, $location, $routeParams) {
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;

    this.choiceExercice = (id)  => {
      this.$location.path('/exercice/' + id);
    };

    this.load = () => {
        this.scoreService.getAll().then((res) => {
            this.scores = res.data;
        });
    };

    this.load();
  }
