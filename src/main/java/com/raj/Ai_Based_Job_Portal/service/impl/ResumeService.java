package com.raj.Ai_Based_Job_Portal.service.impl;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;

public interface ResumeService {
    void uploadResume(MultipartFile file) throws IOException;
    Resource downloadResume(Long candidateId) throws MalformedURLException;
}
