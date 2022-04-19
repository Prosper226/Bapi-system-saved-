package com.example.sample.EXTRA;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class Permission {

    final private Context context;
    final private Activity activity;

    public Permission(Context context, Activity activity){
        this.context = context;
        this.activity = activity;
    }


    public void READ_PHONE_STATE(){
        int permissionCheck_READ_PHONE_STATE = ContextCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE);
        Log.d("Permission READ_PHONE_STATE", String.valueOf(permissionCheck_READ_PHONE_STATE));
        if (permissionCheck_READ_PHONE_STATE != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(activity, new String[]{Manifest.permission.READ_PHONE_STATE}, 0);
        }
    }

    public void CALL_PHONE(){
        int permissionCheck_CALL_PHONE = ContextCompat.checkSelfPermission(context, Manifest.permission.CALL_PHONE);
        Log.d("Permission CALL_PHONE", String.valueOf(permissionCheck_CALL_PHONE));
        if (permissionCheck_CALL_PHONE != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(activity, new String[]{Manifest.permission.CALL_PHONE}, 0);
        }
    }

    public void INTERNET(){
        int permissionCheck_INTERNET = ContextCompat.checkSelfPermission(context, Manifest.permission.INTERNET);
        Log.d("Permission INTERNET", String.valueOf(permissionCheck_INTERNET));
        if (permissionCheck_INTERNET != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(activity, new String[]{Manifest.permission.INTERNET}, 0);
        }
    }


}
