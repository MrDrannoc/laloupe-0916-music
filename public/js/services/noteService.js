function noteService($http) {

    this.$http = $http;

    this.create = (heigth, value, order, score) => {
        return this.$http.post('/api/notes', {
            heigthNote: heigth,
            valueNote: value,
            orderNote: order,
            score: score
        });
    };

    this.getAll = () => {
        return this.$http.get('/api/notes');
    };

    this.getOne = (id) => {
        return this.$http.get('/api/notes/' + id);
    };

    this.update = (id, heigth, value, order) => {
        return this.$http.put('/api/notes/' + id, {
            heigthNote: heigth,
            valueNote: value,
            orderNote: order
        });
    };

    this.getNoteWhereOrderGreaterThanX = (score_id, note_Order) => {
        return this.$http.put('/api/notes/note', {
            note_Order: note_Order,
            score_id: score_id
        });
    };

    this.delete = (id) => {
        return this.$http.delete('/api/notes/' + id);
    };

}
