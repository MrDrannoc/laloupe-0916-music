function listExercicesController(scoreService) {

    this.scoreCreate = () => {
        this.scoreService.create(this.score).then(() => {
            this.load();
        });
    };
}
