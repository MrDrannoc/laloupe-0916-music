function listExercicesController(scoreService, noteService, $location, $routeParams, sessionFactory) {
    this.user = sessionFactory.user
    this.scoreService = scoreService;
    this.noteService = noteService;
    this.$location = $location;

    this.choiceExercice = (exerciceId)  => {
      this.$location.path('/exercice/' + exerciceId);
    };

    this.load = () => {
        this.scoreService.getAll().then((res) => {
            this.scores = res.data;
        });
    };

    this.load();
  }
