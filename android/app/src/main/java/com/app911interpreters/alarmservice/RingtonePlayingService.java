package com.app911interpreters.alarmservice;

import android.annotation.TargetApi;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;


import com.app911interpreters.MainActivity;
import com.app911interpreters.R;
import com.app911interpreters.untils.Const;

/**
 * Created by LUONGCONGDU on 09/05/2017.
 */

public class RingtonePlayingService extends Service {
    MediaPlayer mediaPlayer;
    boolean isRunning;
    

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN)
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.i("Local service", "Receiver start id " + startId + ": " + intent);

        //get the extra string values
        String state = intent.getExtras().getString(Const.ALARM_NOTI);
        String dataTitle = intent.getExtras().getString(Const.ALARM_NOTI_TITLE);
        String dataBody = intent.getExtras().getString(Const.ALARM_NOTI_BODY);
        this.isRunning = false;
        if(mediaPlayer != null){
            mediaPlayer.stop();
            mediaPlayer.reset();
        }
        mediaPlayer = MediaPlayer.create(this, R.raw.alarm);
        mediaPlayer.setVolume(50, 50);


        assert state != null;
        switch (state) {
            case Const.ALARM_ON:
                startId = 1;
                break;
            case  Const.ALARM_OFF:
                startId = 0;
                break;
            default:
                startId = 0;
                break;
        }


        //if user want "alarm on"
        //music play
        if (!this.isRunning && startId == 1) {

            //create instance of the media player

            mediaPlayer.start();

            this.isRunning = true;

            //create notification
            NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            Intent mainIntent = new Intent(getApplicationContext(), MainActivity.class);
            PendingIntent pendingMainIntent = PendingIntent.getActivity(this, 0, mainIntent, 0);

            Notification notification = new Notification.Builder(this)
                    .setContentTitle(dataTitle)
                    .setContentText(dataBody)
                    .setContentIntent(pendingMainIntent)
                    .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                    .setAutoCancel(true)
                    .build();

            final int _id = (int) System.currentTimeMillis();

            notificationManager.notify(_id, notification);

//wake up screen
            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            PowerManager.WakeLock wakeLock =
                    pm.newWakeLock(PowerManager.FULL_WAKE_LOCK
                            | PowerManager.ACQUIRE_CAUSES_WAKEUP
                            | PowerManager.ON_AFTER_RELEASE, "WakeLockLauncher");
            wakeLock.acquire();

        }


        //if user want "alarm off"
        //music stop
        else if (this.isRunning && startId == 0) {

            //stop the ringtone


            this.isRunning = false;
        }

        //no music playing. user want "alarm off"
        //do nothing
        else if (!this.isRunning && startId == 0) {
            this.isRunning = false;
        }

        //music playing. user want "alarm on"
        //do nothing
        else if (this.isRunning && startId == 1) {
            this.isRunning = true;
        }

        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {

        Toast.makeText(this, "on Destroy called", Toast.LENGTH_SHORT).show();
        super.onDestroy();
        this.isRunning = false;
    }

}
