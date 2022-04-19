package com.romellfudi.ussdlibrary;

import android.accessibilityservice.AccessibilityService;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.os.Bundle;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat;
import java.util.ArrayList;
import java.util.List;

/* loaded from: classes.dex */
public class USSDService extends AccessibilityService {
    private static String TAG = "USSDService";
    private static AccessibilityEvent event;

    @Override // android.accessibilityservice.AccessibilityService
    public void onAccessibilityEvent(AccessibilityEvent accessibilityEvent) {
        event = accessibilityEvent;
        Log.d(TAG, "onAccessibilityEvent");
        Log.d(TAG, String.format("onAccessibilityEvent: [type] %s [class] %s [package] %s [time] %s [text] %s", Integer.valueOf(accessibilityEvent.getEventType()), accessibilityEvent.getClassName(), accessibilityEvent.getPackageName(), Long.valueOf(accessibilityEvent.getEventTime()), accessibilityEvent.getText()));

        if (USSDController.instance != null && USSDController.instance.isRunning.booleanValue()) {
            if (LoginView(accessibilityEvent) && notInputText(accessibilityEvent)) {
                clickOnButton(accessibilityEvent, 0);
                USSDController.instance.isRunning = false;
                USSDController.instance.callbackInvoke.over(accessibilityEvent.getText().get(0).toString());
            } else if (problemView(accessibilityEvent) || LoginView(accessibilityEvent)) {
                clickOnButton(accessibilityEvent, 1);
                USSDController.instance.callbackInvoke.over(accessibilityEvent.getText().get(0).toString());
            } else if (isUSSDWidget(accessibilityEvent)) {
                String charSequence = accessibilityEvent.getText().get(0).toString();
                if (charSequence.contains("\n")) {
                    charSequence = charSequence.substring(charSequence.indexOf(10) + 1);
                }
                if (notInputText(accessibilityEvent)) {
                    clickOnButton(accessibilityEvent, 0);
                    USSDController.instance.isRunning = false;
                    USSDController.instance.callbackInvoke.over(charSequence);
                } else if (USSDController.instance.send.booleanValue()) {
                    USSDController.instance.callbackMessage.responseMessage(charSequence);
                } else {
                    USSDController.instance.callbackInvoke.responseInvoke(charSequence);
                }
            }
        }
    }

    public static void send(String str) {
        setTextIntoField(event, str);
        clickOnButton(event, 1);
    }

    public static void cancel() {
        clickOnButton(event, 0);
    }

    private static void setTextIntoField(AccessibilityEvent accessibilityEvent, String str) {
        USSDController uSSDController = USSDController.instance;
        Bundle bundle = new Bundle();
        bundle.putCharSequence(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, str);
        for (AccessibilityNodeInfo accessibilityNodeInfo : getLeaves(accessibilityEvent)) {
            if (accessibilityNodeInfo.getClassName().equals("android.widget.EditText") && !accessibilityNodeInfo.performAction(2097152, bundle)) {
                ClipboardManager clipboardManager = (ClipboardManager) uSSDController.context.getSystemService("clipboard");
                if (clipboardManager != null) {
                    clipboardManager.setPrimaryClip(ClipData.newPlainText("text", str));
                }
                accessibilityNodeInfo.performAction(32768);
            }
        }
    }

    protected static boolean notInputText(AccessibilityEvent accessibilityEvent) {
        boolean z = true;
        for (AccessibilityNodeInfo accessibilityNodeInfo : getLeaves(accessibilityEvent)) {
            if (accessibilityNodeInfo.getClassName().equals("android.widget.EditText")) {
                z = false;
            }
        }
        return z;
    }

    private boolean isUSSDWidget(AccessibilityEvent accessibilityEvent) {
        return accessibilityEvent.getClassName().equals("amigo.app.AmigoAlertDialog") || accessibilityEvent.getClassName().equals("android.app.AlertDialog");
    }

    private boolean LoginView(AccessibilityEvent accessibilityEvent) {
        return isUSSDWidget(accessibilityEvent) && USSDController.instance.map.get("KEY_LOGIN").contains(accessibilityEvent.getText().get(0).toString());
    }

    protected boolean problemView(AccessibilityEvent accessibilityEvent) {
        return isUSSDWidget(accessibilityEvent) && USSDController.instance.map.get("KEY_ERROR").contains(accessibilityEvent.getText().get(0).toString());
    }

    protected static void clickOnButton(AccessibilityEvent accessibilityEvent, int i) {
        int i2 = -1;
        for (AccessibilityNodeInfo accessibilityNodeInfo : getLeaves(accessibilityEvent)) {
            if (accessibilityNodeInfo.getClassName().toString().toLowerCase().contains("button") && (i2 = i2 + 1) == i) {
                accessibilityNodeInfo.performAction(16);
            }
        }
    }

    private static List<AccessibilityNodeInfo> getLeaves(AccessibilityEvent accessibilityEvent) {
        ArrayList arrayList = new ArrayList();
        if (accessibilityEvent.getSource() != null) {
            getLeaves(arrayList, accessibilityEvent.getSource());
        }
        return arrayList;
    }

    private static void getLeaves(List<AccessibilityNodeInfo> list, AccessibilityNodeInfo accessibilityNodeInfo) {
        if (accessibilityNodeInfo.getChildCount() == 0) {
            list.add(accessibilityNodeInfo);
            return;
        }
        for (int i = 0; i < accessibilityNodeInfo.getChildCount(); i++) {
            getLeaves(list, accessibilityNodeInfo.getChild(i));
        }
    }

    @Override // android.accessibilityservice.AccessibilityService
    public void onInterrupt() {
        Log.d(TAG, "onInterrupt");
    }

    @Override // android.accessibilityservice.AccessibilityService
    protected void onServiceConnected() {
        super.onServiceConnected();
        Log.d(TAG, "onServiceConnected");
    }
}
