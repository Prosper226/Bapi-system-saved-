package com.example.sms;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;


import java.net.URISyntaxException;
import java.util.regex.Pattern;

import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

public class SmsListener extends BroadcastReceiver {

    public static final String SMS_RECEIVED_ACTION = "android.provider.Telephony.SMS_RECEIVED";
    String messageCameFrom;
    SmsManager smsManager;
    public Socket socket;

    public SmsListener() {
        try {

//            socket = IO.socket("http://127.0.0.1:1585");
            socket = IO.socket("https://92c3-41-203-227-67.ngrok.io");
            socket.connect();

            smsManager = new SmsManager(socket);

        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
//        smsManager = new SmsManager();
    }

    @Override
    public void onReceive(final Context context, Intent intent) {
        // TODO Auto-generated method stub
        if (intent.getAction().equals(SMS_RECEIVED_ACTION)) {

            Bundle bundle = intent.getExtras();
            SmsMessage[] smsMessages = null;

            if (bundle != null) {

                try {

                    Object[] pdus = (Object[]) bundle.get("pdus");
                    smsMessages = new SmsMessage[pdus.length];
                    for (int i = 0; i < smsMessages.length; i++) {
                        smsMessages[i] = SmsMessage.createFromPdu((byte[]) pdus[i]);
                        messageCameFrom = smsMessages[i].getOriginatingAddress();
                        final String messageBody = smsMessages[i].getMessageBody();

                        switch (messageCameFrom){
                            case "OrangeMoney" :
                                    String operation = smsManager.getNatureOfTheOperation(messageBody);
                                    Log.d("NatureOfTheOperation: ", operation);
                                break;

                            default:
                                break;
                        }

                        String logMessage = messageCameFrom + ": " + messageBody;
                        Log.d("smsListener", logMessage);

                    }
                } catch (Exception e) {
                    Log.d("Exception caught", e.getMessage());
                }
            }
        }
    }


    private String getNatureOfTheOperation(String message) {

        if(matchAccountBalanceOperationRegex(message)){
            int balance = extractAccountBalanceFromMessage(message);
            return "Solde" + balance; // solde du compte
        }else if(matchDepositMoneyOperationRegex(message)){
            return "Depot"; // argent recu
        }else if(matchCashWithdrawalOperationRegex(message)){
            return "Retrait"; // argent envoye
        }

        return "unknown operation";

    }


    public int extractAccountBalanceFromMessage(String message){

        if(! matchAccountBalanceOperationRegex(message)){
            return -1; // indicates that the message does not correspond to a balance request
        }

        String initText = "Votre solde disponible est "; // the consultation of the account balance always starts with this.
        String balance = message.split(initText)[1].split(" FCFA")[0];
        return Integer.parseInt(balance);

    }


    public boolean matchAccountBalanceOperationRegex(String message) {

        String[] soldeRegex = new String[] {"Votre solde disponible est \\d+ FCFA", "Trans ID: ES\\d{6}.\\d{4}.[A-Z]\\d{5}"};

        return  Pattern.compile(soldeRegex[0], 2).matcher(message).find()
                && Pattern.compile(soldeRegex[1], 2).matcher(message).find();

    }

    public boolean matchCashWithdrawalOperationRegex(String message) {
        return false;
    }

    public boolean matchDepositMoneyOperationRegex(String message) {
        return false;
    }

//    @Override
//    public void onReceive(final Context context, Intent intent) {
//        // TODO Auto-generated method stub
//        if (intent.getAction().equals("android.provider.Telephony.SMS_RECEIVED")) {
//
//            Bundle bundle = intent.getExtras();
//            SmsMessage[] msgs = null;
//
//            if (bundle != null) {
//
//                try {
//                    Object[] pdus = (Object[]) bundle.get("pdus");
//                    msgs = new SmsMessage[pdus.length];
//                    for (int i = 0; i < msgs.length; i++) {
//                        msgs[i] = SmsMessage.createFromPdu((byte[]) pdus[i]);
//                        msg_from = msgs[i].getOriginatingAddress();
//                        final String msgBody = msgs[i].getMessageBody();
//                        String logMessage = msg_from + ": " + msgBody;
//                        Log.d("smsListener", logMessage);
//                    }
//                } catch (Exception e) {
//                    Log.d("Exception caught", e.getMessage());
//                }
//            }
//        }
//    }


}