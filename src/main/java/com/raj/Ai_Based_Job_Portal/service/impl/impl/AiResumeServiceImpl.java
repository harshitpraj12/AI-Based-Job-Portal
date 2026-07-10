package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.dto.ResumeAnalysisResponse;
import com.raj.Ai_Based_Job_Portal.service.impl.AiResumeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiResumeServiceImpl implements AiResumeService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public AiResumeServiceImpl(ChatClient.Builder chatClientBuilder, ObjectMapper objectMapper) {
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    private ResumeAnalysisResponse parseResponse(String rawContent) {
        if (rawContent == null) {
            throw new RuntimeException("Null response from LLM");
        }
        String cleanJson = rawContent.trim();
        if (cleanJson.contains("```")) {
            int start = cleanJson.indexOf('{');
            int end = cleanJson.lastIndexOf('}');
            if (start != -1 && end != -1 && end > start) {
                cleanJson = cleanJson.substring(start, end + 1);
            } else {
                cleanJson = cleanJson.replace("```json", "").replace("```", "").trim();
            }
        }
        try {
            return objectMapper.readValue(cleanJson, ResumeAnalysisResponse.class);
        } catch (Exception e) {
            System.err.println("JSON parsing failed for: " + cleanJson);
            e.printStackTrace();
            throw new RuntimeException("Failed to parse ATS response: " + e.getMessage());
        }
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
                Return Only JSON in the exact format:
                {
                    "matchScore": 80,
                    "strength": "Java, Spring Boot",
                    "missingSkills": "Docker",
                    "suggestion": "Learn Docker"
                }
                """
                .formatted(resumeTest, jobDescription);

        String response = chatClient.prompt()
                .user(prompt)
                .call()
                .content();
        return parseResponse(response);
    }
}
