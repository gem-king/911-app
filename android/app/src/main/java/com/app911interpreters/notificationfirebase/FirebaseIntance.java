package com.app911interpreters.notificationfirebase;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;

public class FirebaseIntance extends FirebaseInstanceIdService {
    public FirebaseIntance() {
    }

    @Override
    public void onTokenRefresh() {
        super.onTokenRefresh();
        String refreshedToken = FirebaseInstanceId.getInstance().getToken();
        Log.d("sdf", "Refreshed token: " + refreshedToken);

//        sendRegistrationToServer(refreshedToken);
//
    }
}
