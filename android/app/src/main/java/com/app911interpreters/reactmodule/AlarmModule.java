package com.app911interpreters.reactmodule;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import com.app911interpreters.alarmservice.AlarmReceiver;
import com.app911interpreters.untils.Const;
import com.app911interpreters.untils.SharedPrefsUtils;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Calendar;


/**
 * Created by Admin on 10/12/2017.
 */

public class AlarmModule extends ReactContextBaseJavaModule {
    Context context;
    AlarmManager alarmManager;
    PendingIntent pending_intent;


    public AlarmModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext.getApplicationContext();
        alarmManager = (AlarmManager) context.getSystemService(context.ALARM_SERVICE);

    }

    @Override
    public String getName() {
        return "AlarmAndroid";
    }


    @ReactMethod
    public void createAlarm(int hour,int munite,int year,int month,int day,String key ,String title,String body ) {


        Calendar calendar = Calendar.getInstance();
        Intent my_intent = new Intent(context, AlarmReceiver.class);

        //setting calendar instance with hour and minutes
        calendar.setTimeInMillis(System.currentTimeMillis());
        calendar.clear();
        int actualMonth = month-1;
        calendar.set(year,actualMonth,day,hour,munite,0);
        int m = calendar.get(Calendar.MONTH);



        //put in extra string into my_intent
        my_intent.putExtra(Const.ALARM_NOTI, Const.ALARM_ON);
        my_intent.putExtra(Const.ALARM_NOTI_TITLE, title);
        my_intent.putExtra(Const.ALARM_NOTI_BODY, body);

        //create pending intent
        
        final int id_unique = Integer.parseInt(key);
        pending_intent = PendingIntent.getBroadcast(context, id_unique, my_intent,
                PendingIntent.FLAG_UPDATE_CURRENT);

        //set alarm manager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            alarmManager
                    .setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pending_intent);
        } else {
            alarmManager
                    .set(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pending_intent);
        }
    }

    @ReactMethod
    private void cancelAlarm(int month,int day) {
        if (alarmManager!= null) {
            Calendar calendar = Calendar.getInstance();
            String srtDay = day+""+month+""+calendar.get(Calendar.YEAR);
            final int id_unique = Integer.parseInt(srtDay);
            Intent my_intent = new Intent(context, AlarmReceiver.class);
            PendingIntent  pendingIntent = PendingIntent.getBroadcast(context, id_unique, my_intent,
                    PendingIntent.FLAG_UPDATE_CURRENT);
            pendingIntent.cancel();
            alarmManager.cancel(pendingIntent);
        }
    }

}
