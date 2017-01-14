function scoreEditController(scoreService, $location) {
    this.scoreService = scoreService;
    this.$location = $location;

    this.scoreChoice = (id) => {
        this.$location.path('/score/editing/'+id);
    };

    this.load = () => {
        this.scoreService.getAll().then((res) => {
            this.scores = res.data;
        });
    };

    this.load();
  }
