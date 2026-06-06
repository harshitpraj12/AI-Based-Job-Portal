package com.raj.Ai_Based_Job_Portal.controller;

import com.raj.Ai_Based_Job_Portal.service.impl.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('CANDIDATE')")
    public String uploadResume(@RequestParam("file") MultipartFile file) throws IOException {
        resumeService.uploadResume(file);
        return "Resume uploaded successfully";
    }

    @GetMapping("/download/{candidateId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long candidateId) throws MalformedURLException {
        return ResponseEntity.ok(resumeService.downloadResume(candidateId));
    }
}
