package com.app911interpreters.reactmodule;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by kien.lovan on 10/12/2017.
 */

public class TestModule extends ReactContextBaseJavaModule {

    public TestModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "TestModule";
    }


    @ReactMethod
    public void callTestModule(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }
}
