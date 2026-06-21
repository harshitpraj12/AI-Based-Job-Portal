package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.dto.ResumeFeedbackResponse;
import com.raj.Ai_Based_Job_Portal.service.impl.ResumeFeedbackService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ResumeFeedbackServiceImpl implements ResumeFeedbackService {

    private final ChatClient chatClient;

    public ResumeFeedbackServiceImpl(ChatClient.Builder chatClient){
        this.chatClient = chatClient.build();
    }

    @Override
    public ResumeFeedbackResponse analyseResume(String resumeText) {
        String prompt = """
            You are an expert resume reviewer.

            Analyze this resume:

            %s

            Return ONLY JSON.

            {
                "overallScore":85,
                "strengths":[
                    "Strong Java skills"
                ],
                "weaknesses":[
                    "No deployment experience"
                ],
                "suggestions":[
                    "Add Docker projects"
                ]
            }
            """
                .formatted(resumeText);
        return chatClient.prompt()
                .user(prompt)
                .call()
                .entity(ResumeFeedbackResponse.class);
    }
}
