package com.raj.Ai_Based_Job_Portal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeFeedbackResponse {
    @JsonProperty("overallScore")
    @JsonAlias({"overallScore", "score"})
    private Integer overallScore;

    @JsonProperty("strength")
    @JsonAlias({"strength", "strengths"})
    private List<String> strength;

    @JsonProperty("weakness")
    @JsonAlias({"weakness", "weaknesses", "gaps"})
    private List<String> weakness;

    @JsonAlias({"suggessions", "suggestions", "improvements"})
    private List<String> suggessions;
}

//public record ResumeFeedbackResponse(
//        @JsonProperty("overallScore")Integer overallScore,
//        @JsonProperty("strength")List<String> strength,
//        @JsonProperty("weakness")List<String> weakness,
//        @JsonProperty("suggessions")List<String> suggessions
//) {}
