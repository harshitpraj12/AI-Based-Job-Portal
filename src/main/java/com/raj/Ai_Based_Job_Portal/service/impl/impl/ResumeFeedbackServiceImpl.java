package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.dto.InterviewQuestionResponse;
import com.raj.Ai_Based_Job_Portal.dto.JobRecommendationDto;
import com.raj.Ai_Based_Job_Portal.dto.ResumeFeedbackResponse;
import com.raj.Ai_Based_Job_Portal.entity.Job;
import com.raj.Ai_Based_Job_Portal.service.impl.ResumeFeedbackService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import com.raj.Ai_Based_Job_Portal.repository.JobRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeFeedbackServiceImpl implements ResumeFeedbackService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;
    private final VectorStore vectorStore;
    private final JobRepository jobRepository;

    public ResumeFeedbackServiceImpl(ChatClient.Builder chatClient, ObjectMapper objectMapper, VectorStore vectorStore, JobRepository jobRepository){
        this.chatClient = chatClient.build();
        this.objectMapper = objectMapper;
        this.vectorStore = vectorStore;
        this.jobRepository = jobRepository;
    }

    private ResumeFeedbackResponse parseResponse(String rawContent) {
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
            return objectMapper.readValue(cleanJson, ResumeFeedbackResponse.class);
        } catch (Exception e) {
            System.err.println("JSON parsing failed for: " + cleanJson);
            e.printStackTrace();
            throw new RuntimeException("Failed to parse AI response: " + e.getMessage());
        }
    }

    @Override
    public ResumeFeedbackResponse analyseResume(String resumeText) {
        System.out.println("resume service is running");
        String prompt = """
            You are an expert resume reviewer.
            
            Analyze the following resume text and evaluate its strengths, weaknesses, and actionable suggestions for improvement. Provide an overall score out of 100.
            
            Analyze this resume text:
            %s
            """
                .formatted(resumeText);
        System.out.println("This is prompt : "+ prompt);
        String response = chatClient.prompt(prompt)
                .call()
                .content();
        System.out.println("Your response is : " + response);
        return parseResponse(response);
    }

    @Override
    public ResumeFeedbackResponse analyseResumeAndJob(String resumeText, String description) {
        System.out.println("resume analyse with job description service is running");
        String prompt = """
            You are an expert resume reviewer.
            
            Analyze the following resume text and evaluate its strengths, weaknesses, and actionable suggestions for improvement relative to the job description. Provide an overall score out of 100.
            
            Analyze this resume text:
            %s
            
            According to this job description:
            %s
            """
                .formatted(resumeText, description);
        System.out.println("This is prompt : "+ prompt);
        var response = chatClient.prompt(prompt)
                .call()
                .entity(ResumeFeedbackResponse.class);
        System.out.println("Your response is : " + response.toString());
        return response;
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
    public List<JobRecommendationDto> recommendJobs(String resumeText) {
        // Step 1: Perform Vector Search to find Top 5 matching jobs based on Resume Text
        SearchRequest request = SearchRequest.builder()
                .topK(5)
                .similarityThreshold(0.5)
                .query(resumeText)
                .build();
        List<Document> matchingDocuments = vectorStore.similaritySearch(request);
        
        List<Long> jobIds = matchingDocuments.stream()
                .map(doc -> Long.valueOf(doc.getMetadata().get("jobId").toString()))
                .collect(Collectors.toList());

        List<Job> topJobs = jobRepository.findAllById(jobIds);
        
        StringBuilder jobsText = new StringBuilder();
        for(Job job : topJobs){
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
        
                Available Matching Jobs:
                %s
        
                Analyze the resume against these specific jobs.
                Return ONLY the matching jobs from this list with a match score and reason.
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
