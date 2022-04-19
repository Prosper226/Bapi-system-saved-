package com.romellfudi.ussdlibrary;

import android.accessibilityservice.AccessibilityServiceInfo;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.telecom.PhoneAccountHandle;
import android.telecom.TelecomManager;
import android.text.TextUtils;
import android.view.accessibility.AccessibilityManager;
import android.widget.Toast;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

/* loaded from: classes.dex */
public class USSDController extends Activity implements USSDInterface, USSDApi {
    protected static final String KEY_ERROR = "KEY_ERROR";
    protected static final String KEY_LOGIN = "KEY_LOGIN";
    protected static USSDController instance;
    protected CallbackInvoke callbackInvoke;
    protected CallbackMessage callbackMessage;
    protected Context context;
    protected HashMap<String, HashSet<String>> map;
    protected Boolean isRunning = false;
    protected Boolean send = false;
    private USSDInterface ussdInterface = this;

    @Override
    public void onPointerCaptureChanged(boolean hasCapture) {

    }

    /* loaded from: classes.dex */
    public interface CallbackInvoke {
        void over(String str);

        String responseInvoke(String str);
    }

    /* loaded from: classes.dex */
    public interface CallbackMessage {
        void responseMessage(String str);
    }

    public static USSDController getInstance(Context context) {
        if (instance == null) {
            instance = new USSDController(context);
        }
        return instance;
    }

    private USSDController(Context context) {
        this.context = context;
    }

    @Override // com.romellfudi.ussdlibrary.USSDApi
    public void callUSSDInvoke(String str, HashMap<String, HashSet<String>> hashMap, CallbackInvoke callbackInvoke) {
        this.send = false;
        callUSSDInvoke(str, 0, hashMap, callbackInvoke);
    }

    @Override // com.romellfudi.ussdlibrary.USSDApi
    public void callUSSDOverlayInvoke(String str, HashMap<String, HashSet<String>> hashMap, CallbackInvoke callbackInvoke) {
        this.send = false;
        callUSSDOverlayInvoke(str, 0, hashMap, callbackInvoke);
    }

    @Override // com.romellfudi.ussdlibrary.USSDApi
    public void callUSSDInvoke(String str, int i, HashMap<String, HashSet<String>> hashMap, CallbackInvoke callbackInvoke) {
        this.callbackInvoke = callbackInvoke;
        this.map = hashMap;
        if (verifyAccesibilityAccess(this.context)) {
            dialUp(str, i);
        } else {
            this.callbackInvoke.over("Check your accessibility");
        }
    }

    @Override // com.romellfudi.ussdlibrary.USSDApi
    public void callUSSDOverlayInvoke(String str, int i, HashMap<String, HashSet<String>> hashMap, CallbackInvoke callbackInvoke) {
        this.callbackInvoke = callbackInvoke;
        this.map = hashMap;
        if (!verifyAccesibilityAccess(this.context) || !verifyOverLay(this.context)) {
            this.callbackInvoke.over("Check your accessibility | overlay permission");
        } else {
            dialUp(str, i);
        }
    }

    private void dialUp(String str, int i) {
        HashMap<String, HashSet<String>> hashMap = this.map;
        if (hashMap == null || !hashMap.containsKey(KEY_ERROR) || !this.map.containsKey(KEY_LOGIN)) {
            this.callbackInvoke.over("Bad Mapping structure");
        } else if (str.isEmpty()) {
            this.callbackInvoke.over("Bad ussd number");
        } else {
            String encode = Uri.encode("#");
            if (encode != null) {
                str = str.replace("#", encode);
            }
            Uri parse = Uri.parse("tel:" + str);
            if (parse != null) {
                this.isRunning = true;
            }
            this.context.startActivity(getActionCallIntent(parse, i));
        }
    }

    @SuppressLint({"MissingPermission", "WrongConstant"})
    private Intent getActionCallIntent(Uri uri, int i) {

        List<PhoneAccountHandle> callCapablePhoneAccounts;
        String[] strArr = {"extra_asus_dial_use_dualsim", "com.android.phone.extra.slot", "slot", "simslot", "sim_slot", "subscription", "Subscription", "phone", "com.android.phone.DialingMode", "simSlot", "slot_id", "simId", "simnum", "phone_type", "slotId", "slotIdx"};
        Intent intent = new Intent("android.intent.action.CALL", uri);
        intent.setFlags(268435456);
//        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("com.android.phone.force.slot", true);
        intent.putExtra("Cdma_Supp", true);
        for (int i2 = 0; i2 < 16; i2++) {
            intent.putExtra(strArr[i2], i);
        }
        TelecomManager telecomManager = (TelecomManager) this.context.getSystemService("telecom");
        if (!(telecomManager == null || (callCapablePhoneAccounts = telecomManager.getCallCapablePhoneAccounts()) == null || callCapablePhoneAccounts.size() <= i)) {
            intent.putExtra("android.telecom.extra.PHONE_ACCOUNT_HANDLE", callCapablePhoneAccounts.get(i));
        }
        return intent;
    }

    @Override // com.romellfudi.ussdlibrary.USSDInterface
    public void sendData(String str) {
        USSDService.send(str);
    }

    @Override // com.romellfudi.ussdlibrary.USSDApi
    public void send(String str, CallbackMessage callbackMessage) {
        this.callbackMessage = callbackMessage;
        this.send = true;
        this.ussdInterface.sendData(str);
    }

    @Override // com.romellfudi.ussdlibrary.USSDApi
    public void cancel() {
        USSDService.cancel();
    }

    public static boolean verifyAccesibilityAccess(Context context) {
        boolean isAccessiblityServicesEnable = isAccessiblityServicesEnable(context);
        if (!isAccessiblityServicesEnable) {
            if (context instanceof Activity) {
                openSettingsAccessibility((Activity) context);
            } else {
                Toast.makeText(context, "voipUSSD accessibility service is not enabled", Toast.LENGTH_SHORT).show();
            }
        }
        return isAccessiblityServicesEnable;
    }

    public static boolean verifyOverLay(Context context) {
        if (!(Build.VERSION.SDK_INT >= 23 && !Settings.canDrawOverlays(context))) {
            return true;
        }
        if (context instanceof Activity) {
            openSettingsOverlay((Activity) context);
        } else {
            Toast.makeText(context, "Overlay permission have not grant permission.", Toast.LENGTH_SHORT).show();
        }
        return false;
    }

    private static void openSettingsAccessibility(final Activity activity) {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle("USSD Accessibility permission");
        ApplicationInfo applicationInfo = activity.getApplicationInfo();
        String charSequence = applicationInfo.labelRes == 0 ? applicationInfo.nonLocalizedLabel.toString() : activity.getString(applicationInfo.labelRes);
        builder.setMessage("You must enable accessibility permissions for the app '" + charSequence + "'");
        builder.setCancelable(true);
        builder.setNeutralButton("ok", new DialogInterface.OnClickListener() { // from class: com.romellfudi.ussdlibrary.USSDController.1
            @Override // android.content.DialogInterface.OnClickListener
            public void onClick(DialogInterface dialogInterface, int i) {
                activity.startActivityForResult(new Intent("android.settings.ACCESSIBILITY_SETTINGS"), 1);
            }
        });
        AlertDialog create = builder.create();
        if (create != null) {
            create.show();
        }
    }

    private static void openSettingsOverlay(final Activity activity) {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle("USSD Overlay permission");
        ApplicationInfo applicationInfo = activity.getApplicationInfo();
        String charSequence = applicationInfo.labelRes == 0 ? applicationInfo.nonLocalizedLabel.toString() : activity.getString(applicationInfo.labelRes);
        builder.setMessage("You must allow for the app to appear '" + charSequence + "' on top of other apps.");
        builder.setCancelable(true);
        builder.setNeutralButton("ok", new DialogInterface.OnClickListener() { // from class: com.romellfudi.ussdlibrary.USSDController.2
            @Override // android.content.DialogInterface.OnClickListener
            public void onClick(DialogInterface dialogInterface, int i) {
                activity.startActivity(new Intent("android.settings.action.MANAGE_OVERLAY_PERMISSION", Uri.parse("package:" + activity.getPackageName())));
            }
        });
        AlertDialog create = builder.create();
        if (create != null) {
            create.show();
        }
    }

    protected static boolean isAccessiblityServicesEnable(Context context) {
        AccessibilityManager accessibilityManager = (AccessibilityManager) context.getSystemService("accessibility");
        if (accessibilityManager == null) {
            return false;
        }
        for (AccessibilityServiceInfo accessibilityServiceInfo : accessibilityManager.getInstalledAccessibilityServiceList()) {
            if (accessibilityServiceInfo.getId().contains(context.getPackageName())) {
                return isAccessibilitySettingsOn(context, accessibilityServiceInfo.getId());
            }
        }
        return false;
    }

    protected static boolean isAccessibilitySettingsOn(Context context, String str) {
        int i;
        String string;
        try {
            i = Settings.Secure.getInt(context.getApplicationContext().getContentResolver(), "accessibility_enabled");
        } catch (Settings.SettingNotFoundException unused) {
            i = 0;
        }
        if (i == 1 && (string = Settings.Secure.getString(context.getApplicationContext().getContentResolver(), "enabled_accessibility_services")) != null) {
            TextUtils.SimpleStringSplitter simpleStringSplitter = new TextUtils.SimpleStringSplitter(':');
            simpleStringSplitter.setString(string);
            while (simpleStringSplitter.hasNext()) {
                if (simpleStringSplitter.next().equalsIgnoreCase(str)) {
                    return true;
                }
            }
        }
        return false;
    }
}
