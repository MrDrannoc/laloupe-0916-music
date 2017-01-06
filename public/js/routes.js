const routes = ($routeProvider, $httpProvider, $locationProvider) => {

    $locationProvider.html5Mode(false).hashPrefix('');
    $routeProvider
        .when('/', {
          templateUrl: 'views/login.html',
          controller: 'loginController',
          controllerAs: 'vm'
            /*resolve: {
                connected: checkIsConnected
            }*/
        })

        .when('/userCreate', {
            templateUrl: 'views/admin/userCreate.html',
            controller: 'userCreateController',
            controllerAs: 'vm',
            // resolve: {
            //    connected: checkIsConnected
            // }
        })
        .when('/admin/duplic', {
            templateUrl: 'views/admin/adminDuplicScore.html',
            controller: 'duplicController',
            controllerAs: 'vm',
            // resolve: {
            //    connected: checkIsConnected
            // }
        })
        .when('/dashboard', {
            templateUrl: 'views/admin/dashboard.html',
            controller: 'loginController',
            controllerAs: 'vm'
        })
        .when('/user/block', {
            templateUrl: 'views/admin/userBlock.html',
            controller: 'userBlockController',
            controllerAs: 'vm',
            // resolve: {
            //     connected: checkIsConnected
            // }
        })
        .when('/score/create', {
            templateUrl: 'views/admin/scoreCreate.html',
            controller: 'scoreController',
            controllerAs: 'vm'
        })
        .when('/score/edit', {
            templateUrl: 'views/admin/scoreEdit.html',
            controller: 'scoreController',
            controllerAs: 'vm'
        })
        .when('/score/editing/:id', {
            templateUrl: 'views/admin/scoreEditing.html',
            controller: 'scoreController',
            controllerAs: 'vm'
        })
        .when('/score/delete', {
            templateUrl: 'views/admin/scoreDelete.html',
            controller: 'loginController',
            controllerAs: 'vm'
        })
        .when('/exercice', {
            templateUrl: 'views/user/exercice.html',
            controller: 'loginController',
            controllerAs: 'vm'
        })
        .when('/list/exercices', {
            templateUrl: 'views/user/listExercices.html',
            controller: 'listExercicesController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        });

    $httpProvider.interceptors.push(($q, $location, $rootScope, $window, sessionFactory) => {
        return {
            request(config) {

                config.headers = config.headers || {};
                if ($window.localStorage.token) {
                    sessionFactory.token = $window.localStorage.token;
                    sessionFactory.user = JSON.parse($window.localStorage.getItem('currentUser'));
                    config.headers.authorization = $window.localStorage.token;
                }
                return config;
            },
            responseError(response) {
                if (response.status === 401 || response.status === 403) {
                    $rootScope.$emit('loginStatusChanged', false);
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    });

};

const loginStatus = ($rootScope, $window, sessionFactory) => {

    if ($window.localStorage.currentUser) {
        sessionFactory.user = JSON.parse($window.localStorage.getItem('currentUser'));
    }

    $rootScope.$on('loginStatusChanged', (event, isLogged) => {
        $window.localStorage.setItem('currentUser', JSON.stringify(sessionFactory.user));
        $window.localStorage.token = sessionFactory.token;
        sessionFactory.isLogged = isLogged;
    });

};

const checkIsConnected = ($q, $http, $location, $window, $rootScope) => {
    let deferred = $q.defer();

    $http.get('/api/loggedin').then(() => {
        $rootScope.$emit('loginStatusChanged', true);
        // Authenticated
        deferred.resolve();
    }).catch(() => {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('currentUser');
        $rootScope.$emit('loginStatusChanged', false);
        // Not Authenticated
        deferred.reject();
        $location.url('/login');
    });

    return deferred.promise;
};
