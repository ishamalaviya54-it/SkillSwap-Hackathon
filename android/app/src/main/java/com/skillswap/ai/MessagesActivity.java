package com.skillswap.ai;

import android.os.Bundle;

public class MessagesActivity extends DestinationActivity {
    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showDestination("Messages", "Your conversations with skill partners will appear here.");
    }
}