function noteService($http) {

    this.$http = $http;

    this.create = (heigth, value, order, refBar) => {
        return this.$http.post('/api/notes', {
            heigthNote: heigth,
            valueNote: value,
            orderNote: order,
            bar: refBar
        });
    };

    this.getAll = () => {
        return this.$http.get('/api/notes');
    };

    this.getOne = (id) => {
        return this.$http.get('/api/notes/' + id);
    };

    this.update = (id, heigth, value, order, refBar) => {
        return this.$http.put('/api/notes/' + id, {
          heigthNote: heigth,
          valueNote: value,
          orderNote: order,
          bar: refBar
        })
    };

    this.delete = (id) => {
        return this.$http.delete('/api/notes/' + id);
    };

}
