package com.raj.Ai_Based_Job_Portal.dto;

import lombok.Data;

@Data
public class ResumeAnalysisResponse {
    private Integer matchScore;
    private String strength;
    private String missingSkills;
    private String suggestion;
}
