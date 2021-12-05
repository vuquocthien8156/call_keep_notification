package com.thien.vu.callnotification;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class CallKeepModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    CallKeepModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "CallkeepHelperModule";
    }

    @RequiresApi(api = Build.VERSION_CODES.O_MR1)
    @ReactMethod
    public void dismissKeyguard(Activity activity){
        KeyguardManager keyguardManager = (KeyguardManager) reactContext.getSystemService(
                Context.KEYGUARD_SERVICE
        );
        boolean isLocked = keyguardManager.isKeyguardLocked();
        if (isLocked) {
            Log.d("CallkeepHelperModule", "lockscreen");
            keyguardManager.requestDismissKeyguard(
                    activity,
                    new KeyguardManager.KeyguardDismissCallback() {
                        @Override
                        public void onDismissError() {
                            Log.d("CallkeepHelperModule", "onDismissError");
                        }

                        @Override
                        public void onDismissSucceeded() {
                            Log.d("CallkeepHelperModule", "onDismissSucceeded");
                        }

                        @Override
                        public void onDismissCancelled() {
                            Log.d("CallkeepHelperModule", "onDismissCancelled");
                        }
                    }
            );
        } else {
            Log.d("CallkeepHelperModule", "unlocked");
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.O_MR1)
    @ReactMethod
    public void startActivity() {
        Log.d("CallkeepHelperModule", "start activity");
        Context context = getAppContext();
        String packageName = context.getApplicationContext().getPackageName();
        Intent focusIntent = context.getPackageManager().getLaunchIntentForPackage(packageName).cloneFilter();
        Activity activity = getCurrentActivity();
        boolean isRunning = activity != null;

        if(isRunning){
            Log.d("CallkeepHelperModule", "activity is running");
            focusIntent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            activity.startActivity(focusIntent);
            dismissKeyguard(activity);
        } else {
            Log.d("CallkeepHelperModule", "activity is not running, starting activity");
            focusIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK + Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            context.startActivity(focusIntent);
        }
    }

    private Context getAppContext() {
        return this.reactContext.getApplicationContext();
    }
}
