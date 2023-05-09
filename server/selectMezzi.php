<?php
$jObj = null;

//1. Collegarci al db
$indirizzoServerDBMS = "localhost";
$nomeDb = "es_mezzi";
$conn = mysqli_connect($indirizzoServerDBMS, "root", "", $nomeDb);
if($conn->connect_errno>0){
    $jObj = preparaRisp(-1, "Connessione rifiutata");
}else{
    $jObj = preparaRisp(0, "Connessione ok");
}

//$query = "SELECT territori.descr, tipidati.descr, tipiveicoli.descr, mezzi.anno, mezzi.val
            //FROM territori, tipidati, tipiveicoli, mezzi";
$query = "SELECT * 
        FROM mezzi as m, territori as t, tipidati as td, tipiveicoli as tv
        WHERE m.idTer = t.idTer AND m.idTipo = td.idTipo AND
            m.idTipoVeicolo = tv.idTipoVeicolo";

$ris = $conn->query($query);
if($ris){
    //Quando la query non ha errori -> finisco qua anche con tabella vuota
    if($ris->num_rows > 0){
        $query = "SELECT territori.descr as territorio, tipidati.descr as tipoDati, tipiveicoli.descr as tipoVeicoli, mezzi.anno as anno, mezzi.val as valore
                    FROM territori, tipidati, tipiveicoli, mezzi
                    WHERE territori.idTer = mezzi.idTer AND tipidati.idTipo = mezzi.idTipo AND tipiveicoli.idTipoVeicolo = mezzi.idTipoVeicolo";
        $ris = $conn->query($query);
        if($ris){
            $jObj = preparaRisp(0, "Query ok");
            if($ris->num_rows > 0){
                $mezzi = array();
                while($vet = $ris->fetch_assoc()){
                    $mezzo = new stdClass();
                    $mezzo->territorio = $vet["territorio"];
                    $mezzo->tipoDati = $vet["tipoDati"];
                    $mezzo->tipoVeicoli = $vet["tipoVeicoli"];
                    $mezzo->anno = $vet["anno"];
                    $mezzo->valore = $vet["valore"];
                    array_push($mezzi, $mezzo);
                }
                $jObj->mezzi = $mezzi;
            }
        }else{
            $jObj = preparaRisp(-1, "Errore nella query");
        }
    }
}else{
    //Quando ci sono errori
    $jObj = preparaRisp(-1, "Non ho trovato mezzi");
}

echo json_encode($jObj);

function preparaRisp($cod, $desc, $jObj = null){
    if(is_null($jObj)){
        $jObj = new stdClass();
    }
    $jObj->cod = $cod;
    $jObj->desc = $desc;
    return $jObj;
}