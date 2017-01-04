function scoreService($http) {

    this.$http = $http;

    this.create = (name,level,tempo,wording) => {
        return this.$http.post('/api/scores', {
          nameScore: name,
          levelScore: level,
          tempoScore: tempo,
          wordingScore: wording
        })
    }

    this.getAll = () => {
        return this.$http.get('/api/scores');
    };

    this.getOne = (id) => {
        return this.$http.get('/api/scores/' + id);
    };

    this.update = (id, name,level,tempo,wording) => {
        return this.$http.put('/api/scores/' + id, {
          nameScore: name,
          levelScore: level,
          tempoScore: tempo,
          wordingScore: wording
        })
    }

    this.delete = (id) => {
        return this.$http.delete('/api/scores/' + id);
    };

}
