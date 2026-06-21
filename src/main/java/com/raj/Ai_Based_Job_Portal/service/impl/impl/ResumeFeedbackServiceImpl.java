package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.dto.InterviewQuestionResponse;
import com.raj.Ai_Based_Job_Portal.dto.JobRecommendationDto;
import com.raj.Ai_Based_Job_Portal.dto.ResumeFeedbackResponse;
import com.raj.Ai_Based_Job_Portal.entity.Job;
import com.raj.Ai_Based_Job_Portal.service.impl.ResumeFeedbackService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Service
public class ResumeFeedbackServiceImpl implements ResumeFeedbackService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public ResumeFeedbackServiceImpl(ChatClient.Builder chatClient, ObjectMapper objectMapper){
        this.chatClient = chatClient.build();
        this.objectMapper = objectMapper;
    }

    @Override
    public ResumeFeedbackResponse analyseResume(String resumeText) {
        System.out.println("resume service is running");
        String prompt = """
            You are an expert resume reviewer.
            
            Analyze the following resume text and evaluate its strengths, weaknesses, and actionable suggestions for improvement. Provide an overall score out of 100.
            
            Analyze this resume text:

            %s

            Return ONLY JSON like this.

            {
                "overallScore":85,
                "strength":["...","...","...","...","..."],
                "weakness":["...", "...", "...","...","..."],
                "suggessions":["...","...", "...","...","..."]
            }
            """
                .formatted(resumeText);
        System.out.println("This is prompt : "+ prompt);
        ResumeFeedbackResponse entity = chatClient.prompt(prompt)
                .call()
                .entity(ResumeFeedbackResponse.class);
        System.out.println("Your response is : "+entity.toString());
        return entity;

//        String prompt = """
//                You are an expert resume reviewer.
//
//                            Analyze this resume:
//
//                            %s
//
//                            use exactly these JSON keys.
//
//                            {
//                                "overallScore":85,
//                                "strengths":[
//                                    "Strong Java skills", "Good communications"
//                                ],
//                                "weaknesses":[
//                                    "No deployment experience", "No projects"
//                                ],
//                                "suggestions":[
//                                    "Add Docker projects", "Add a strong project"
//                                ]
//                            }
//                """.formatted(resumeText);
//        try {
//            String rawJson = this.chatClient.prompt()
//                    .user(prompt)
//                    .call()
//                    .content();
//            rawJson = rawJson.replace("```json", "").replace("```", "").trim();
//            System.out.println("---------------");
//            System.out.println(rawJson);
//            System.out.println("---------------");
//            return objectMapper.readValue(rawJson, ResumeFeedbackResponse.class);
//        }catch (Exception e){
//            e.printStackTrace();
//            throw new RuntimeException("Failed to map to json");
//        }
    }

    @Override
    public InterviewQuestionResponse generateInterviewQuestions(String jobTitle, String jobDescription) {

        String prompt = """
            
            You are a senior technical interviewer.

            Job Title:
            %s

            Job Description:
            %s

            Generate:

            10 Technical Questions
            5 HR Questions
            5 Coding Questions

            Return ONLY JSON.

            {
              "technicalQuestions":[...],
              "hrQuestions":[...],
              "codingQuestions":[...]
            }
            
            """
                .formatted(
                        jobTitle,
                        jobDescription
                );

        return chatClient.prompt()
                .user(prompt)
                .call()
                .entity(
                        InterviewQuestionResponse.class
                );
    }

    @Override
    public List<JobRecommendationDto> recommendJobs(String resumeText, List<Job> jobs) {
        StringBuilder jobsText = new StringBuilder();

        for(Job job : jobs){

            jobsText.append(
                    """
                    Job ID: %d
                    Title: %s
                    Description: %s
                    Skills: %s
                    Company: %s
        
                    """
                            .formatted(
                                    job.getId(),
                                    job.getTitle(),
                                    job.getDescription(),
                                    job.getSkillRequirement(),
                                    job.getCompany().getCompanyName()
                            )
            );
        }
        String prompt =
                """
                
                You are an AI recruitment assistant.
        
                Candidate Resume:
        
                %s
        
                Available Jobs:
        
                %s
        
                Analyze the resume.
        
                Return top 5 matching jobs.
        
                Return ONLY JSON:
        
                [
                  {
                    "jobId":1,
                    "jobTitle":"Java Developer",
                    "company":"ABC",
                    "matchScore":90,
                    "reason":"Strong Java match"
                  }
                ]
                
                """
                        .formatted(
                                resumeText,
                                jobsText
                        );
        return chatClient.prompt()
                .user(prompt)
                .call()
                .entity(
                        new ParameterizedTypeReference<List<JobRecommendationDto>>() {}
                );
    }
}
