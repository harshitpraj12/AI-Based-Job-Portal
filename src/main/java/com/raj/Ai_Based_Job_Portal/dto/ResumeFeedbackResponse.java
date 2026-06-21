package com.raj.Ai_Based_Job_Portal.dto;

import lombok.Data;

import java.util.List;

@Data
public class ResumeFeedbackResponse {
    private Integer overallScore;
    private List<String> strength;
    private List<String> weakness;
    private List<String> suggessions;
}
