const routes = ($routeProvider, $httpProvider) => {

    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'mainController',
            controllerAs: 'vm'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'loginController',
            controllerAs: 'vm'
        })
        .when('/userCreate', {
            templateUrl: 'views/admin/userCreate.html',
            controller: 'loginController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsConnected
            }
        })
        .when('/dashboard', {
            templateUrl: 'views/admin/dashboard.html',
            controller: 'loginController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsConnected
            }
        })
        .when('/partitionCreate', {
            templateUrl: 'views/admin/partitionCreate.html',
            controller: 'partitionCreateController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsConnected
            }
        })
        .when('/userBlock', {
            templateUrl: 'views/admin/userBlock.html',
            controller: 'loginController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsConnected
            }
        })
        .when('/partitionEdit', {
            templateUrl: 'views/admin/partitionEdit.html',
            controller: 'loginController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsConnected
            }
        })
        .when('/partitionDelete', {
            templateUrl: 'views/admin/partitionDelete.html',
            controller: 'loginController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsConnected
            }
        })
        .when('/exercice', {
            templateUrl: 'views/user/exercice.html',
            controller: 'loginController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsConnected
            }
        })
        .when('/listExercices', {
            templateUrl: 'views/user/listExercices.html',
            controller: 'loginController',
            controllerAs: 'vm'
            resolve: {
                connected: checkIsConnected
            }
        })
        .otherwise({
            redirectTo: '/'
        })

    $httpProvider.interceptors.push(($q, $location, $rootScope, $window, sessionFactory) => {
        return {
            request(config) {

                config.headers = config.headers || {};
                if ($window.localStorage.token) {
                    sessionFactory.token = $window.localStorage.token
                    sessionFactory.user = JSON.parse($window.localStorage.getItem('currentUser'));
                    config.headers.authorization = $window.localStorage.token
                }
                return config
            },
            responseError(response) {
                if (response.status === 401 || response.status === 403) {
                    $rootScope.$emit('loginStatusChanged', false);
                    $location.path('/login')
                }
                return $q.reject(response)
            }
        }
    })

}

const loginStatus = ($rootScope, $window, sessionFactory) => {

    if ($window.localStorage.currentUser) {
        sessionFactory.user = JSON.parse($window.localStorage.getItem('currentUser'));
    }

    $rootScope.$on('loginStatusChanged', (event, isLogged) => {
        $window.localStorage.setItem('currentUser', JSON.stringify(sessionFactory.user));
        $window.localStorage.token = sessionFactory.token;
        sessionFactory.isLogged = isLogged;
    })

}

const checkIsConnected = ($q, $http, $location, $window, $rootScope) => {
    let deferred = $q.defer()

    $http.get('/api/loggedin').success(() => {
        $rootScope.$emit('loginStatusChanged', true);
        // Authenticated
        deferred.resolve()
    }).error(() => {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('currentUser');
        $rootScope.$emit('loginStatusChanged', false);
        // Not Authenticated
        deferred.reject()
        $location.url('/login')
    })

    return deferred.promise
}
