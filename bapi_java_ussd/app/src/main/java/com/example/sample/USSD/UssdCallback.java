package com.example.sample.USSD;

import com.example.sample.ManagerActivity;
import com.romellfudi.ussdlibrary.USSDController;

public class UssdCallback implements USSDController.CallbackMessage{
    public static final UssdCallback INSTANCE = new UssdCallback();

    @Override
    public void responseMessage(String message) {
        ManagerActivity.voidCallbackFunc(message);
    }
}
