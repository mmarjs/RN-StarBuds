package com.starbuds;

import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.beefe.picker.PickerViewPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.crashlytics.android.Crashlytics;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.imagepicker.ImagePickerPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.mybigday.rnmediameta.RNMediaMetaPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.projectseptember.RNGL.RNGLPackage;
import com.reactlibrary.RNThumbnailPackage;
import com.smixx.fabric.FabricPackage;
import com.wix.RNCameraKit.RNCameraKitPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;

import cl.json.RNSharePackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import io.codebakery.imagerotate.ImageRotatePackage;
import io.fabric.sdk.android.Fabric;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;

//import com.lwansbrough.RCTCamera.*;

public class MainApplication extends MultiDexApplication implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new RNFirebasePackage(),
            new RNFirebasePackage(),
                    new ImageResizerPackage(),
                    new ImageRotatePackage(),
                    new RNFirebasePackage(),
                    new ReactNativeConfigPackage(),
                    new RNSharePackage(),
                    new LinearGradientPackage(),
                    new RNCameraKitPackage(),
                    new RCTCameraPackage(),
                    new FabricPackage(),
                    new SnackbarPackage(),
                    new ReactNativePushNotificationPackage(),
                    new RNGLPackage(),
                    new ReactVideoPackage(),
                    new VectorIconsPackage(),
                    new RNThumbnailPackage(),
                    new RNMediaMetaPackage(),
                    new RNFetchBlobPackage(),
                    new SplashScreenReactPackage(),
                    new ImagePickerPackage(),
                    new PickerViewPackage(),
                    new RNFirebaseFirestorePackage(),
//          new PermissionPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new VideoCroppingManagerPackage()
            );
        }
    };

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        Fabric.with(this, new Crashlytics());
        super.onCreate();
        FacebookSdk.sdkInitialize(getApplicationContext());
        Fabric.with(this, new Crashlytics());
        // If you want to use AppEventsLogger to log events.
        AppEventsLogger.activateApp(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
}