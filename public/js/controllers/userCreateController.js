function userCreateController (userService,ngToast) {

    this.userService = userService;

    this.create = () => {
        this.userService.create(this.user).then(() => {
            this.user = {prenom:"",nom:"",email:"",motdepasse:""};
            ngToast.create('Utilisateur créé');
        });
    };

}
