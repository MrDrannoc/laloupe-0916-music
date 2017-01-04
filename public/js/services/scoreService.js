function scoreService($http) {

    this.$http = $http;

    this.create = (data, level, name, description) => {
        return this.$http.post('/api/scores', {
            tempoScore: data,
            levelScore: level,
            nameScore: name,
            commentScore: description,
        });
    };

    this.getAll = () => {
        return this.$http.get('/api/scores');
    };

    this.getOne = (id) => {
        return this.$http.get('/api/scores/' + id);
    };

    this.update = (id, data, level, name, description) => {
        return this.$http.put('/api/scores/' + id, {
          tempoScore: data,
          levelScore: level,
          nameScore: name,
          commentScore: desciption,
        });
    };

    this.delete = (id) => {
        return this.$http.delete('/api/scores/' + id);
    };

}
