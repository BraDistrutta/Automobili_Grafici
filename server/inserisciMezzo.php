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

    //4. Costruire la INSERT


    //5. Verificare il risultato


    //Rispondo al javascript (al client)
    echo json_encode($jObj);