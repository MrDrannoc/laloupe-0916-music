function footerController($rootScope, $location) {
  console.log($location.$$url);
  $rootScope.$on('$locationChangeSuccess', () => {
    this.hide = $location.$$url.indexOf('/score/editing/') >= 0;
    console.log(this.hide);
  });
}
