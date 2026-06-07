package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.dto.ResumeAnalysisResponse;
import com.raj.Ai_Based_Job_Portal.service.impl.AiResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiResumeServiceImpl implements AiResumeService {

    private final ChatClient chatClient;

    // 1. Inject the ChatClient.Builder bean that Spring AI provides automatically
    public AiResumeServiceImpl(ChatClient.Builder chatClientBuilder) {
        // 2. Build the ChatClient instance here
        this.chatClient = chatClientBuilder.build();
    }

    @Override
    public ResumeAnalysisResponse analyze(String resumeTest, String jobDescription) {
        String prompt = """
                You are an ATS system.
                Compare:
                Resume:
                %s
                Job Description:
                %s
                Return Only JSON:
                {
                    "matchScore":80,
                    "strength":"Java, Spring Boot",
                    "missingSkills":"Docker",
                    "suggestions":"Learn Docker"
                }
                """
                .formatted(resumeTest, jobDescription);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .entity(ResumeAnalysisResponse.class);
    }
}
