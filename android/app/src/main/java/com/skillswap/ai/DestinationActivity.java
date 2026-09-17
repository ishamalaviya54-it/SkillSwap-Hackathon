package com.skillswap.ai;

import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class DestinationActivity extends AppCompatActivity {
    protected void showDestination(String title, String message) {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setPadding(28, 28, 28, 28);
        root.setBackgroundColor(Color.parseColor("#F7F8FC"));

        TextView titleView = new TextView(this);
        titleView.setText(title);
        titleView.setTextColor(Color.parseColor("#1F2340"));
        titleView.setTextSize(26);
        titleView.setGravity(Gravity.CENTER);
        titleView.setTypeface(null, 1);
        root.addView(titleView, new LinearLayout.LayoutParams(-1, -2));

        TextView messageView = new TextView(this);
        messageView.setText(message);
        messageView.setTextColor(Color.parseColor("#737994"));
        messageView.setTextSize(15);
        messageView.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams messageParams = new LinearLayout.LayoutParams(-1, -2);
        messageParams.setMargins(0, 14, 0, 24);
        root.addView(messageView, messageParams);

        Button back = new Button(this);
        back.setText("Back to Home");
        back.setTextAllCaps(false);
        back.setTextColor(Color.WHITE);
        GradientDrawable buttonBackground = new GradientDrawable(GradientDrawable.Orientation.LEFT_RIGHT, new int[]{0xFF5635D8, 0xFF3B82F6});
        buttonBackground.setCornerRadius(48);
        back.setBackground(buttonBackground);
        back.setOnClickListener(view -> finish());
        root.addView(back, new LinearLayout.LayoutParams(-2, 52));

        setContentView(root);
    }
}