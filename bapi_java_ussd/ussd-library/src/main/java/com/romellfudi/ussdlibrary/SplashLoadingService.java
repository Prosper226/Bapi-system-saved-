package com.romellfudi.ussdlibrary;

import android.app.Service;
import android.content.Intent;
import android.graphics.Point;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

/* loaded from: classes.dex */
public class SplashLoadingService extends Service {
    private LinearLayout layout;
    private WindowManager wm;

    @Override // android.app.Service
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override // android.app.Service
    public int onStartCommand(Intent intent, int i, int i2) {
        this.wm = (WindowManager) getSystemService("window");
        this.wm.getDefaultDisplay().getSize(new Point());
        int i3 = Build.VERSION.SDK_INT >= 26 ? 2038 : 2002;
        int i4 = (int) ((100 * getResources().getDisplayMetrics().density) + 0.5f);
        LinearLayout linearLayout = new LinearLayout(this);
        this.layout = linearLayout;
        linearLayout.setBackgroundColor(R.color.blue_background);
        this.layout.setOrientation(1);
        WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams(-1, -1, i3, 40, 4);
        ImageView imageView = new ImageView(this);
        imageView.setImageResource(R.drawable.favico);
        imageView.setPaddingRelative(0, i4, 0, i4);
        LinearLayout.LayoutParams layoutParams2 = new LinearLayout.LayoutParams(-1, 0);
        layoutParams2.gravity = 17;
        layoutParams2.weight = 1.0f;
        RelativeLayout relativeLayout = new RelativeLayout(this);
        RelativeLayout.LayoutParams layoutParams3 = new RelativeLayout.LayoutParams(-1, -1);
        layoutParams3.addRule(13, -1);
        relativeLayout.addView(imageView, layoutParams3);
        this.layout.addView(relativeLayout, layoutParams2);
        GifImageView gifImageView = new GifImageView(this);
        gifImageView.setGifImageResource(R.drawable.loading);
        gifImageView.setPaddingRelative(0, i4, 0, i4);
        RelativeLayout relativeLayout2 = new RelativeLayout(this);
        RelativeLayout.LayoutParams layoutParams4 = new RelativeLayout.LayoutParams(-1, -1);
        layoutParams4.addRule(13, -1);
        relativeLayout2.addView(gifImageView, layoutParams4);
        this.layout.addView(relativeLayout2, layoutParams2);
        this.wm.addView(this.layout, layoutParams);
        return 1;
    }

    @Override // android.app.Service
    public void onCreate() {
        super.onCreate();
    }

    @Override // android.app.Service
    public void onDestroy() {
        super.onDestroy();
        new Handler().postDelayed(new Runnable() { // from class: com.romellfudi.ussdlibrary.SplashLoadingService.1
            @Override // java.lang.Runnable
            public void run() {
                if (SplashLoadingService.this.layout != null) {
                    SplashLoadingService.this.wm.removeView(SplashLoadingService.this.layout);
                    SplashLoadingService.this.layout = null;
                }
            }
        }, 500L);
    }
}
