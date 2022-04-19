package com.example.sample;

import android.content.Context;
import android.util.Log;

import com.example.sample.USSD.UssdBalance;
import com.example.sample.USSD.UssdSendMoney;
import com.romellfudi.ussdlibrary.USSDController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;

public class UssdController {

    final private Context context;
    HashMap map = new HashMap();
    String ussd = null;

    public UssdController(Context context){
        this.context = context;
        this.map.put("KEY_LOGIN", new HashSet(Arrays.asList("espere", "waiting", "loading", "esperando")));
        this.map.put("KEY_ERROR", new HashSet(Arrays.asList("problema", "problem", "error", "null")));
    }


    public void sendMoney(String amount, String phone, String txId) {
        try {
//            ussd = "*144*2*1*" + phone + "*" + amount + "#";
            ussd = "*144*2*" + phone + "*" + amount + "#";
            USSDController instance = USSDController.getInstance(context);
            instance.callUSSDInvoke(ussd, this.map, new UssdSendMoney(amount, phone, instance, txId));
        }catch (Exception e){
            Log.d("Exception", e.getMessage());
        }

    }

    public int getBalance() {
        try {
            ussd = "*144*9*1#";
            USSDController instance = USSDController.getInstance(context);
            instance.callUSSDInvoke(ussd, this.map, new UssdBalance(instance));
            return 13;
        }catch (Exception e){
            Log.d("Exception", e.getMessage());
            return -1;
        }
    }




}
