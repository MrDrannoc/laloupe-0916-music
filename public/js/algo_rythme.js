let partition = {
    _id: '654351351',
    tempo: 60,
    valeursParMesure: 4,
    valeurReference: 3,
    nom: 'Au claireuh de la luneuh',
    mesures: [{
        _id: '3541353135',
        notes: [{
            _id: '64135135136',
            hauteur: 3, // Note. Osef.
            valeur: 1 // 1 = Ronde = valeursParMesure
        }, {
            _id: '64135135137',
            hauteur: 6, // Note. Osef.
            valeur: 0.25 // .25 = Noire = valeursParMesure * .25
        }, {
            _id: '64135135138',
            hauteur: 8, // Note. Osef.
            valeur: 0.5 // 0.5 = Blanche = valeursParMesure * .5
        }, {
            _id: '64135135139',
            hauteur: 2, // Note. Osef.
            valeur: 0.25 // 0.25 = Noire = valeursParMesure * .25
        }]
    }, {
        _id: '35413156151953135',
        notes: [{
            _id: '64135135136',
            hauteur: 3, // Note. Osef.
            valeur: 1 // 1 = Ronde = valeursParMesure
        }, {
            _id: '64135135137',
            hauteur: 6, // Note. Osef.
            valeur: 0.25 // .25 = Noire = valeursParMesure * .25
        }, {
            _id: '64135135138',
            hauteur: 8, // Note. Osef.
            valeur: 0.5 // 0.5 = Blanche = valeursParMesure * .5
        }, {
            _id: '64135135139',
            hauteur: 2, // Note. Osef.
            valeur: 1 // 0.25 = Noire = valeursParMesure * .25
        }]
    }]
};

// Temps d'une note = valeur * valeursParMesure
// Temps d'une mesure = Somme des temps des notes de la mesure
// Temps d'une partition = Somme des temps des mesures
// Mult. Tempo = 60 (secondes) / tempo
// Temps = Temps * Multiplicateur tempo



function algoRythme() {
    // Put you algo rythm here
    /*
    console.log("Le nom de la partition est : " + partition.nom);
    console.log("Et le tempo de celle-ci est : " + partition.tempo);
    console.log("Valeur par mesure : " + partition.valeursParMesure + " Valeur reference: " + partition.valeurReference);
    for (let a = 0; a < partition.mesures.length; a++) {
        for (let i = 0; i < partition.mesures[a].notes.length; i++) {
            console.log(partition.mesures[a].notes[i].valeur + " = Valeur " + partition.mesures[a].notes[i].hauteur + " = Hauteur");
        }
    }*/
    var time;
    var index = 0;
    var sousIndex = 0;
    var interval = 0;
    var tempo = 60 / partition.tempo;

    function callback() {
        if (index > partition.mesures.length - 1) {
            clearTimeout(time);
        } else {
            console.log(partition.mesures[index].notes[sousIndex].valeur);
            interval = ((partition.mesures[index].notes[sousIndex].valeur * 1000) * partition.valeursParMesure) * tempo;
            sousIndex++;
            if (sousIndex >= partition.mesures[index].notes.length) {
                index++;
                sousIndex = 0;
            }
            if (index > partition.mesures.length) {
                clearTimeout(time);
            } else {
                time = setTimeout(callback, interval);
            }
        }
    }

    time = setTimeout(callback, interval);
}
algoRythme();
