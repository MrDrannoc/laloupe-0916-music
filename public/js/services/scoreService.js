function scoreService($http) {

    this.$http = $http;

    this.create = (name, level, tempo, wording, numBeatBar, referenceValueBar) => {
        return this.$http.post('/api/scores', {
            nameScore: name,
            levelScore: level,
            tempoScore: tempo,
            wordingScore: wording,
            numBeatBar: numBeatBar,
            referenceValueBar: referenceValueBar
        });
    };

    this.getAll = () => {
        return this.$http.get('/api/scores');
    };

    this.getOne = (id) => {
        return this.$http.get('/api/scores/' + id);
    };

    this.update = (id, name, level, tempo, wording) => {
        return this.$http.put('/api/scores/' + id, {
            nameScore: name,
            levelScore: level,
            tempoScore: tempo,
            wordingScore: wording
        });
    };

    this.updateChiffrage = (id, numBeatBar, referenceValueBar) => {
        return this.$http.put('/api/scores/updateChiffrage/' + id, {
            numBeatBar: numBeatBar,
            referenceValueBar: referenceValueBar

        });
    };

    this.addNoteToScore = (scoreId, noteId) => {
        return this.$http.put('/api/scores/addNoteToScore/', {
            note_id: noteId,
            score_id: scoreId
        });
    };

    this.deleteNoteFromScore = (scoreId, noteId) => {
        return this.$http.put('/api/scores/deleteNoteFromScore/', {
            note_id: noteId,
            score_id: scoreId
        });
    };

    this.delete = (id) => {
        return this.$http.delete('/api/scores/' + id);
    };

}
