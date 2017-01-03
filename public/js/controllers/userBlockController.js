function userBlockController (userService) {

    this.userService = userService;

    this.create = () => {
        this.userService.create(this.user).then(() => {
            this.user = {prenom:"",nom:"",email:"",motdepasse:""};
            alert("utilisateur suspendu avec succès ")
        });
    };

}
