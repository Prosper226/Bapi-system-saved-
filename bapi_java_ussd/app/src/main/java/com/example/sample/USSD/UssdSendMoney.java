package com.example.sample.USSD;

import android.util.Log;

import com.romellfudi.ussdlibrary.USSDApi;
import com.romellfudi.ussdlibrary.USSDController;

import java.util.regex.Pattern;


public class UssdSendMoney implements USSDController.CallbackInvoke {
    final String amount;
    final String phone;
    final String txId;
    final USSDApi ussdApi;
    final static  String SECRET = "9999";

    public UssdSendMoney(String amount, String phone, USSDApi uSSDApi, String txId) {
        Log.d("SendMoneyUssd", "New instance created");
        this.amount = amount;
        this.phone = phone;
        this.ussdApi = uSSDApi;
        this.txId = txId;
    }

    public boolean isIn(String data, String value) {
        return Pattern.compile(value, 2).matcher(data).find();
    }

    @Override
    public String responseInvoke(String message) {
        if (!this.isIn(message, this.amount) || !this.isIn(message, this.phone) || !this.isIn(message, "FCFA") || !this.isIn(message, "code") || !this.isIn(message, "PIN")) {
            final USSDApi uSSDApi = this.ussdApi;
            uSSDApi.send("OK", new USSDController.CallbackMessage() {
                @Override
                public final void responseMessage(String secondMessage) {
                    final USSDApi ussdApiTwo = uSSDApi;
                    ussdApiTwo.send("OK", new USSDController.CallbackMessage() {
                        @Override
                        public final void responseMessage(String ThirstMessage) {
                            final USSDApi ussdApiThree = ussdApiTwo;
                            ussdApiThree.send("OK", UssdCallback.INSTANCE);
                        }
                    });
                }
            });
            return message;
        }
        final USSDApi uSSDApi2 = this.ussdApi;
        uSSDApi2.send(SECRET, new USSDController.CallbackMessage() {
            @Override
            public final void responseMessage(String SecondMessage) {
                lambdaInvoke(uSSDApi2, SecondMessage);
            }
        });
        return message;
    }

    public void lambdaInvoke(final USSDApi uSSDApi, String str) {
        uSSDApi.send("OK", new USSDController.CallbackMessage() {
            @Override
            public final void responseMessage(String str2) {
                uSSDApi.send("OK", new USSDController.CallbackMessage() {
                    @Override
                    public final void responseMessage(String str3) {
                        ussdApi.send("OK", UssdCallback.INSTANCE);
                    }
                });
            }
        });
    }

    @Override
    public void over(String message) {
//        if (ManagerActivity.this.usePreviousMessage.booleanValue()) {
//            message = ManagerActivity.this.previousMessage;
//        }
//        MainActivity.this.updateTransact(this.amount, this.phone, this.mainKey, this.trans_id, str);
    }

}

