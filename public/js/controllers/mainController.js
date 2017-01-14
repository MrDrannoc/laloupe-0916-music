function mainController($location) {
    this.hide = $location.$$url.indexOf('/score/editing/') >= 0 ? true : false;
}
