package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.entity.Resume;
import com.raj.Ai_Based_Job_Portal.entity.User;
import com.raj.Ai_Based_Job_Portal.repository.ResumeRepository;
import com.raj.Ai_Based_Job_Portal.repository.UserRepository;
import com.raj.Ai_Based_Job_Portal.security.AuthenticatedUserService;
import com.raj.Ai_Based_Job_Portal.service.impl.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @Override
    public void uploadResume(MultipartFile file) throws IOException {
        User candidate = authenticatedUserService.getCurrentUser();
        String fileName = System.currentTimeMillis()+"_"+file.getOriginalFilename();
        Path path = Paths.get("uploads", fileName);
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        Resume resume = Resume.builder()
                .fileName(fileName)
                .filePath(path.toString())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .candidate(candidate)
                .build();
        resumeRepository.save(resume);
    }

    @Override
    public Resource downloadResume(Long candidateId) throws MalformedURLException {
        User user = userRepository.findById(candidateId)
                .orElseThrow(()->new RuntimeException("User Not Found"));
        Resume resume = resumeRepository.findByCandidate(user)
                .orElseThrow(()->new RuntimeException("Resume Not Found With user id "+ candidateId));
        Path path = Paths.get(resume.getFilePath());
        Resource resource = new UrlResource(path.toUri());
        return resource;
    }
}
