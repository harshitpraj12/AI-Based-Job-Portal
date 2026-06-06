package com.raj.Ai_Based_Job_Portal.controller;

import com.raj.Ai_Based_Job_Portal.dto.ApplyJobRequestDto;
import com.raj.Ai_Based_Job_Portal.entity.JobApplication;
import com.raj.Ai_Based_Job_Portal.entity.User;
import com.raj.Ai_Based_Job_Portal.security.AuthenticatedUserService;
import com.raj.Ai_Based_Job_Portal.service.impl.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {
    private final ApplicationService applicationService;
    private final AuthenticatedUserService authenticatedUserService;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<String> applyJob(@RequestBody ApplyJobRequestDto request){
        applicationService.applyJob(request);
        return ResponseEntity.ok("Job applied Successfully");
    }
    @GetMapping("my-applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public List<JobApplication> allJobs(){
        User candidate = authenticatedUserService.getCurrentUser();
        return applicationService.allAppliedJobs(candidate);
    }
}
