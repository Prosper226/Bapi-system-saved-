package com.romellfudi.ussdlibrary;

import com.romellfudi.ussdlibrary.USSDController;
import java.util.HashMap;
import java.util.HashSet;

/* loaded from: classes.dex */
public interface USSDApi {
    void callUSSDInvoke(String str, int i, HashMap<String, HashSet<String>> hashMap, USSDController.CallbackInvoke callbackInvoke);

    void callUSSDInvoke(String str, HashMap<String, HashSet<String>> hashMap, USSDController.CallbackInvoke callbackInvoke);

    void callUSSDOverlayInvoke(String str, int i, HashMap<String, HashSet<String>> hashMap, USSDController.CallbackInvoke callbackInvoke);

    void callUSSDOverlayInvoke(String str, HashMap<String, HashSet<String>> hashMap, USSDController.CallbackInvoke callbackInvoke);

    void cancel();

    void send(String str, USSDController.CallbackMessage callbackMessage);
}
