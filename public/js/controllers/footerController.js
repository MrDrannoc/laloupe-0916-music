function footerController($rootScope, $location) {
    this.load = () => {
        this.hide = $location.$$url != '/';
    };
    this.load();
    $rootScope.$on('$locationChangeSuccess', () => {
        this.load();
    });
}
