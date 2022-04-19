package com.example.sms;

import android.util.Log;

import java.util.regex.Pattern;

import com.github.nkzawa.socketio.client.Socket;

public class SmsManager {
     private Socket socket;

    public SmsManager(Socket socket){
        this.socket = socket;
    }

    public String getNatureOfTheOperation(String message) {

        if(matchAccountBalanceOperationRegex(message)){

            int balance = extractBalanceFromBalanceMessage(message);

            // emit socket balanceOperation
            socket.emit("balanceOperation", balance);

            return "Solde: " + balance; // account balance

        }
        else if(matchAccountBalanceNextOperationRegex(message)){

            return "Solde: Suite";

        }
        else if(matchDepositMoneyOperationRegex(message)){

            int amount  = extractAmountFromDepositMessage(message);
            int phone = extractPhoneFromDepositMessage(message);
            int balance = extractBalanceFromDepositMessage(message);
            String transId = extractTansIdFromDepositMessage(message);

            // emit socket depositOperation
            socket.emit("depositOperation",phone, amount, transId, balance, message);

            return "Depot(Simple):<==> phone: " + phone + " amount: " + amount + " Trans ID:" + transId + " new balance:" + balance; // money received

        }
        else if(matchMerchantDepositMoneyOperationRegex(message)){

            int amount  = extractMerchantAmountFromDepositMessage(message);
            int phone = extractMerchantPhoneFromDepositMessage(message);
            int balance = extractMerchantBalanceFromDepositMessage(message);
            String transId = extractMerchantTansIdFromDepositMessage(message);

            // emit socket depositOperation
            socket.emit("depositOperation",phone, amount, transId, balance, message);

            return "Depot(Merchant):<==> phone: " + phone + " amount: " + amount + " Trans ID:" + transId + " new balance:" + balance; // money received

        }
        else if(matchCashWithdrawalOperationRegex(message)){

            int amount  = extractAmountFromWithdrawalMessage(message);
            int phone = extractPhoneFromWithdrawalMessage(message);
            int balance = extractBalanceFromWithdrawalMessage(message);
            String transId = extractTansIdFromWithdrawalMessage(message);

            // emit socket withdrawalOperation
            socket.emit("withdrawalOperation",phone, amount, transId, balance, message);

            return "Retrait: phone: " + phone + " amount: " + amount + " Trans ID:" + transId + " new balance: " + balance; // money sent

        }
        else if(matchCommissionOperationRegex(message)){
            return "Commission";
        }

        launchTheIntrusionAlert(message); // alert
        return "unknown operation"; // attempted fraud

    }



    /**
     *
     * Balance messages
     */

    private boolean matchAccountBalanceOperationRegex(String message) {
        String[] balanceRegex;

//        balanceRegex = new String[]{
//                                    "Votre solde disponible est \\d+ FCFA",
//                                    "Trans ID: ES\\d{6}.\\d{4}.[A-Z]\\d{5}"
//                                };
//
        balanceRegex = new String[]{
                "Le solde de votre compte Orange Money est de \\d+ FCFA. Le solde  de votre compte de commission est de \\d+ FCFA.",
                " ID Trans: ES\\d{6}.\\d{4}.[A-Z]\\d{5}. Trans ID:"
        };


        return Pattern.compile(balanceRegex[0], 2).matcher(message).find()
                && Pattern.compile(balanceRegex[1], 2).matcher(message).find();

    }

    private boolean matchAccountBalanceNextOperationRegex(String message){
        String[] balanceRegex;

        balanceRegex = new String[]{
                "ES\\d{6}.\\d{4}.[A-Z]\\d{5}."
        };

        return Pattern.compile(balanceRegex[0], 2).matcher(message).find();

    }

    private int extractBalanceFromBalanceMessage(String message){

        if (!matchAccountBalanceOperationRegex(message)) {
            return -1; // indicates that the message does not correspond to a balance request
        }

//        String initText = "Votre solde disponible est "; // the consultation of the account balance always starts with this.

        String initText = "Le solde de votre compte Orange Money est de "; // the consultation of the account balance always starts with this.


        String balance = message.split(initText)[1].split(" FCFA")[0];
        return Integer.parseInt(balance); // return the numerical value of the amount

    }



    /**
     *
     * Commission messages
     */

    private boolean matchCommissionOperationRegex(String message){
        String[] commissionRegex;
        commissionRegex = new String[]{
                "Vous avez recu \\d+ FCFA de commission pour votre transation dont une taxe de\\d+ FCFA. Merci"
        };

        return Pattern.compile(commissionRegex[0], 2).matcher(message).find();
    }



    /**
     *
     * Deposit messages
     */

    // SIMPLE TRANSACT
    private boolean matchDepositMoneyOperationRegex(String message) {

        String[] depositRegex;
        depositRegex = new String[]{
                "Vous avez recu \\d+ FCFA du numero \\d{8}. Votre solde est de : \\d+ FCFA ID Trans: CO\\d{6}.\\d{4}.[A-Z]\\d{5}."
        };

        return Pattern.compile(depositRegex[0], 2).matcher(message).find();
    }

    private int extractAmountFromDepositMessage(String message){
        if (!matchDepositMoneyOperationRegex(message)) {
            return -1;
        }
        String initText = "Vous avez recu ";

        String amount = message.split(initText)[1].split(" FCFA")[0];
        return Integer.parseInt(amount);
    }

    private int extractPhoneFromDepositMessage(String message){
        if (!matchDepositMoneyOperationRegex(message)) {
            return -1;
        }
        String initText = " FCFA du numero ";

        String phone = message.split(initText)[1].split(". ")[0];
        return Integer.parseInt(phone);
    }

    private int extractBalanceFromDepositMessage(String message){

        if (!matchDepositMoneyOperationRegex(message)) {
            return -1;
        }
        String initText = ". Votre solde est de : ";

        String balance = message.split(initText)[1].split(" FCFA")[0];
        return Integer.parseInt(balance);
    }

    private String extractTansIdFromDepositMessage(String message){
        if (!matchDepositMoneyOperationRegex(message)) {
            return "-1";
        }
        String initText = " FCFA ID Trans: ";

        String transId = message.split(initText)[1];
        return transId;
    }


    // MERCHANT TRANSACT
    private boolean matchMerchantDepositMoneyOperationRegex(String message) {

        String[] depositRegex;
        depositRegex = new String[]{
                "Vous avez recu \\d+ FCFA du \\d+,",
                ". Le solde de votre compte est de \\d+ FCFA Trans ID: PP\\d{6}.\\d{4}.[A-Z]\\d{5}."
        };

        return Pattern.compile(depositRegex[0], 2).matcher(message).find()
                && Pattern.compile(depositRegex[1], 2).matcher(message).find();

    }

    private int extractMerchantAmountFromDepositMessage(String message){
        if (!matchMerchantDepositMoneyOperationRegex(message)) {
            return -1;
        }
        String initText = "Vous avez recu ";

        String amount = message.split(initText)[1].split(" FCFA")[0];
        return Integer.parseInt(amount);
    }

    private int extractMerchantPhoneFromDepositMessage(String message){
        if (!matchMerchantDepositMoneyOperationRegex(message)) {
            return -1;
        }
        String initText = " FCFA du ";

        String phone = message.split(initText)[1].split(",")[0];
        return Integer.parseInt(phone);
    }

    private int extractMerchantBalanceFromDepositMessage(String message){
        if (!matchMerchantDepositMoneyOperationRegex(message)) {
            return -1;
        }
        String initText = ". Le solde de votre compte est de ";

        String balance = message.split(initText)[1].split(" FCFA")[0];
        return Integer.parseInt(balance);
    }

    private String extractMerchantTansIdFromDepositMessage(String message){
        if (!matchMerchantDepositMoneyOperationRegex(message)) {
            return "-1";
        }
        String initText = " FCFA Trans ID: ";

        String transId = message.split(initText)[1];
        return transId;
    }



    /**
     *
     * Withdrawal messages
     */

    // SIMPLE TRANSACT
    private boolean matchCashWithdrawalOperationRegex(String message) {

        String[] withdrawalRegex;
        withdrawalRegex = new String[]{
                "Cher client, vous avez transfere \\d+  FCFA au numero \\d{8},",
                ". Votre solde est de \\d+  FCFA. ",
                "ID Trans: CI\\d{6}.\\d{4}.[A-Z]\\d{5}."
        };

        return Pattern.compile(withdrawalRegex[0], 2).matcher(message).find()
                && Pattern.compile(withdrawalRegex[1], 2).matcher(message).find()
                && Pattern.compile(withdrawalRegex[2], 2).matcher(message).find();
    }

    private int extractAmountFromWithdrawalMessage(String message){
        if (!matchCashWithdrawalOperationRegex(message)) {
            return -1;
        }
        String initText = "Cher client, vous avez transfere ";

        String amount = message.split(initText)[1].split("  FCFA")[0];
        return Integer.parseInt(amount);
    }

    private int extractPhoneFromWithdrawalMessage(String message){
        if (!matchCashWithdrawalOperationRegex(message)) {
            return -1;
        }
        String initText = "  FCFA au numero ";

        String phone = message.split(initText)[1].split(",")[0];
        return Integer.parseInt(phone);
    }

    private int extractBalanceFromWithdrawalMessage(String message){
        if (!matchCashWithdrawalOperationRegex(message)) {
            return -1;
        }
        String initText = ". Votre solde est de ";

        String balance = message.split(initText)[1].split("  FCFA")[0];
        return Integer.parseInt(balance);
    }

    private String extractTansIdFromWithdrawalMessage(String message){
        if (!matchCashWithdrawalOperationRegex(message)) {
            return "-1";
        }
        String initText = "  FCFA. ID Trans: ";

        String transId = message.split(initText)[1];
        return transId;
    }


    // MERCHANT TRANSACT
    private boolean matchMerchantCashWithdrawalOperationRegex(String message) { return false;}
    private int extractMerchantAmountFromWithdrawalMessage(String message){ return 0;}
    private int extractMerchantPhoneFromWithdrawalMessage(String message){ return 0;}
    private int extractMerchantBalanceFromWithdrawalMessage(String Message){ return 0;}
    private String extractMerchantTansIdFromWithdrawalMessage(String message){ return "";}


    /**
     *
     * Unknown messages
     */
    private void launchTheIntrusionAlert(String message){

        // emit socket alert intrusion
        socket.emit("alertIntrusion",message);

        Log.d("Intrusion detected: ", message);

    }
}
