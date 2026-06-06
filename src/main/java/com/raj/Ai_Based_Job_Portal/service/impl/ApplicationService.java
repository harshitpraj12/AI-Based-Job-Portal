package com.raj.Ai_Based_Job_Portal.service.impl;

import com.raj.Ai_Based_Job_Portal.dto.ApplyJobRequestDto;
import com.raj.Ai_Based_Job_Portal.entity.JobApplication;
import com.raj.Ai_Based_Job_Portal.entity.User;

import java.util.List;

public interface ApplicationService {
    void applyJob(ApplyJobRequestDto request);
    List<JobApplication> allAppliedJobs(User candidate);
}
