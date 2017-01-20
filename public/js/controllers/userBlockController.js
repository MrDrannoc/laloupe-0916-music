function userBlockController(userService,ngToast) {

    this.userService = userService;

    this.load = () => {
        this.userService.getAll().then((res) => {
            this.users = res.data;
        });
    };

    this.load();

    this.suspend = (id) => {
        this.userService.suspend(id).then(() => {
          ngToast.create('Utilisateur suspendu');
            this.load();
        });
    };

}
