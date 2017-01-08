angular.module('app', ['ngRoute'])
        .factory('sessionFactory', sessionFactory)
        .service('userService', userService)
        .service('todoService', todoService)
        .service('scoreService', scoreService)
        .service('barService', barService)
        .service('noteService', noteService)
        .controller('mainController', mainController)
        .controller('scoreController', scoreController)
        .controller('scoreEditingController', scoreEditingController)
        .controller('navbarController', navbarController)
        .controller('loginController', loginController)
        .controller('userCreateController', userCreateController)
        .controller('userBlockController', userBlockController)
        .controller('duplicController', duplicController)
        .config(routes)
        .run(loginStatus)
        ;
