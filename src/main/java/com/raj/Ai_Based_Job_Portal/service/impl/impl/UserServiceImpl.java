package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.dto.EducationDto;
import com.raj.Ai_Based_Job_Portal.dto.ProfileUpdateRequest;
import com.raj.Ai_Based_Job_Portal.dto.ProfileUpdateResponse;
import com.raj.Ai_Based_Job_Portal.dto.ProjectDto;
import com.raj.Ai_Based_Job_Portal.entity.User;
import com.raj.Ai_Based_Job_Portal.entity.UserEducation;
import com.raj.Ai_Based_Job_Portal.entity.UserProfile;
import com.raj.Ai_Based_Job_Portal.entity.UserProject;
import com.raj.Ai_Based_Job_Portal.repository.UserRepository;
import com.raj.Ai_Based_Job_Portal.security.AuthenticatedUserService;
import com.raj.Ai_Based_Job_Portal.service.impl.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AuthenticatedUserService currentUser;

    @Override
    public String deleteUser(Long id) {
        User user = currentUser.getCurrentUser();
        userRepository.deleteById(id);
        return "User deleted Successful";
    }

    @Override
    @Transactional
    public ProfileUpdateResponse updateProfile(ProfileUpdateRequest request) {
        if(currentUser.getCurrentUser().getRole().name().equalsIgnoreCase("Recruiter")){
            throw new RuntimeException("User not authorized for this");
        }
        User user = currentUser.getCurrentUser();
        UserProfile profile = user.getProfile();
        if(profile==null){
            profile = new UserProfile();
            profile.setUser(user);
            user.setProfile(profile);
        }
        if(request.getDob()!=null) profile.setDob(request.getDob());
        if(request.getMobile()!=null) profile.setMobile(request.getMobile());
        if(request.getAddress()!=null) profile.setAddress(request.getAddress());
        if(request.getGender()!=null) profile.setGender(request.getGender());
        if(request.getSocialMedia()!=null) profile.setSocialMedia(request.getSocialMedia());
        user.setProfile(profile);
        if(request.getEducations() != null){
            // 1. Clear the managed collection rather than breaking the reference
            user.getEducations().clear();

            List<EducationDto> dtos = request.getEducations();
            for(EducationDto dto : dtos){
                UserEducation education = new UserEducation();
                education.setUser(user);
                education.setCollegeName(dto.getCollegeName());
                education.setDegree(dto.getDegree());
                education.setMarks(dto.getMarks());
                education.setStartDate(dto.getStartDate());
                education.setEndDate(dto.getEndDate());

                // 2. Add straight to the existing tracked collection
                user.getEducations().add(education);
            }
        }

        // --- FIX FOR PROJECTS ---
        if(request.getProjects() != null){
            // 1. Clear the managed collection here too
            user.getProjects().clear();

            List<ProjectDto> dtos = request.getProjects();
            for(ProjectDto dto : dtos){
                UserProject project = new UserProject();
                project.setUser(user);
                project.setName(dto.getName());
                project.setStartDate(dto.getStartDate());
                project.setEndDate(dto.getEndDate());
                project.setDetails(dto.getDetails());
                project.setUrl(dto.getUrl());

                // 2. Add straight to the existing tracked collection
                user.getProjects().add(project);
            }
        }
        User updatedProfile = userRepository.save(user);
        return ProfileUpdateResponse.builder()
                .dob(updatedProfile.getProfile().getDob())
                .address(updatedProfile.getProfile().getAddress())
                .gender(updatedProfile.getProfile().getGender())
                .mobile(updatedProfile.getProfile().getMobile())
                .socialMedia(updatedProfile.getProfile().getSocialMedia())
                .educations(request.getEducations())
                .projects(request.getProjects())
                .build();
    }
}
