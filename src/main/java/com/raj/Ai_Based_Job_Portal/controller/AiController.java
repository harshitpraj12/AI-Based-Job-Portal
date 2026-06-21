package com.raj.Ai_Based_Job_Portal.controller;

import com.raj.Ai_Based_Job_Portal.dto.InterviewQuestionResponse;
import com.raj.Ai_Based_Job_Portal.dto.JobRecommendationDto;
import com.raj.Ai_Based_Job_Portal.dto.ResumeFeedbackResponse;
import com.raj.Ai_Based_Job_Portal.entity.Job;
import com.raj.Ai_Based_Job_Portal.entity.Resume;
import com.raj.Ai_Based_Job_Portal.entity.User;
import com.raj.Ai_Based_Job_Portal.repository.JobRepository;
import com.raj.Ai_Based_Job_Portal.repository.ResumeRepository;
import com.raj.Ai_Based_Job_Portal.security.AuthenticatedUserService;
import com.raj.Ai_Based_Job_Portal.service.impl.PdfService;
import com.raj.Ai_Based_Job_Portal.service.impl.ResumeFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final ResumeFeedbackService resumeFeedbackService;
    private final PdfService pdfService;
    private final ResumeRepository resumeRepository;
    private final AuthenticatedUserService authenticatedUserService;
    private final JobRepository jobRepository;


    @GetMapping("/resume-feedback")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResumeFeedbackResponse getResumeFeedback() throws IOException {
        System.out.println("Resume controller is running");
        User candidate = authenticatedUserService.getCurrentUser();

        Resume resume =
                resumeRepository
                        .findByCandidate(candidate)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Resume not found"
                                        )
                        );

        String resumeText =
                pdfService.extractText(
                        resume.getFilePath()
                );
        System.out.println("Resume Text : "+ resumeText);
        return resumeFeedbackService.analyseResume(resumeText);
    }

    @GetMapping("/interview-questions/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public InterviewQuestionResponse generateQuestion(@PathVariable Long jobId){
        Job job = jobRepository.findById(jobId)
                .orElseThrow(()-> new RuntimeException("Job not found"));
        return resumeFeedbackService.generateInterviewQuestions(job.getTitle(), job.getDescription());
    }

    @GetMapping("/recommend-jobs")
    @PreAuthorize("hasRole('CANDIDATE')")
    public List<JobRecommendationDto> recommendJobs() throws IOException {
        User candidate = authenticatedUserService.getCurrentUser();
        Resume resume = resumeRepository.findByCandidate(candidate)
                        .orElseThrow(() -> new RuntimeException("Resume not found"));
        String resumeText = pdfService.extractText(resume.getFilePath());
        List<Job> jobs = jobRepository.findAll();
        return resumeFeedbackService.recommendJobs(resumeText, jobs);
    }
}
