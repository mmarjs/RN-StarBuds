package com.wix.RNCameraKit.camera.permission;

import com.wix.RNCameraKit.camera.CameraKitModule;

public class CameraPermissionRequestCallback {

    private CameraKitModule CameraKitModule;

    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        CameraKitModule.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    public void setCameraKitModule(CameraKitModule CameraKitModule) {
        this.CameraKitModule = CameraKitModule;
    }
}
