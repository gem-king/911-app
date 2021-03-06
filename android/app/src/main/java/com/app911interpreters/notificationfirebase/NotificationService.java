package com.app911interpreters.notificationfirebase;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v7.app.NotificationCompat;
import android.util.Log;

import com.app911interpreters.MainActivity;
import com.app911interpreters.R;
import com.app911interpreters.untils.SharedPrefsUtils;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

/**
 * Created by IT on 10/17/2017.
 */

public class NotificationService extends FirebaseMessagingService{
    Context context;
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        final int _id = (int) System.currentTimeMillis();
        sendNotification(remoteMessage.getNotification().getBody(),_id);
       }

        private void sendNotification(String messageBody, int id) {
               Intent intent = new Intent(this,MainActivity.class);
               intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
               PendingIntent pendingIntent = PendingIntent.getActivity(this, 0 /* Request code */, intent,
                       PendingIntent.FLAG_ONE_SHOT);

               Uri defaultSoundUri= RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
               NotificationCompat.Builder notificationBuilder = (NotificationCompat.Builder) new NotificationCompat.Builder(this)
                       .setSmallIcon(R.mipmap.ic_launcher)
                       .setContentTitle("FCM Message")
                       .setContentText(messageBody)
                       .setAutoCancel(true)
                       .setSound(defaultSoundUri)
                       .setContentIntent(pendingIntent);
               NotificationManager notificationManager =
                       (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
               notificationManager.notify( id/* ID of notification */, notificationBuilder.build());
           }

    }

