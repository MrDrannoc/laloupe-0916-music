function barService($http) {

    this.$http = $http;

    this.create = (numBit, refValue, order, refScore) => {
        return this.$http.post('/api/bars', {
            numBitBar: numBit,
            referenceValueBar: refValue,
            orderBar: order,
            score: refScore
        });
    };

    this.getAll = () => {
        return this.$http.get('/api/bars');
    };

    this.getOne = (id) => {
        return this.$http.get('/api/bars/' + id);
    };

    this.update = (id, numBit, refValue) => {
        return this.$http.put('/api/bars/' + id, {
            numBitBar: numBit,
            referenceValueBar: refValue
        });
    };

    this.addNoteToBar = (barId, noteId) => {
        return this.$http.put('/api/bars/bar/', {
            bar_id:barId,
            note_id:noteId
        });
    };

    this.delete = (id) => {
        return this.$http.delete('/api/bars/' + id);
    };

}
