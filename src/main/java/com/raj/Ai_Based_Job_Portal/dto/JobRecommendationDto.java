package com.raj.Ai_Based_Job_Portal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRecommendationDto {

    private Long jobId;

    private String jobTitle;

    private String company;

    private Integer matchScore;

    private String reason;
}
