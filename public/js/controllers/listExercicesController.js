function listExercicesController(scoreService) {

  this.load = () => {
      this.userService.getAll().then((res) => {
          this.users = res.data;
      });
  };

  this.load();

}
