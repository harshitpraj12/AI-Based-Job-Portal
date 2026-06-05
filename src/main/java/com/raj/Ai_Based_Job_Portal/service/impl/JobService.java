package com.raj.Ai_Based_Job_Portal.service.impl;

import com.raj.Ai_Based_Job_Portal.dto.JobRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.JobResponseDto;

public interface JobService {
    JobResponseDto createJob(JobRequestDto jobRequestDto);
}
