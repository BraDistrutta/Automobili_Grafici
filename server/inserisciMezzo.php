<?php
    $jObj = new stdClass();

    //1. Collegarci al db
    $indirizzoServerDBMS = "localhost";
    $nomeDb = "4a_mezzi";
    $conn = mysqli_connect($indirizzoServerDBMS, "root", "", $nomeDb);
    if($conn->connect_errno>0){
        $jObj->cod = -1;
        $jObj->desc = "Connessione rifiutata";
    }else{
        $jObj->cod = 0;
        $jObj->desc = "Connessione ok";
    }


    //2. Prelevare un dato json che arriva dal client
    $record = file_get_contents("php://input");
    $record = json_decode($record);
    $jObj->record = $record;

    //3 Verificare se non esiste già il record
    $query = "SELECT * 
        FROM mezzi as m, territori as t, tipidati as td, tipiveicoli as tv
        WHERE m.idTer = t.idTer AND m.idTipo = td.idTipo AND
            m.idTipoVeicolo = tv.idTipoVeicolo AND 
            t.descr = '".$record[1]."' AND  td.descr = '".$record[3]."'
            AND  tv.descr = '".$record[5]."' AND m.anno = ".$record[7]."
            AND m.val = ".$record[8];
    $ris = $conn->query($query);
    if($ris){
        $jObj->cod = 0;
        $jObj->desc = "Query ok";
        $jObj->risp = $risp->num_rows;
    }else{
        $jObj->cod = -1;
        $jObj->desc = "Errore nella query: ".$conn->error;
    }
 

    //4. Costruire la INSERT


    //5. Verificare il risultato


    //Rispondo al javascript (al client)
    echo json_encode($jObj);