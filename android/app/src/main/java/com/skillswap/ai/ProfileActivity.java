package com.skillswap.ai;

import android.os.Bundle;

public class ProfileActivity extends DestinationActivity {
    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showDestination("My Profile", "Manage your skills, availability, and learning goals.");
    }
}