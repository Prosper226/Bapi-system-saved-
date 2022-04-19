package com.romellfudi.ussdlibrary;

import android.app.Service;
import android.content.Intent;
import android.graphics.Point;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.view.WindowManager;
import android.widget.Button;

/* loaded from: classes.dex */
public class OverlayShowingService extends Service {
    public static final String EXTRA = "TITTLE";
    private Button overlayedButton;
    private String tittle = null;
    private WindowManager wm;

    @Override // android.app.Service
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override // android.app.Service
    public int onStartCommand(Intent intent, int i, int i2) {
        if (intent.hasExtra(EXTRA)) {
            this.tittle = intent.getStringExtra(EXTRA);
        }
        this.wm = (WindowManager) getSystemService("window");
        Point point = new Point();
        this.wm.getDefaultDisplay().getSize(point);
        int i3 = Build.VERSION.SDK_INT >= 26 ? 2038 : 2002;
        Button button = new Button(this);
        this.overlayedButton = button;
        button.setText(this.tittle);
        this.overlayedButton.setAlpha(0.7f);
        this.overlayedButton.setBackgroundColor(-1);
        this.overlayedButton.setTextSize(2, 26.0f);
        WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams(-1, point.y - 200, i3, 40, -3);
        layoutParams.gravity = 17;
        this.wm.addView(this.overlayedButton, layoutParams);
        return 1;
    }

    @Override // android.app.Service
    public void onCreate() {
        super.onCreate();
    }

    @Override // android.app.Service
    public void onDestroy() {
        super.onDestroy();
        new Handler().postDelayed(new Runnable() { // from class: com.romellfudi.ussdlibrary.OverlayShowingService.1
            @Override // java.lang.Runnable
            public void run() {
                if (OverlayShowingService.this.overlayedButton != null) {
                    OverlayShowingService.this.wm.removeView(OverlayShowingService.this.overlayedButton);
                    OverlayShowingService.this.overlayedButton = null;
                }
            }
        }, 500L);
    }
}
