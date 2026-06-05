package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.dto.JobRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.JobResponseDto;
import com.raj.Ai_Based_Job_Portal.entity.Company;
import com.raj.Ai_Based_Job_Portal.entity.Job;
import com.raj.Ai_Based_Job_Portal.repository.CompanyRepository;
import com.raj.Ai_Based_Job_Portal.repository.JobRepository;
import com.raj.Ai_Based_Job_Portal.service.impl.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    @Override
    public JobResponseDto createJob(JobRequestDto request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(()-> new RuntimeException("Company Not found"));
        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .experience(request.getExperience())
                .company(company)
                .location(request.getLocation())
                .skillRequirement(request.getSkillsRequires())
                .salary(request.getSalary())
                .build();
        Job saveJob = jobRepository.save(job);
        return JobResponseDto.builder()
                .id(saveJob.getId())
                .title(saveJob.getTitle())
                .companyName(company.getCompanyName())
                .description(saveJob.getDescription())
                .location(saveJob.getLocation())
                .experience(saveJob.getExperience())
                .salary(saveJob.getSalary())
                .skillsRequires(saveJob.getSkillRequirement())
                .build();
    }
}
