package com.starbuds;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import io.invertase.firebase.RNFirebasePackage;
import org.devio.rn.splashscreen.SplashScreen;
import 	android.app.AlertDialog.Builder; //added
import 	android.app.AlertDialog; //added
import android.content.pm.PackageManager;
import android.os.Build;
import android.provider.Settings;
import 	android.app.AlertDialog.Builder;
import 	android.app.AlertDialog;
import android.content.DialogInterface;
import android.app.Activity;
import android.net.Uri;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

public class MainActivity extends ReactActivity {

    public static Activity activity;
    public static final int PERMISSION_REQ_CODE = 1234; //added
    public static final int OVERLAY_PERMISSION_REQ_CODE = 1235; //added
    /* added */

    String[] perms = {
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.ACCESS_FINE_LOCATION"
    };
    /* added */
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
        Fabric.with(this, new Crashlytics());
        checkPerms();
        activity = this;

    }

    @Override
    protected void onPause() {
        SplashScreen.hide(this);
        super.onPause();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
//        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
//            checkPerms();
//        }
    }

    public void checkPerms() {
    // Checking if device version > 22 and we need to use new permission model
        if(Build.VERSION.SDK_INT>Build.VERSION_CODES.LOLLIPOP_MR1) {
            // Checking if we can draw window overlay
           /* if (!Settings.canDrawOverlays(this)) {
                // Requesting permission for window overlay(needed for all react-native apps)
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            }
            else{ */
                for(String perm : perms){
                    // Checking each persmission and if denied then requesting permissions
                    if(checkSelfPermission(perm) == PackageManager.PERMISSION_DENIED){
                        requestPermissions(perms, PERMISSION_REQ_CODE);
                        break;
                    }
                }
            //}
        }
    }

    @Override
    public void onRequestPermissionsResult(int permsRequestCode, String[] permissions, int[] grantResults){
        switch(permsRequestCode){
            case PERMISSION_REQ_CODE:
                // example how to get result of permissions requests (there can be more then one permission dialog)
                // boolean readAccepted = grantResults[0]==PackageManager.PERMISSION_GRANTED;
                // boolean writeAccepted = grantResults[1]==PackageManager.PERMISSION_GRANTED;
                // checking permissions to prevent situation when user denied some permission
                //checkPerms();
                for(String perm : perms){
                    // Checking each persmission and if denied then requesting permissions
                    if(checkSelfPermission(perm) == PackageManager.PERMISSION_DENIED){
                        new AlertDialog.Builder(MainActivity.this)
                            .setTitle("Star Buds")
                            .setMessage("We did not get required permissions. Please allow them in Settings to Continue.")
                            /*.setPositiveButton("Settings", new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int which) {
                                    startActivityForResult(new Intent(android.provider.Settings.ACTION_SETTINGS), 0);
                                }
                                })*/
                                .setNegativeButton("Exit", new DialogInterface.OnClickListener() {
                                        public void onClick(DialogInterface dialog, int which) {
                                            finish();
                                        }
                                    })
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .setCancelable(false)
                            .show();
                        break;
                    }
                }
                break;

        }
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Starbuds";
    }
}
