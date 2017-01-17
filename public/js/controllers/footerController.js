function footerController($rootScope, $location) {
    $rootScope.$on('$locationChangeSuccess', () => {
        this.hide = $location.$$url.indexOf('/score/editing/') >= 0 ? true : $location.$$url.indexOf('/exercice/') >= 0 ? true : false;
    });
    this.load = () => {
        this.hide = $location.$$url.indexOf('/score/editing/') >= 0 ? true : $location.$$url.indexOf('/exercice/') >= 0? true : false;
    };
    this.load();
}
