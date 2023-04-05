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
        console.log(datiletti);
    };

    //Passo il file e avvio la lettura
    reader.readAsDataURL(_inputFile.files[0]);
}