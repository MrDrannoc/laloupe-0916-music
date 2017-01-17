function footerController($rootScope, $location) {
    $rootScope.$on('$locationChangeSuccess', () => {
        this.hide = $location.$$url.indexOf('/score/editing/') >= 0;
    });
    this.load = () => {
        this.hide = $location.$$url.indexOf('/score/editing/') >= 0;
    };
    this.load();
}
