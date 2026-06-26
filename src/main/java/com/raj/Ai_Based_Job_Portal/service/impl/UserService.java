package com.raj.Ai_Based_Job_Portal.service.impl;

import com.raj.Ai_Based_Job_Portal.dto.ProfileUpdateRequest;
import com.raj.Ai_Based_Job_Portal.dto.ProfileUpdateResponse;


public interface UserService {

    String deleteUser(Long id);
    ProfileUpdateResponse updateProfile(ProfileUpdateRequest request);
}
