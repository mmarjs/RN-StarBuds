package com.starbuds;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaPlayer;
import android.net.Uri;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.github.hiteshsondhi88.libffmpeg.FFmpeg;
import com.github.hiteshsondhi88.libffmpeg.FFmpegExecuteResponseHandler;
import com.github.hiteshsondhi88.libffmpeg.LoadBinaryResponseHandler;
import com.github.hiteshsondhi88.libffmpeg.exceptions.FFmpegCommandAlreadyRunningException;
import com.github.hiteshsondhi88.libffmpeg.exceptions.FFmpegNotSupportedException;

import java.io.File;
import java.io.IOException;

//import com.github.hiteshsondhi88.libffmpeg.FFmpegExecuteResponseHandler;
//import com.github.hiteshsondhi88.libffmpeg.LoadBinaryResponseHandler;
//import com.github.hiteshsondhi88.libffmpeg.exceptions.FFmpegCommandAlreadyRunningException;
//import com.github.hiteshsondhi88.libffmpeg.exceptions.FFmpegNotSupportedException;

/**
 * Created by Nakul.Kundaliya on 26/12/17.
 */

public class VideoCroppingManager extends ReactContextBaseJavaModule {

    private static final String MEDIA_TYPE_IMAGE = "image";
    private static final String MEDIA_TYPE_VIDEO = "video";
    private FFmpeg ffmpeg;

    public VideoCroppingManager(ReactApplicationContext reactContext) {
        super(reactContext);
        ffmpeg = FFmpeg.getInstance(getReactApplicationContext());
        loadFfmpegBinary(getReactApplicationContext());
    }

    @Override
    public String getName() {
        return "VideoCroppingManager";
    }

    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

    //crop the image to be an exact square
    @ReactMethod
    public void cropImage(String imagePath, final Callback callback) {
        Uri imageUri = Uri.parse(imagePath);
        final File croppedImageFile = new File(imageUri.getPath().replace(".jpg", "_square.jpg"));
        String[] cropCommand = new String[]{
                "-i",
                "" + imageUri.getPath(),
                "-vf",
                "crop=" + getSquareResolution(imageUri.getPath(), MEDIA_TYPE_IMAGE),
                "" + croppedImageFile.getAbsolutePath()
        };
        execFffmpegCommand(cropCommand, callback, croppedImageFile);
    }

    @ReactMethod
    public void cropVideo(final String videoPath, final Callback callback) {
        Uri videoUri = Uri.parse(videoPath);
        final File croppedVideoFile = new File(videoUri.getPath().replace(".mp4", "_square.mp4"));
        String[] cropCommand = new String[]{
                "-i",
                "" + videoUri.getPath(),
                "-vf",
                "crop=" + getSquareResolution(videoUri.getPath(), MEDIA_TYPE_VIDEO),
                "-preset",
                "ultrafast",
                "-crf",
                "28",
                "-c:a",
                "copy",
                "" + croppedVideoFile.getAbsolutePath()
        };
        execFffmpegCommand(cropCommand, callback, croppedVideoFile);
    }

    @ReactMethod
    public void execFffmpegCommand(String[] command, final Callback callback, final File croppedFile) {
        try {
            ffmpeg.execute(command, new FFmpegExecuteResponseHandler() {
                @Override
                public void onSuccess(String message) {
                    callback.invoke(croppedFile.getAbsolutePath());
                    Log.d("FFMPEG", "Error" + message);
                }

                @Override
                public void onProgress(String message) {
                    Log.d("FFMPEG", "progress" + message);
                }

                @Override
                public void onFailure(String message) {
                    callback.invoke((Object) null);
                }

                @Override
                public void onStart() {
                    Log.d("FFMPEG", "Start");
                }

                @Override
                public void onFinish() {
                    Log.d("FFMPEG", "Finish");
                }
            });
        } catch (FFmpegCommandAlreadyRunningException e) {
            if (ffmpeg.isFFmpegCommandRunning()) {
                ffmpeg.killRunningProcesses();
            }
            e.printStackTrace();
        }
    }

    private String getSquareResolution(String imagePath, String mediaType) {
        int width = 0;
        int height = 0;
        Uri fileUri = Uri.parse(imagePath);

        if (mediaType.equals(MEDIA_TYPE_VIDEO)) {
            MediaPlayer mediaPlayer = new MediaPlayer();
            try {
                mediaPlayer.setDataSource(fileUri.getPath());
                mediaPlayer.prepare();
                width = mediaPlayer.getVideoWidth();
                height = mediaPlayer.getVideoHeight();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            Bitmap bitmap = BitmapFactory.decodeFile(fileUri.getPath());
            width = bitmap.getWidth();
            height = bitmap.getHeight();
        }
        int requiredSquare = Math.min(width, height);
        int squareStartX = (width - requiredSquare) / 2;
        int squareStartY = (height - requiredSquare) / 2;

        return requiredSquare + ":" + requiredSquare + ":" + squareStartX + ":" + squareStartY;
    }

    private void loadFfmpegBinary(Context context) {
        try {
            ffmpeg.loadBinary(new LoadBinaryResponseHandler() {
                @Override
                public void onFailure() {
                    throw new UnsupportedOperationException("Unsupported Operation");
                }
            });
        } catch (FFmpegNotSupportedException e) {
            throw new UnsupportedOperationException("Unsupported Operation");
        }
    }

//    @Override
//    public void onActivityResult(int requestCode, int resultCode, Intent data) {
//        super.onActivityResult(requestCode, resultCode, data);
//        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
//        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
//            checkPerms();
//        }
//    }
}


