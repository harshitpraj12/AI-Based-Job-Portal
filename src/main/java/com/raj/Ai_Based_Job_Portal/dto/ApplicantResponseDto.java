package com.raj.Ai_Based_Job_Portal.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApplicantResponseDto {
    private String candidateName;
    private String email;
    private String status;
    private Long candidateId;
    private boolean resumeUploaded;
}
