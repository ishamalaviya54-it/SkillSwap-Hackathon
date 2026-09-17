package com.skillswap.ai;

import android.os.Bundle;

public class PostActivity extends DestinationActivity {
    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showDestination("Post a Skill", "Share what you know with the SkillSwap community.");
    }
}