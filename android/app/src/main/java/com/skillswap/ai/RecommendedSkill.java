package com.skillswap.ai;

public class RecommendedSkill {
    private final String name;
    private final String subtitle;
    private final String avatar;

    public RecommendedSkill(String name, String subtitle, String avatar) {
        this.name = name;
        this.subtitle = subtitle;
        this.avatar = avatar;
    }

    public String getName() { return name; }
    public String getSubtitle() { return subtitle; }
    public String getAvatar() { return avatar; }
}