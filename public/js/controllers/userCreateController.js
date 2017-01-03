function userCreateController (userService) {

    this.userService = userService;

    this.create = () => {
        this.userService.create(this.user).then(() => {
            this.user = {prenom:"",nom:"",email:"",motdepasse:""};
            alert("utilisateur créé avec succès");
        });
    };

}
