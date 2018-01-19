package com.app911interpreters.alarmservice;


import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.PowerManager;
import android.media.RingtoneManager;
import android.support.v7.app.NotificationCompat;

import com.app911interpreters.MainActivity;
import com.app911interpreters.untils.Const;

/**
 * Created by LUONGCONGDU on 08/05/2017.
 */

public class AlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {

        String n = intent.getExtras().getString(Const.ALARM_NOTI);
        //get string from intent
        if (n.equals(Const.ALARM_ON)) {
            NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            Intent mainIntent = new Intent(context.getApplicationContext(), MainActivity.class);
            PendingIntent pendingMainIntent = PendingIntent.getActivity(context, 0, mainIntent, 0);
            Uri defaultSound= RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

            NotificationCompat.Builder notification = (NotificationCompat.Builder) new NotificationCompat.Builder(context)
                    .setContentTitle(intent.getExtras().getString(Const.ALARM_NOTI_TITLE))
                    .setContentText(intent.getExtras().getString(Const.ALARM_NOTI_BODY))
                    .setContentIntent(pendingMainIntent)
                    .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                    .setSound(defaultSound)
                    .setAutoCancel(true);

            final int _id = (int) System.currentTimeMillis();

            notificationManager.notify(_id, notification.build());

//wake up screen
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            PowerManager.WakeLock wakeLock =
                    pm.newWakeLock(PowerManager.FULL_WAKE_LOCK
                            | PowerManager.ACQUIRE_CAUSES_WAKEUP
                            | PowerManager.ON_AFTER_RELEASE, "WakeLockLauncher");
            wakeLock.acquire();

//            Intent serviceIntent = new Intent(context, RingtonePlayingService.class);
//            serviceIntent.putExtra(Const.ALARM_NOTI, Const.ALARM_ON);
//            serviceIntent.putExtra(Const.ALARM_NOTI_TITLE, intent.getExtras().getString(Const.ALARM_NOTI_TITLE));
//            serviceIntent.putExtra(Const.ALARM_NOTI_BODY, intent.getExtras().getString(Const.ALARM_NOTI_BODY));
//            context.startService(serviceIntent);
        }

    }
}
