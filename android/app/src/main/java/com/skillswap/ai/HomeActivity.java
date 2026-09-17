package com.skillswap.ai;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.Arrays;

public class HomeActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        RecyclerView recommendations = findViewById(R.id.recommended_list);
        recommendations.setLayoutManager(new LinearLayoutManager(this));
        recommendations.setAdapter(new RecommendedSkillAdapter(Arrays.asList(
                new RecommendedSkill("Web Development", "Learn React, HTML, CSS", "</>"),
                new RecommendedSkill("Graphic Design", "Improve your design skills", "✎"),
                new RecommendedSkill("Communication", "Build your soft skills", "✦")
        ), skill -> Toast.makeText(this, skill.getName() + " added to My Skills", Toast.LENGTH_SHORT).show()));

        findViewById(R.id.try_now_button).setOnClickListener(view -> open(SkillMatchActivity.class));
        findViewById(R.id.skill_match_card).setOnClickListener(view -> open(SkillMatchActivity.class));

        configureQuickAction(R.id.action_browse, "Browse", "⌕", ExploreActivity.class);
        configureQuickAction(R.id.action_skills, "My Skills", "✦", ProfileActivity.class);
        configureQuickAction(R.id.action_messages, "Messages", "☏", MessagesActivity.class);
        configureQuickAction(R.id.action_notifications, "Notifications", "♢", MessagesActivity.class);

        configureBottomNavigation();
    }

    private void configureQuickAction(int id, String label, String icon, Class<?> destination) {
        View action = findViewById(id);
        ((TextView) action.findViewById(R.id.action_label)).setText(label);
        ((TextView) action.findViewById(R.id.action_icon)).setText(icon);
        action.setOnClickListener(view -> open(destination));
    }

    private void configureBottomNavigation() {
        configureNavItem(R.id.nav_home, "Home", "⌂", null, true);
        configureNavItem(R.id.nav_explore, "Explore", "⌕", ExploreActivity.class, false);
        configureNavItem(R.id.nav_post, "Post", "+", PostActivity.class, false);
        configureNavItem(R.id.nav_messages, "Messages", "☏", MessagesActivity.class, false);
        configureNavItem(R.id.nav_profile, "Profile", "●", ProfileActivity.class, false);
    }

    private void configureNavItem(int id, String label, String icon, Class<?> destination, boolean selected) {
        View item = findViewById(id);
        TextView navLabel = item.findViewById(R.id.nav_label);
        TextView navIcon = item.findViewById(R.id.nav_icon);
        navLabel.setText(label);
        navIcon.setText(icon);
        int color = Color.parseColor(selected ? "#6D4AFF" : "#737994");
        navLabel.setTextColor(color);
        navIcon.setTextColor(color);
        if (destination != null) item.setOnClickListener(view -> open(destination));
    }

    private void open(Class<?> destination) {
        startActivity(new Intent(this, destination));
    }
}