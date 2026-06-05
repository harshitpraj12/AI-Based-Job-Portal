package com.raj.Ai_Based_Job_Portal.service.impl;

import com.raj.Ai_Based_Job_Portal.dto.CompanyRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.CompanyResponseDto;

public interface CompanyService {
    CompanyResponseDto createCompany(CompanyRequestDto companyRequestDto);
}
