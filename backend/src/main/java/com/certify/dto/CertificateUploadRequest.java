package com.certify.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateUploadRequest {

    @NotBlank(message = "Student email is required")
    @Email(message = "Invalid student email format")
    private String studentEmail;

    @NotBlank(message = "Course name is required")
    private String courseName;

    @NotBlank(message = "Institution name is required")
    private String institutionName;

    private String grade;

    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;

    private LocalDate expiryDate;
}
