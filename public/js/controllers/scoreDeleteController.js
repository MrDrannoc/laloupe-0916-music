function scoreDeleteController(scoreService) {
    this.scoreService = scoreService;

    this.scoreDelete = (id) => {
        this.scoreService.delete(id).then(() => {
            this.load();
        });
    };

    this.load = () => {
        this.scoreService.getAll().then((res) => {
            this.scores = res.data;
        });
    };

    this.load();
  }
