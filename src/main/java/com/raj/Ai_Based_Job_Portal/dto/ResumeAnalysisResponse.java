package com.raj.Ai_Based_Job_Portal.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class ResumeAnalysisResponse {
    @JsonAlias({"matchScore", "score"})
    private Integer matchScore;

    @JsonAlias({"strength", "strengths"})
    private String strength;

    @JsonAlias({"missingSkills", "weaknesses", "missingSkill", "weakness"})
    private String missingSkills;

    @JsonAlias({"suggestion", "suggestions", "improvements"})
    private String suggestion;
}
