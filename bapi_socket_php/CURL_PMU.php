<?php

    class CURL_PMU
    {

        private $baseUrl = "";
        private $authorization = "Basic ";

        public function __construct($baseUrl, $authorization = "aGFlbWFzdTp0b29sYmVsdA=="){
            $this->baseUrl = $baseUrl . "/pmu/ussd";
            $this->authorization .= $authorization;
        }


        /**
         * Get ACCOUNT BALANCE
         */
        public function getBalance(){
            try{

                $url = "$this->baseUrl/merchant/balance";

                $curl = curl_init($url);
                curl_setopt($curl, CURLOPT_URL, $url);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                $headers = array(
                    "Content-Type: application/json",
                    "Authorization: $this->authorization",
                );
                curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
                //for debug only!
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

                $resp = curl_exec($curl);
                curl_close($curl);
                return json_decode($resp, true);

            }catch (\Exception $e){
                return $e->getMessage();
            }
        }


        /**
         *  CHECK MANUALY SIMPLE OPERATION 
         */
        public function checkOperation($id){
            try{

                if(!$id){
                    return false;
                }

                $url = "$this->baseUrl/transaction/check/$id";

                $curl = curl_init($url);
                curl_setopt($curl, CURLOPT_URL, $url);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

                $headers = array(
                    "Content-Type: application/json",
                    "Authorization: $this->authorization",
                );
                curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
                //for debug only!
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

                $resp = curl_exec($curl);
                curl_close($curl);
                return json_decode($resp, true);

            }catch (\Exception $e){
                return $e->getMessage();
            }
        }


        /**
         *  WITHDRAWAL OPERATION
         */
        public function withdrawal($bash, $amount, $phone){
            try{

                if(!$amount || !$phone || !$bash){
                    return false;
                }

                $url = "$this->baseUrl/transaction/add/withdrawal";

                $curl = curl_init($url);
                curl_setopt($curl, CURLOPT_URL, $url);
                curl_setopt($curl, CURLOPT_POST, true);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

                $headers = array(
                    "Content-Type: application/json",
                    "Authorization: $this->authorization",
                );

                curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

                $data = json_encode(
                    array(
                        "bash" => "$bash",
                        "amount" => $amount,
                        "phone" => $phone
                    )
                );

                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

                //for debug only!
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

                $resp = curl_exec($curl);
                curl_close($curl);
                return json_decode($resp, true);

            }catch (\Exception $e){
                return $e->getMessage();
            }
        }



        /**
         * DEPOSIT OPERATION
         */
        public function deposit($bash, $amount, $phone){
            try{

                if(!$amount || !$phone || !$bash){
                    return false;
                }

                $url = "$this->baseUrl/transaction/add/deposit";

                $curl = curl_init($url);
                curl_setopt($curl, CURLOPT_URL, $url);
                curl_setopt($curl, CURLOPT_POST, true);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

                $headers = array(
                    "Content-Type: application/json",
                    "Authorization: $this->authorization",
                );
                curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

                $data = json_encode(
                    array(
                        "bash" => "$bash",
                        "amount" => $amount,
                        "phone" => $phone
                    )
                );

                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

                //for debug only!
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

                $resp = curl_exec($curl);
                curl_close($curl);
                return json_decode($resp, true);
            
            }catch (\Exception $e){
                return $e->getMessage();
            }
        }

    }

?>
