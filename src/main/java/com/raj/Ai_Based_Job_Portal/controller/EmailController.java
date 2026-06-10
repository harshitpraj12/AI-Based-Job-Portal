package com.raj.Ai_Based_Job_Portal.controller;

import com.raj.Ai_Based_Job_Portal.service.impl.CreateMessage;
import com.raj.Ai_Based_Job_Portal.service.impl.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;
    private final CreateMessage createMessage;

    @GetMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<String> sendEmail(){
        String to = "raj14praj@gmail.com";
        String subject = "This is testing e-mail";
        String message = createMessage.createEmailMessage();
        return ResponseEntity.ok(emailService.sendEmailInHtml(to, subject, message));
    }

}
