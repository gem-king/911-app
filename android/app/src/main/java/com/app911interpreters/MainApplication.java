package com.app911interpreters;

import android.app.Application;

import com.app911interpreters.reactmodule.AlarmPackage;
import com.app911interpreters.reactmodule.SharePrePackage;
import com.app911interpreters.reactmodule.TestReactPackage;
import com.facebook.react.ReactApplication;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import com.airbnb.android.react.maps.MapsPackage;


import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new LocationServicesDialogBoxPackage(),
                    new VectorIconsPackage(),
                    new MapsPackage(),
                    new AlarmPackage(),
                    new SharePrePackage(),
                    new TestReactPackage()
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
        SoLoader.init(this, /* native exopackage */ false);
    }
}