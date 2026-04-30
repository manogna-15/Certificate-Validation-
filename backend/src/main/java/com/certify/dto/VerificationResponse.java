package com.certify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificationResponse {

    private boolean valid;
    private CertificateResponse certificateDetails;
    private LocalDateTime verificationTimestamp;
    private String transactionId;
    private String message;
    private String computedHash;
}
