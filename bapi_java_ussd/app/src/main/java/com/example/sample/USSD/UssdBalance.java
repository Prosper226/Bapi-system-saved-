package com.example.sample.USSD;

import android.util.Log;

import com.romellfudi.ussdlibrary.USSDApi;
import com.romellfudi.ussdlibrary.USSDController;

import java.util.regex.Pattern;

public class UssdBalance implements USSDController.CallbackInvoke {
    public String balance;
    final USSDApi ussdApi;
    final static  String SECRET = "9999";


    public UssdBalance(USSDApi uSSDApi) {
        Log.d("BalanceUssd", "New instance created");
        this.ussdApi = uSSDApi;
    }

    public boolean isIn(String data, String value) { // determine if value exist in data and return a boolean
        return Pattern.compile(value, 2).matcher(data).find();
    }


    @Override
    public String responseInvoke(String message) {
        if (!this.isIn(message, "Saisir le code PIN:")) {
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
    public void over(String message) {}

}