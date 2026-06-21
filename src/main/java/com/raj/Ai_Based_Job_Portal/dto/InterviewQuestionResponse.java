package com.raj.Ai_Based_Job_Portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestionResponse {
    private List<String> technicalQuestions;

    private List<String> hrQuestions;

    private List<String> codingQuestions;

}
