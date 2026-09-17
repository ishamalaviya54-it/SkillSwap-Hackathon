package com.skillswap.ai;

import android.os.Bundle;

public class ExploreActivity extends DestinationActivity {
    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showDestination("Explore", "Discover skills and student communities around you.");
    }
}