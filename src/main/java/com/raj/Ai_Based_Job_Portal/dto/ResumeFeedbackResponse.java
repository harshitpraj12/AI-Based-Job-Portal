package com.raj.Ai_Based_Job_Portal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeFeedbackResponse {
    @JsonProperty("overallScore")
    private Integer overallScore;

    @JsonProperty("strength")
    private List<String> strength;

    @JsonProperty("weakness")
    private List<String> weakness;


    private List<String> suggessions;
}

//public record ResumeFeedbackResponse(
//        @JsonProperty("overallScore")Integer overallScore,
//        @JsonProperty("strength")List<String> strength,
//        @JsonProperty("weakness")List<String> weakness,
//        @JsonProperty("suggessions")List<String> suggessions
//) {}
