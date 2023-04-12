var _btnCarica = null;
var _inputFile = null;

window.onload = function(){
    _btnCarica = document.getElementsByTagName("button")[0];
    _btnCarica.addEventListener("click", onbtnCarica);

    //input[type=file] -> prelevo il primo input di tipo file
    _inputFile = document.querySelector("input[type=file]");


};

function onbtnCarica(){
    alert("Sto per caricare il file");

    console.log(_inputFile);
    console.log(_inputFile.files);

    let reader = new FileReader();
    //Indico alla libreria chi contattare terminata la lettura
    reader.onload =  function(datiletti){
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
    };

    //Passo il file e avvio la lettura
    reader.readAsDataURL(_inputFile.files[0]);
}