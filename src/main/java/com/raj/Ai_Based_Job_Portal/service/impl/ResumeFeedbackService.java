package com.raj.Ai_Based_Job_Portal.service.impl;

import com.raj.Ai_Based_Job_Portal.dto.ResumeFeedbackResponse;

public interface ResumeFeedbackService {
    ResumeFeedbackResponse analyseResume(String resumeText);
}
