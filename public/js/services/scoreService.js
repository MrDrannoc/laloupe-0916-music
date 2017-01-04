function scoreService($http) {

    this.$http = $http;

    this.create = (data) => {
        return this.$http.post('/api/scores', {
            tempoScore: data
        })
    }

    this.getAll = () => {
        return this.$http.get('/api/scores')
    }

    this.getOne = (id) => {
        return this.$http.get('/api/scores/' + id)
    }

    this.update = (id, data) => {
        return this.$http.put('/api/scores/' + id, {
            tempoScore: data
        })
    }

    this.delete = (id) => {
        return this.$http.delete('/api/scores/' + id)
    }

}
