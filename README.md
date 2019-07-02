# README #
* This is Starbuds react-native app repository.

* Create app if not available
  1. $ react-native init StarbudsMobileApp
  2. $ cd StarbudsMobileApp
  3. Setup eslint
      3.1 Install eslinter for your editor
      3.2 $ npm install --save--dev eslint-config-rallycoding
      3.3 add .eslintrc file in project root and put following code in it
          {
            "extednds": "rallycoding"
          }

  * Install react-navigation
    $ npm install --save react-navigation

  * Install Redux
    $ npm install --save react-redux
    $ npm install --save redux
    $ npm install --save prop-types

  * NOTE FOR DEVELOPERS
    1. Download node_modules installed by other developeres inside your working project directory every time you checkout or take a pull.
    $npm install
    2. Put external modules as "import * as modulename from 'modulename'" if "import modulename from 'modulename'" does not work

  * Configuration
    1. # Install the latest version of react-navigation from npm
      $ npm install --save react-navigation
    2. # Page navigation
      $ npm install react-navigation
    3. # Install Redux
      $ npm install  redux --save
    4. # Install react-native-scrollable-tab-view
      $ npm install react-native-scrollable-tab-view --save

  * Dependencies
    Refer package.json file for npm dependencies.
    To download already installed npm dependencies, run '$npm install' inside project directory.

  * Run instructions
    1. For android
      $ react-native run-android
    2. For ios
      $ react-native run-ios

  * React-Native-Datepicker:
  $ npm install react-native-datepicker --save

  export ANDROID_HOME=/Users/Nakul.Kundaliya/Library/Android/sdk/
  export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
  export PATH="/Users/Nakul.Kundaliya/.npm-packages/bin/:$PATH"
  # Install React Native Camera
  `$ npm install --save react-native-fetch-blob`
  `$ npm install --save react-native-camera@0.6`
  `$ react-native link react-native-camera`

  **Permissions**

  To enable video recording feature you have to add the following code to the AndroidManifest.xml:

  `<uses-permission android:name="android.permission.RECORD_AUDIO"/>
  <uses-permission android:name="android.permission.RECORD_VIDEO"/>
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />`

  Info.plist

  `<key>NSCameraUsageDescription</key>
  <string>Your message to user when the camera is accessed for the first time</string>

  <!-- Include this only if you are planning to use the camera roll -->
  <key>NSPhotoLibraryUsageDescription</key>
  <string>Your message to user when the photo library is accessed for the first time</string>

  <!-- Include this only if you are planning to use the microphone for video recording -->
  <key>NSMicrophoneUsageDescription</key>
  <string>Your message to user when the microsphone is accessed for the first time</string>`


  # Install react-native-camera-roll-picker

  `$ npm install react-native-camera-roll-picker --save`
  `$ react-native link react-native-camera-roll-picker`

  *** IOS Configuration in Xcode **
  1. drag '`RCTCameraRoll.xcodeproj`' from '`node_modules/react-native/Libraries/cameraRoll/RCTCameraRoll.xcodeproj`' to project_name/Libraries
  2. Selecte your project -> Go to Build Phases -> Link Binary with Libraries -> add `libRTCCameraRoll.a`


  *** Custom lib code *** ( NOW NOT NEED TO CHANGE LIB CODE )

  1. Open Xcode
  2. Goto -> Libraries -> RCTCameraRoll.xcodeproj -> RCTCameraRollManager.m
  3. Replace code from https://docs.zoho.com/ws/project/file/13iol3d9f7768c40d41209603befd2e423062


  ### Change Gallery View icon
  1. go to node_modules/react-native-camera-roll-picker and paste image
     - selected-multiple-image.png
     - multiple-image.png
  2. Change ImageItem.js file rendar() code

  ```
  render() {
    var {item, selected, selectedMarker, imageMargin} = this.props;

    var _selectedMarker = <Image
          style={[styles.marker, {width: 25, height: 25}]}
          source={require('./selected-multiple-image.png')}
          />;
    var _marker = <Image
          style={[styles.marker, {width: 25, height: 25}]}
          source={require('./multiple-image.png')}
          />;
    var image = item.node.image;

    return (
      <TouchableOpacity
        style={{marginBottom: imageMargin, marginRight: imageMargin}}
        onPress={() => this._handleClick(image)}>
        <Image
          source={{uri: image.uri}}
          style={{height: this._imageSize, width: this._imageSize}} >
          { (selected) ? _selectedMarker : _marker }
        </Image>
      </TouchableOpacity>
    );
  }
  ```
  3.  Replace TouchableOpacity with TouchableWithoutFeedback


  ref : https://github.com/jeanpan/react-native-camera-roll-picker/pull/35/files

  replace node_modules/react-native-camera-roll-picker/index.js
  https://docs.zoho.com/ws/project/file/45g19fcb3ca8414ab4ef7932873e21c298b0f

  # Change Camera lib
  1. Open Xcode
  2. Go to Libraries -> RCTCamera.xcodeproj -> RCTCameraManager.m
  3. Replace following code inside saveImage function
  ```
  else if (target == RCTCameraCaptureTargetCameraRoll) {
  [[[ALAssetsLibrary alloc] init] writeImageDataToSavedPhotosAlbum:imageData metadata:metadata completionBlock:^(NSURL* url, NSError* error) {
    if (error == nil) {
      //path isn't really applicable here (this is an asset uri), but left it in for backward comparability

        NSArray       *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString  *documentsDirectory = [paths objectAtIndex:0];
        NSTimeInterval timeStamp = [[NSDate date] timeIntervalSince1970];
        // NSTimeInterval is defined as double
        NSString  *filePath = [NSString stringWithFormat:@"%@/%@", documentsDirectory,[NSString stringWithFormat:@"%@.jpg",[NSNumber numberWithDouble: timeStamp]]];
        [imageData writeToFile:filePath atomically:YES];
        NSLog(@"%@",filePath);
      resolve(@{@"path":filePath, @"mediaUri":[url absoluteString]});
    }
    else {
      reject(RCTErrorUnspecified, nil, RCTErrorWithMessage(error.description));
    }
  }];
  return;
  }
  ```

  # install react-native-save-asset-library

  https://github.com/nakulkundaliya/react-native-save-asset-library

  # Install react-native-parallax-scroll-view

  `$ npm install react-native-parallax-scroll-view --save`
  `$ react-native link`

  # Install react-native-progress
   
   ` npm install react-native-progress --save`
  - Add the ART.xcodeproj (found in node_modules/react-native/Libraries/ART) to the Libraries group and add libART.a
  * Login With Facebook
   $ react-native install react-native-fbsdk
   $ react-native link react-native-fbsdk
    * Android setup:
    1. The MainApplication.java file in project/android/app/java/com.<project_name> should be like following:

      package com.starbudsmobileapp;

      import android.app.Application;

      import com.facebook.react.ReactApplication;
      import com.facebook.react.ReactNativeHost;
      import com.facebook.react.ReactPackage;
      import com.facebook.react.shell.MainReactPackage;
      import com.facebook.soloader.SoLoader;

      import com.facebook.CallbackManager;
      import com.facebook.FacebookSdk;
      import com.facebook.reactnative.androidsdk.FBSDKPackage;
      import com.facebook.appevents.AppEventsLogger;

      import java.util.Arrays;
      import java.util.List;

      public class MainApplication extends Application implements ReactApplication {

      private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

      protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
      }

      private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          return Arrays.<ReactPackage>asList(
                  new MainReactPackage(),
                  new FBSDKPackage(mCallbackManager)
          );
        }
      };

      @Override
      public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
      }

      @Override
      public void onCreate() {
        super.onCreate();
        FacebookSdk.sdkInitialize(getApplicationContext());
        // If you want to use AppEventsLogger to log events.
        AppEventsLogger.activateApp(this);
      }
      }

    2. The MainActivity.java file in project/android/src/main/com.<project_name> should be like following:
      package com.starbudsmobileapp;

      import android.content.Intent;
      import com.facebook.react.ReactActivity;

      public class MainActivity extends ReactActivity {

        @Override
        public void onActivityResult(int requestCode, int resultCode, Intent data) {
            super.onActivityResult(requestCode, resultCode, data);
            MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
        }

        /**
         * Returns the name of the main component registered from JavaScript.
         * This is used to schedule rendering of the component.
         */
        @Override
        protected String getMainComponentName() {
            return "StarbudsMobileApp";
        }
      }

      3. Add <string name="facebook_app_id">1493568040665395</string> in strings.xml in project/android/src/res/values/strings.xml
      4. Add AndroidManifest
      `<meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>
        <provider android:authorities="com.facebook.app.FacebookContentProvider1234"
            android:name="com.facebook.FacebookContentProvider"
            android:exported="true" />`
      5. Facebook hash key generation

        keytool -exportcert -alias starbuds-key-alias -keystore starbuds.keystore | openssl sha1 -binary | openssl base64
        
    * IOS setup:
      1. Add fbsdks under frameworks in ios project folder.
      2. Set its path in build info
      3. AppDelegate.m should be as following
        //  AppDelegate.m

        #import "AppDelegate.h"

        #import <React/RCTBundleURLProvider.h>
        #import <React/RCTRootView.h>
        #import <FBSDKCoreKit/FBSDKCoreKit.h>
        @implementation AppDelegate

        - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
        {
          NSURL *jsCodeLocation;

          jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

          RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                              moduleName:@"StarbudsMobileApp"
                                                       initialProperties:nil
                                                           launchOptions:launchOptions];
          rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

          self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
          UIViewController *rootViewController = [UIViewController new];
          rootViewController.view = rootView;
          self.window.rootViewController = rootViewController;
          [self.window makeKeyAndVisible];
          [[FBSDKApplicationDelegate sharedInstance] application:application
                                   didFinishLaunchingWithOptions:launchOptions];
          return YES;
        }
        - (BOOL)application:(UIApplication *)application
                    openURL:(NSURL *)url
                    options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

          BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                                        openURL:url
                                                              sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                                     annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
                          ];
          // Add any custom logic here.
          return handled;
        }

        @end
        4. Edit info.plist

        <key>CFBundleURLTypes</key>
        <array>
          <dict>
            <key>CFBundleURLSchemes</key>
            <array>
              <string>fb1493568040665395</string>
            </array>
          </dict>
        </array>
        <key>FacebookAppID</key>
        <string>1493568040665395</string>
        <key>FacebookDisplayName</key>
        <string>Starbuds</string>
        <key>LSApplicationQueriesSchemes</key>
        <array>
          <string>fbapi</string>
          <string>fb-messenger-api</string>
          <string>fbauth2</string>
          <string>fbshareextension</string>
        </array>
        <key>NSPhotoLibraryUsageDescription</key>
          <string>Used to take upload photo</string>

# Install font
  Add Fonts to Assets -> “assets/fonts”

  Package.json "rnpm": { "assets": [ "./assets/fonts/" ] },

$ react-native link

## react-native-stopwatch-timer
  $ npm install react-native-stopwatch-timer --save

  * Custom lib code
  1. Open 'node_modules/react-native-stopwatch-timer/lib/stopwatch.js'
  2. replace following code line number 105
   ```
   if(this.props.msecs) {
     formatted = `${minutes < 10 ?
       0 : ""}${minutes}:${seconds < 10 ?
         0 : ""}${seconds}`;
   } else {
     formatted = `${minutes < 10 ?
       0 : ""}${minutes}:${seconds < 10 ? 0 : "" }${seconds}`;
   }
  ```
 

###react-native-s3
    * npm install react-native-s3 --save

    * Android

      1. Edit android/settings.gradle of your project:
          ...
          include ':react-native-s3'
          project(':react-native-s3').projectDir = new File(settingsDir, '../node_modules/react-native-s3/android')
      2. Edit android/app/build.gradle of your project:
          ...
          dependencies {
            ...
            compile project(':react-native-s3')
          }
      3. Add package to MainApplication.java
        ```java
        ......

        import com.mybigday.rns3.*;   // import

        public class MainApplication extends Application implements ReactApplication {
        private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
          ......

          @Override
          protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new RNS3Package(),  // add package
            );
          }
        };

        ......
        }
        ```
      4. Edit android/app/src/main/AndroidManifest.xml of your project:
        ```xml
        <service
          android:name="com.amazonaws.mobileconnectors.s3.transferutility.TransferService"
          android:enabled="true" />
        ```
    * iOS

        NOTE Only supported iOS ^8.0.

        In XCode, in the project navigator:

        1. Right click Libraries ➜ Add Files to [your project's name], Add node_modules/react-native-s3/ios/RNS3.xcodeproj.
        2. Add libRNS3.a to your project's Build Phases ➜ Link Binary With Libraries
        3. Add $(SRCROOT)/../node_modules/react-native-s3/ios to Header Search Paths, and mark it as recursive.
        4. Add $(SRCROOT)/../node_modules/react-native-s3/ios/Frameworks to your project's Build Settings ➜ Framework Search Paths
        5. Add
            node_modules/react-native-s3/ios/Frameworks/AWSCognito.framework ,
            node_modules/react-native-s3/ios/Frameworks/AWSCore.framework ,
            node_modules/react-native-s3/ios/Frameworks/AWSS3.framework
          to your project's General → Embedded Binaries
        6. Edit AppDelegate.m of your project
        ```objective-c
        #import "RNS3TransferUtility.h"
          ....
        	- (void)application:(UIApplication *)application handleEventsForBackgroundURLSession:(NSString *)identifier completionHandler:(void (^)())completionHandler {
                  [RNS3TransferUtility interceptApplication:application
                        handleEventsForBackgroundURLSession:identifier
                                          completionHandler:completionHandler];
                }
          ....
        ```

###react-native-image-picker
    * npm install react-native-image-picker@latest --save

    * react-native link react-native-image-picker

    ### Android Setup
    * Update the android build tools version to 2.2.+ in android/build.gradle:
        buildscript {
            ...
            dependencies {
                classpath 'com.android.tools.build:gradle:2.2.+' // <- USE 2.2.+ version
            }
            ...
        }

    * Update the gradle version to 2.14.1 in android/gradle/wrapper/gradle-wrapper.properties:

        ...
        distributionUrl=https\://services.gradle.org/distributions/gradle-2.14.1-all.zip

    * Add the required permissions in AndroidManifest.xml:

        <uses-permission android:name="android.permission.CAMERA" />
        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>

    ### IOS setup
    * For iOS 10+, Add the NSPhotoLibraryUsageDescription, NSCameraUsageDescription, and NSMicrophoneUsageDescription (if allowing video) keys to your Info.plist with strings describing why your app needs these permissions. Note: You will get a SIGABRT crash if you don't complete this step.
     Eg.
      NSPhotoLibraryUsageDescription = Uses Photo Library to get user's picture
      NSCameraUsageDescription = Uses Camera to get user's picture



###react-native-splash-screen
    * npm i react-native-splash-screen --save

    * react-native link react-native-splash-screen

###TimerMixin
    * npm i react-timer-mixin --save

###react-native-offline-placeholder
    * npm install --save react-native-offline-placeholder

###react-native-google-places-autocomplete
    * npm install react-native-google-places-autocomplete --save

###react-native-checkbox
    * react-native install react-native-check-box

###react-native-push-notifications
  For android setup refer: https://github.com/zo0r/react-native-push-notification/blob/master/trouble-shooting.md#android-tips
  
###react-native-linear-gradient
    * react-native install react-native-linear-gradient

###rreact-native-actionsheet
    * react-native install react-native-actionsheet
    
###react-native-read-more-text
  npm i react-native-read-more-text --save
  
###react-native-image-rotate
  This libarary has error in react-native-image-rotate/android/src/main/java/io/codebakery/imagerotate/ImageRotatePackage.java
  To fix it comment the 
  @override
  at node_modules/react-native-image-rotate/android/src/main/java/io/codebakery/imagerotate/ImageRotatePackage.java:<line no in error>

  Refer https://github.com/dgladkov/react-native-image-rotate/issues/7

### Generating Signed APK
 ##NOTE: Before generating the signed apk, we need to add the starbuds.keystore key's sha-1 in google project and get the updated google-services.json from firebase. And get the new api key for location service, put it in Metrics.js in starbuds/theme/Metrics.js.

 #To get SHA-1 from starbuds.keystore run followiong:
    1. Download the starbuds.keystore from zoho and put it in path-of-project/android/app/
    2. cd path-of-project/android/app/
    3. keytool -list -v -keystore starbuds.keystore -alias starbuds-key-alias -storepass 123456 -keypass 123456

 1. cd path-to-the-project/android/app
 2. If we don't have starbuds.keystore, run following in terminal and uplod the key in zoho as well as Starbuds team in Teams:
    keytool -genkey -v -keystore starbuds.keystore -alias starbuds-key-alias -keyalg RSA -keysize 2048 -validity 10000
    password - 123456

 3. Setting up gradle variables #
    - Edit the file path-of-project/android/gradle.properties and add the following (replace ***** with the correct keystore password, alias and key password),
    ```
    MYAPP_RELEASE_STORE_FILE=starbuds.keystore
    MYAPP_RELEASE_KEY_ALIAS=starbuds-key-alias
    MYAPP_RELEASE_STORE_PASSWORD=123456
    MYAPP_RELEASE_KEY_PASSWORD=123456
    ```

 4.  Adding signing config to your app's gradle config
    -  android/app/build.gradle
    increase versionCode
      ```
      android {
        defaultConfig {
            versionCode 1
            versionName "1.0"
            {...}
        }
        {...}
      }
      ```
    
    ```
    release {
          if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
              storeFile file(MYAPP_RELEASE_STORE_FILE)
              storePassword MYAPP_RELEASE_STORE_PASSWORD
              keyAlias MYAPP_RELEASE_KEY_ALIAS
              keyPassword MYAPP_RELEASE_KEY_PASSWORD
          }
    }
    ```
    - add this inside buildTypes in android/app/build.gradle
    ````
      signingConfig signingConfigs.release
    ````

5. Generating the release APK #
  ```
  $ cd android && ./gradlew assembleRelease
  ```
6. Testing the release build of your app #

  ```
  $ react-native run-android --variant=release

  ```

  # upload Ios build

  http://ikennd.ac/blog/2015/02/stripping-unwanted-architectures-from-dynamic-libraries-in-xcode/

  1. build phase / run script
  2.
  ```APP_PATH="${TARGET_BUILD_DIR}/${WRAPPER_NAME}"

  # This script loops through the frameworks embedded in the application and
  # removes unused architectures.
  find "$APP_PATH" -name '*.framework' -type d | while read -r FRAMEWORK
  do
  FRAMEWORK_EXECUTABLE_NAME=$(defaults read "$FRAMEWORK/Info.plist" CFBundleExecutable)
  FRAMEWORK_EXECUTABLE_PATH="$FRAMEWORK/$FRAMEWORK_EXECUTABLE_NAME"
  echo "Executable is $FRAMEWORK_EXECUTABLE_PATH"

  EXTRACTED_ARCHS=()

  for ARCH in $ARCHS
  do
  echo "Extracting $ARCH from $FRAMEWORK_EXECUTABLE_NAME"
  lipo -extract "$ARCH" "$FRAMEWORK_EXECUTABLE_PATH" -o "$FRAMEWORK_EXECUTABLE_PATH-$ARCH"
  EXTRACTED_ARCHS+=("$FRAMEWORK_EXECUTABLE_PATH-$ARCH")
  done

  echo "Merging extracted architectures: ${ARCHS}"
  lipo -o "$FRAMEWORK_EXECUTABLE_PATH-merged" -create "${EXTRACTED_ARCHS[@]}"
  rm "${EXTRACTED_ARCHS[@]}"

  echo "Replacing original executable with thinned version"
  rm "$FRAMEWORK_EXECUTABLE_PATH"
  mv "$FRAMEWORK_EXECUTABLE_PATH-merged" "$FRAMEWORK_EXECUTABLE_PATH"

  done```

3. add plist

<key>NSCalendarsUsageDescription</key>
	<string>Uses Calandar to get date</string>
	<key>NSBluetoothPeripheralUsageDescription</key>
	<string>Uses Bluetooth to access device bluetooth</string>
	<key>NSSpeechRecognitionUsageDescription</key>
	<string>Uses Speech Recording to record voice.</string>


## icon generate

  1. npm install -g yo generator-rn-toolbox
  2. yo rn-toolbox:assets --icon logo.png

### React native CameraKit
 
$ npm install react-native-camera-kit --save
 
Note Please use code from https://github.com/nakulkundaliya/react-native-camera-kit
IOS
* Locate the module lib folder in your node modules: PROJECT_DIR/node_modules/react-native-camera-kit/ios/lib
* Drag the ReactNativeCameraKit.xcodeproj project file into your project
* Add libReactNativeCameraKit.a to all your target Linked Frameworks and Libraries (prone to be forgotten)

* Replace Native file
1.  Open Xcode 
2. Go to Libraries/ReactNativeCameraKit.xcodeproj/ReactNativeCameraKit/
3. Download following files and replace it
   CKGalleryViewManager.m
   CKGalleryCollectionViewCell.m
   CKGalleryCustomCollectionViewCell.m

* POD Installation
  Goto-> ios folder in your terminal and type pod install for getting react-native-firebase API to work
  Also open Starbuds.xcworkspace file in ios folder in Xcode after installing pods

ADD compile 'com.google.android.gms:play-services-gcm:11.4.2' in build.grade for react-native push notification for version compatibility with Firebase GCM module.

* FBSDK error in Android for resources not found
  Resolution
  https://stackoverflow.com/questions/47757074/react-native-fbsdk-error-no-resource-found-that-matches-the-given-name-attr-a
  Go to Reat-Native Project : android/build.gradle file and restrict fbsdk Version to 4.28.0


* install fabric's crashlytics by
  first pod install the fabric package for ios and then on the terminal
  ````react-native install react-native-fabric````

* if android build fails due to conflict of versions of play services goto
  react-native-push-notifaction-> build.gradle and change 
  ````compile 'com.google.android.gms:play-services-gcm:11.6.0'````

* on react-native link firebase is linked multiple times in android,
   remove multiple imports and multiple invocations from MainApplication.java
    ````import io.invertase.firebase.RNFirebasePackage;
    new RNFirebasePackage()````