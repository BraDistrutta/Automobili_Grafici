var _btnCarica = null;
var _inputFile = null, _main = null;
var urlBase = window.location.href.substring(0,42);

window.onload = function(){
    _btnCarica = document.getElementsByTagName("button")[0];
    _btnCarica.addEventListener("click", onbtnCarica);

    //input[type=file] -> prelevo il primo input di tipo file
    _inputFile = document.querySelector("input[type=file]");
    _main = document.querySelector("main");

    console.log(urlBase);

    sees();
};

function onbtnCarica(){
    alert("Sto per caricare il file");

    console.log(_inputFile);
    console.log(_inputFile.files);

    let reader = new FileReader();
    //Indico alla libreria chi contattare terminata la lettura
    reader.onload = async function(datiletti){
        //console.log(datiletti);// Oggetto FileReader
        console.log(datiletti.currentTarget.result); //risultati codificati
        let dati = datiletti.currentTarget.result.split("/");

        //Trasformato da base64 utf8
        let datiDecodificati = atob(dati[2]);

        //Divido le righe del file in array
        let righe = datiDecodificati.split("\r\n");

        //Divido le colonne di ciascuna riga
        /*
            array di array

            array esterno: righe del file
            array interno: colonne di ciascuna riga
        */

        let record = [], colonne = [];
        for(let riga of righe){
            riga = riga.replaceAll("\"", "");
            colonne = riga.split(",");
            record.push(colonne);
        }
        console.log(record);

        //Contatto il server
        //Proviamo a connetterci al server
        for(let i=2; i< 10; i++){
            let busta = await fetch(urlBase + "server/inserisciMezzo.php", {
                    method:"post",
                    body:JSON.stringify(record[i])
                }
            );
            //Leggo il contenuto della busta
            console.log(await busta.json());
        }
        //Il server ha già finito o no? Con l'await ha già finito -> poco efficiente

        //Creazione dinamica della tabella: 1,3,5,7,8
        let tabella = document.createElement("table");
        let thead = document.createElement("thead");
        let tbody = document.createElement("tbody");
        tabella.appendChild(thead);
        tabella.appendChild(tbody);
        _main.appendChild(tabella);

        //Intestazione
        let intestazione = "<tr>";
        for(let idColonna in record[0]){
            if([1,3,5,7,8].includes(parseInt(idColonna)))
                intestazione += `<th>${record[0][idColonna]}</th>`;
        }
        intestazione += "</tr>";
        thead.innerHTML = intestazione;

        //Dati
        dati = "";
        for(let i=1; i< record.length; i++){
            dati += "<tr>";
            for(let idcolonna in record[i]){
                if([1,3,5,7,8].includes(parseInt(idcolonna)))
                    dati += `<td>${record[i][idcolonna]}</td>`;
            }
            dati += "</tr>";
        }
        tbody.innerHTML = dati;
    };

    //Passo il file e avvio la lettura
    reader.readAsDataURL(_inputFile.files[0]);
}

async function sees(){
    let zebby = await fetch(urlBase + "server/selectMezzi.php", {
            method:"get"
        }
    );

    let oshimen = await zebby.json();
    console.log(oshimen);

    let tabella = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    tabella.appendChild(thead);
    tabella.appendChild(tbody);
    _main.appendChild(tabella);

    /*Intestazione
    let intestazione = "<tr>";
    for(let idColonna in record[0]){
        if([1,3,5,7,8].includes(parseInt(idColonna)))
            intestazione += `<th>${record[0][idColonna]}</th>`;
    }
    intestazione += "</tr>";
    thead.innerHTML = intestazione;
    */
    //Dati
    html = "";
    for(let i=1; i< oshimen.mezzi.length; i++){
        html += "<tr>";
        for(let idcolonna in oshimen.mezzi[i]){
            html += `<td>${oshimen.mezzi[i][idcolonna]}</td>`;
        }
        html += "</tr>";
    }
    tbody.innerHTML = html;

    disegnaGrafico(oshimen.mezzi);
}

function disegnaGrafico(zemel){
    const data = {
        labels: [],
        datasets: [{
            label: '',
            data: [],
            backgroundColor: []
        }]
    };

    let i = 0;
    let bgColor = [];

    for(let record of zemel){
        if(record.tipoDati == 'parco veicolare'){
            data.labels.push(record.territorio);
            /*data.datasets[i] = {
                label: record.territorio + ': ' + record.valore + ';',
                data: [record.valore],
                backgroundColor: 'rgb(' + getRandomInt(255) + ', ' + getRandomInt(255) + ', ' + getRandomInt(255) + ')'
            }*/
            bgColor[i] = 'rgb(' + getRandomInt(255) + ', ' + getRandomInt(255) + ', ' + getRandomInt(255) + ')';
            //data.datasets[0].data.push(Math.log(record.valore).toString());
            data.datasets[0].data.push(record.valore);
            //data.datasets[0].label += record.territorio + ': ' + record.valore + '; ';
            data.datasets[0].backgroundColor.push(bgColor[i]);
            //data.datasets[0]
            console.log(data.datasets[i]);
            i++
        }
    }

    const config = {
        type: 'polarArea',
        data: data,
        options: {}
    };
    let canvas = document.createElement("canvas");
    document.getElementsByTagName("main")[0].appendChild(canvas);
    let grafico = new Chart(canvas, config);

    console.log(data);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}