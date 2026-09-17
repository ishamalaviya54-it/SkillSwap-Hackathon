package com.skillswap.ai;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class RecommendedSkillAdapter extends RecyclerView.Adapter<RecommendedSkillAdapter.SkillViewHolder> {
    public interface OnSkillAddedListener {
        void onSkillAdded(RecommendedSkill skill);
    }

    private final List<RecommendedSkill> skills;
    private final OnSkillAddedListener listener;

    public RecommendedSkillAdapter(List<RecommendedSkill> skills, OnSkillAddedListener listener) {
        this.skills = skills;
        this.listener = listener;
    }

    @NonNull
    @Override
    public SkillViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recommended_skill, parent, false);
        return new SkillViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull SkillViewHolder holder, int position) {
        RecommendedSkill skill = skills.get(position);
        holder.name.setText(skill.getName());
        holder.subtitle.setText(skill.getSubtitle());
        holder.avatar.setText(skill.getAvatar());
        holder.add.setOnClickListener(view -> listener.onSkillAdded(skill));
    }

    @Override
    public int getItemCount() { return skills.size(); }

    static class SkillViewHolder extends RecyclerView.ViewHolder {
        final TextView name;
        final TextView subtitle;
        final TextView avatar;
        final TextView add;

        SkillViewHolder(@NonNull View itemView) {
            super(itemView);
            name = itemView.findViewById(R.id.skill_name);
            subtitle = itemView.findViewById(R.id.skill_subtitle);
            avatar = itemView.findViewById(R.id.skill_avatar);
            add = itemView.findViewById(R.id.add_skill);
        }
    }
}