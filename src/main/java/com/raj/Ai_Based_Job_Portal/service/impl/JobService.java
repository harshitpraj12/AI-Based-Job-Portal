package com.raj.Ai_Based_Job_Portal.service.impl;

import com.raj.Ai_Based_Job_Portal.dto.JobRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.JobResponseDto;

import java.util.List;

public interface JobService {
    JobResponseDto createJob(JobRequestDto jobRequestDto);
    List<JobResponseDto> getAllJobs();
    JobResponseDto getJobById(Long id);
    JobResponseDto updateJob(Long id, JobRequestDto jobRequestDto);
}
