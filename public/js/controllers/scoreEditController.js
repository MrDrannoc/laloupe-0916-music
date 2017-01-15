function scoreEditController(scoreService, $location) {
    this.scoreService = scoreService;
    this.$location = $location;

    this.scoreChoice = (scoreId) => {
        this.$location.path('/score/editing/'+ scoreId);
    };

    this.load = () => {
        this.scoreService.getAll().then((res) => {
            this.scores = res.data;
        });
    };

    this.load();
  }
