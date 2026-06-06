package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.dto.ApplyJobRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.UpdateStatusDto;
import com.raj.Ai_Based_Job_Portal.entity.Job;
import com.raj.Ai_Based_Job_Portal.entity.JobApplication;
import com.raj.Ai_Based_Job_Portal.entity.User;
import com.raj.Ai_Based_Job_Portal.enums.ApplicationStatus;
import com.raj.Ai_Based_Job_Portal.repository.CompanyRepository;
import com.raj.Ai_Based_Job_Portal.repository.JobApplicationRepository;
import com.raj.Ai_Based_Job_Portal.repository.JobRepository;
import com.raj.Ai_Based_Job_Portal.repository.UserRepository;
import com.raj.Ai_Based_Job_Portal.security.AuthenticatedUserService;
import com.raj.Ai_Based_Job_Portal.service.impl.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @Override
    public void applyJob(ApplyJobRequestDto request) {
        User candidate = authenticatedUserService.getCurrentUser();
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(()-> new RuntimeException("Job not available with id "+request.getJobId()));
        boolean exists = jobApplicationRepository.existsByJobAndCandidate(job, candidate);
        if(!exists) {
            JobApplication jobApplication = JobApplication.builder()
                    .job(job)
                    .candidate(candidate)
                    .appliedAt(LocalDateTime.now())
                    .status(ApplicationStatus.APPLIED)
                    .build();
            jobApplicationRepository.save(jobApplication);
        }else{
            throw new RuntimeException("Already Applied");
        }
    }

    @Override
    public List<JobApplication> allAppliedJobs(User candidate) {
        List<JobApplication> allJobs = jobApplicationRepository.findByCandidate(candidate);
        if(allJobs==null) throw new RuntimeException("You haven't applied for any job yet!!!");
        return allJobs;
    }

    @Override
    public List<JobApplication> getAllJobs() {
        return jobApplicationRepository.findAll();
    }

    @Override
    public JobApplication getJobById(Long id) {
        return jobApplicationRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("No job found with the id "+ id));
    }

    @Override
    public JobApplication updateStatus(Long id, UpdateStatusDto dto) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("No application found with id "+ id));
        if(dto==null) throw new RuntimeException("Invalid input or status");
        application.setStatus(dto.getStatus());
        jobApplicationRepository.save(application);
        return application;
    }
}
