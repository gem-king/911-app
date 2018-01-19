package com.app911interpreters.reactmodule;

import android.content.Context;

import com.app911interpreters.untils.SharedPrefsUtils;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;



/**
 * Created by kien.lovan on 10/13/2017.
 */

public class SharePreModule extends ReactContextBaseJavaModule {
    Context context;

    public SharePreModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "AndroidSharePre";
    }

    @ReactMethod
    public void setDataString(String key,String data){
        SharedPrefsUtils.setStringPreference(context,key,data);
    }

    @ReactMethod
    public  void getDataString(String key, Callback callback){
        String a = SharedPrefsUtils.getStringPreference(context,key);
        callback.invoke(a);

    }
}
