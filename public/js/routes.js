const routes = ($routeProvider, $httpProvider, $locationProvider) => {

    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'loginController',
            controllerAs: 'vm'
        })
        .when('/userCreate', {
            templateUrl: 'views/admin/userCreate.html',
            controller: 'userCreateController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsAdmin
            }
        })
        .when('/dashboard', {
            templateUrl: 'views/admin/dashboard.html',
            resolve: {
                connected: checkIsAdmin
            }
        })
        .when('/user/block', {
            templateUrl: 'views/admin/userBlock.html',
            controller: 'userBlockController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsAdmin
            }
        })
        .when('/score/create', {
            templateUrl: 'views/admin/scoreCreate.html',
            controller: 'scoreCreateController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsAdmin
            }
        })
        .when('/score/edit', {
            templateUrl: 'views/admin/scoreEdit.html',
            controller: 'scoreEditController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsAdmin
            }
        })
        .when('/score/editing/:id', {
            templateUrl: 'views/admin/scoreEditing.html',
            controller: 'scoreEditingController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsAdmin
            }
        })
        .when('/score/delete', {
            templateUrl: 'views/admin/scoreDelete.html',
            controller: 'scoreDeleteController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsAdmin
            }
        })
        .when('/exercice/:id', {
            templateUrl: 'views/user/exercice.html',
            controller: 'exerciceController',
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


const checkIsAdmin = ($q, $http, $location, $window, $rootScope) => {
    let deferred = $q.defer();

    $http.get('/api/isadmin').then(() => {
        $rootScope.$emit('loginStatusChanged', true);
        deferred.resolve();
    }).catch(() => {
        $rootScope.$emit('loginStatusChanged');
        deferred.reject();
    });

    return deferred.promise;
};
