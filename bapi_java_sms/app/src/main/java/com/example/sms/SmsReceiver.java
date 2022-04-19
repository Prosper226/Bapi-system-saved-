package com.example.sms;

import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.provider.Telephony;
import android.widget.Toast;

import java.security.MessageDigest;

public class SmsReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        // Get SMS map from Intent
//        if(context == null || intent == null || intent.action == null){
//            return
//        }
//        if (intent.action != (Telephony.Sms.Intents.SMS_RECEIVED_ACTION)) {
//            return
//        }
//        ContentResolver contentResolver = context.contentResolver;
//        MessageDigest smsMessages = Telephony.Sms.Intents.getMessagesFromIntent(intent);
//        for (message in smsMessages) {
//            Toast.makeText(context, "Message from ${message.displayOriginatingAddress} : body ${message.messageBody}", Toast.LENGTH_SHORT)
//                    .show()
//            putSmsToDatabase( contentResolver, message)
//        }
    }
}
