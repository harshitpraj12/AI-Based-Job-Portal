package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.dto.ApplicantResponseDto;
import com.raj.Ai_Based_Job_Portal.dto.ApplyJobRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.ResumeAnalysisResponse;
import com.raj.Ai_Based_Job_Portal.dto.UpdateStatusDto;
import com.raj.Ai_Based_Job_Portal.entity.*;
import com.raj.Ai_Based_Job_Portal.enums.ApplicationStatus;
import com.raj.Ai_Based_Job_Portal.repository.*;
import com.raj.Ai_Based_Job_Portal.security.AuthenticatedUserService;
import com.raj.Ai_Based_Job_Portal.service.impl.AiResumeService;
import com.raj.Ai_Based_Job_Portal.service.impl.ApplicationService;
import com.raj.Ai_Based_Job_Portal.service.impl.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final AuthenticatedUserService authenticatedUserService;
    private final ResumeRepository resumeRepository;
    private final PdfService pdfService;
    private final AiResumeService aiResumeService;
    private final ResumeAnalysisRepository resumeAnalysisRepository;

    @Override
    public void applyJob(ApplyJobRequestDto request) throws IOException {
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
            jobApplication=jobApplicationRepository.save(jobApplication);
            Resume resume = resumeRepository.findByCandidate(candidate)
                    .orElseThrow(()-> new RuntimeException("Resume Not Found"));
            String resumeText = pdfService.extractText(resume.getFilePath());
            String jobDescription = job.getDescription();
            ResumeAnalysisResponse response = aiResumeService.analyze(resumeText, jobDescription);
            ResumeAnalysis analysis = ResumeAnalysis.builder()
                    .matchScore(response.getMatchScore())
                    .strength(response.getStrength())
                    .missingSkills(response.getMissingSkills())
                    .application(jobApplication)
                    .suggestions(response.getSuggestion())
                    .build();
            resumeAnalysisRepository.save(analysis);
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

    @Override
    public List<ApplicantResponseDto> getApplicantsByJob(Long jobId) {
        User user = authenticatedUserService.getCurrentUser();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job Not Found"));

        if (!job.getCompany().getRecruiter().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized Access");
        }

        List<JobApplication> applications = jobApplicationRepository.findByJob(job);
        List<ApplicantResponseDto> responseDto = new ArrayList<>();

        for (JobApplication application : applications) {
            // Use .orElse(null) instead of crashing with .orElseThrow()
            ResumeAnalysis analyses = resumeAnalysisRepository.findByApplication(application)
                    .orElse(null);

            ApplicantResponseDto applicantResponseDto = ApplicantResponseDto.builder()
                    .candidateId(application.getId())
                    .email(application.getCandidate().getEmail())
                    .status(application.getStatus().toString())
                    .candidateName(application.getCandidate().getName())
                    // Safe null-checks using ternary operators for your exact data types
                    .matchScore(analyses != null ? analyses.getMatchScore() : 0)
                    .strengths(analyses != null ? analyses.getStrength() : "Analysis pending")
                    .missingSkills(analyses != null ? analyses.getMissingSkills() : "Analysis pending")
                    .suggestions(analyses != null ? analyses.getSuggestions() : "AI is still analyzing this resume.")
                    .build();

            responseDto.add(applicantResponseDto);
        }
        return responseDto;
    }
}
