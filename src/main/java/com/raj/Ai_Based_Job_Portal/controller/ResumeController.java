package com.raj.Ai_Based_Job_Portal.controller;

import com.raj.Ai_Based_Job_Portal.service.impl.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
        try {
            // 1. Fetch the resource from your service layer
            Resource resource = resumeService.downloadResume(candidateId);

            // 2. Get the filename from the resource (fallback to a default if null)
            String filename = resource.getFilename() != null ? resource.getFilename() : "resume.pdf";

            // 3. Build the response with the correct headers
            return ResponseEntity.ok()
                    // Tells the browser it's a PDF file
                    .contentType(MediaType.APPLICATION_PDF)
                    // Tells the browser to download it as an attachment with its original name
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (Exception e) {
            // Fallback for handling MalformedURLException or RuntimeExceptions cleanly
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/preview/{candidateId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Resource> previewResume(@PathVariable Long candidateId) throws MalformedURLException {
        try {
            // 1. Fetch the resource from your service layer
            Resource resource = resumeService.downloadResume(candidateId);

            // 2. Get the filename from the resource (fallback to a default if null)
            String filename = resource.getFilename() != null ? resource.getFilename() : "resume.pdf";

            // 3. Build the response with the correct headers
            return ResponseEntity.ok()
                    // Tells the browser it's a PDF file
                    .contentType(MediaType.APPLICATION_PDF)
                    // Tells the browser to download it as an attachment with its original name
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (Exception e) {
            // Fallback for handling MalformedURLException or RuntimeExceptions cleanly
            return ResponseEntity.internalServerError().build();
        }
    }
}
