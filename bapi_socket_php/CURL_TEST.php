<?php
    include_once "CURL_PMU.php";
    print_r('<pre>');

    $CURL_PMU = new CURL_PMU($baseUrl = "https://1218-41-203-239-62.ngrok.io", $authorization = "aGFlbWFzdTp0b29sYmVsdA==");


    /**
     * get account balance 
     */ 
    $balance = $CURL_PMU->getBalance();
    print(" 1- CURL_PMU get balance request\n");
    print_r($balance);


    // /**
    //  *  check transaction
    //  */
    // $checkOperation = $CURL_PMU->checkOperation($id = "PMU-7161-118223-9413");
    // print(" 2- CURL_PMU check operation request\n");
    // print_r($checkOperation);


    // /**
    //  * withdrawal operation request
    //  */
    // $withdrawal = $CURL_PMU->withdrawal($bash = 2523809910, $amount = 250, $phone = 22657474578);
    // print(" 3- CURL_PMU withdrawal operation request\n");
    // print_r($withdrawal);


    // /**
    //  * deposit operation request
    //  */
    // $deposit = $CURL_PMU->deposit($bash = 123409875, $amount = 10, $phone = 22657474578);
    // print(" 4- CURL_PMU deposit operation request\n");
    // print_r($deposit);



?>