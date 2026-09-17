package com.skillswap.ai;

import android.os.Bundle;

public class SkillMatchActivity extends DestinationActivity {
    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showDestination("Skill Match", "AI-powered partners matched to the skills you want to learn.");
    }
}