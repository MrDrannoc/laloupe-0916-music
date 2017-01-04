function scoreCreateController(scoreService, barService, noteService) {
    this.scoreService = scoreService;
    this.barService = barService;
    this.noteService = noteService;

    this.scoreCreate = () => {
        this.scoreService.create(this.score).then(() => {
            this.load();
        });
    };
    this.barCreate = () => {
        this.barService.create(this.bar).then(() => {
            this.load();
        });
    };
    this.noteCreate = () => {
        this.noteService.create(this.note).then(() => {
            this.load();
        });
    };
}
