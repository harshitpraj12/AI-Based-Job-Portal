package com.raj.Ai_Based_Job_Portal.controller;

import com.raj.Ai_Based_Job_Portal.dto.ResumeFeedbackResponse;
import com.raj.Ai_Based_Job_Portal.entity.Resume;
import com.raj.Ai_Based_Job_Portal.entity.User;
import com.raj.Ai_Based_Job_Portal.repository.ResumeRepository;
import com.raj.Ai_Based_Job_Portal.security.AuthenticatedUserService;
import com.raj.Ai_Based_Job_Portal.service.impl.PdfService;
import com.raj.Ai_Based_Job_Portal.service.impl.ResumeFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final ResumeFeedbackService resumeFeedbackService;
    private final PdfService pdfService;
    private final ResumeRepository resumeRepository;
    private final AuthenticatedUserService authenticatedUserService;


    @GetMapping("/resume-feedback")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResumeFeedbackResponse getResumeFeedback() throws IOException {

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

        return resumeFeedbackService.analyseResume(resumeText);
    }
}
