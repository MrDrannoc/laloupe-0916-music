function footerController($rootScope, $location) {
  $rootScope.$on('$locationChangeSuccess', function(){
    this.hide = $location.$$url.indexOf('/score/editing/') >= 0;
    var element = document.getElementById("footer");
    if (this.hide) {
      element.style.display = "none";
    }
    else {
      element.style.display = "block";
    }
  });
}
