package com.certify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateResponse {

    private Long id;
    private String certificateId;
    private String studentName;
    private String studentEmail;
    private String courseName;
    private String institutionName;
    private String grade;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String certificateHash;
    private String originalFileName;
    private String qrCodeUrl;
    private String status;
    private String transactionId;
    private String blockHash;
    private Long blockNumber;
    private String uploadedByEmail;
    private String uploadedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
