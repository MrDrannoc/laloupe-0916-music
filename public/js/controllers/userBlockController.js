function userBlockController (userService) {

    this.userService = userService;

    // this.create = () => {
    //     this.userService.create(this.user).then(() => {
    //         this.user = {prenom:"",nom:"",email:"",motdepasse:""};
    //         alert("utilisateur suspendu avec succès ")
    //     });
    // };

    this.load = () => {
        this.userService.getAll().then((res) => {
            this.users = res.data;
        });
    };

    this.load();

    this.suspend = (id) => {
        this.userService.suspend(id).then(() => {
            this.load();
        });
    };

}
