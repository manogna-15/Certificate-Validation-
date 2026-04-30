package com.certify.service;

import com.certify.dto.CertificateResponse;
import com.certify.dto.VerificationRequest;
import com.certify.dto.VerificationResponse;
import com.certify.entity.Certificate;
import com.certify.entity.CertificateStatus;
import com.certify.repository.CertificateRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class VerificationService {

    private final CertificateRepository certificateRepository;
    private final TransactionService transactionService;
    private final HashService hashService;

    public VerificationService(CertificateRepository certificateRepository,
                               TransactionService transactionService,
                               HashService hashService) {
        this.certificateRepository = certificateRepository;
        this.transactionService = transactionService;
        this.hashService = hashService;
    }

    public VerificationResponse verifyByFile(MultipartFile file, String ipAddress) {
        VerificationResponse response = new VerificationResponse();
        response.setVerificationTimestamp(LocalDateTime.now());

        if (file == null || file.isEmpty()) {
            response.setValid(false);
            response.setMessage("No file provided or file is empty.");
            return response;
        }

        try {
            byte[] fileBytes = file.getBytes();
            String computedHash = hashService.generateSHA256(fileBytes);
            response.setComputedHash(computedHash);

            VerificationRequest request = new VerificationRequest();
            request.setCertificateHash(computedHash);

            VerificationResponse verifyResult = verifyCertificate(request, ipAddress);
            verifyResult.setComputedHash(computedHash);
            return verifyResult;
        } catch (IOException e) {
            response.setValid(false);
            response.setMessage("Failed to read the uploaded file.");
            return response;
        }
    }

    public VerificationResponse verifyCertificate(VerificationRequest request, String ipAddress) {
        Optional<Certificate> certificateOpt = Optional.empty();

        // Search by certificateId first, then by hash
        if (StringUtils.hasText(request.getCertificateId())) {
            certificateOpt = certificateRepository.findByCertificateId(request.getCertificateId());
        }

        if (certificateOpt.isEmpty() && StringUtils.hasText(request.getCertificateHash())) {
            certificateOpt = certificateRepository.findByCertificateHash(request.getCertificateHash());
        }

        VerificationResponse response = new VerificationResponse();
        response.setVerificationTimestamp(LocalDateTime.now());

        if (certificateOpt.isEmpty()) {
            response.setValid(false);
            response.setMessage("Certificate not found. The certificate ID or hash provided does not match any records.");
            response.setTransactionId(createVerificationTransaction(
                    request.getCertificateId() != null ? request.getCertificateId() : "UNKNOWN",
                    "anonymous", ipAddress, "FAILED - Certificate not found"
            ));
            return response;
        }

        Certificate certificate = certificateOpt.get();

        if (certificate.getStatus() == CertificateStatus.REVOKED) {
            response.setValid(false);
            response.setCertificateDetails(mapToResponse(certificate));
            response.setMessage("Certificate has been REVOKED. This certificate is no longer valid.");
            response.setTransactionId(createVerificationTransaction(
                    certificate.getCertificateId(), "anonymous", ipAddress,
                    "FAILED - Certificate is revoked"
            ));
            return response;
        }

        if (certificate.getStatus() == CertificateStatus.EXPIRED) {
            response.setValid(false);
            response.setCertificateDetails(mapToResponse(certificate));
            response.setMessage("Certificate has EXPIRED.");
            response.setTransactionId(createVerificationTransaction(
                    certificate.getCertificateId(), "anonymous", ipAddress,
                    "FAILED - Certificate is expired"
            ));
            return response;
        }

        // Check expiry date
        if (certificate.getExpiryDate() != null &&
                certificate.getExpiryDate().isBefore(java.time.LocalDate.now())) {
            certificate.setStatus(CertificateStatus.EXPIRED);
            certificateRepository.save(certificate);
            response.setValid(false);
            response.setCertificateDetails(mapToResponse(certificate));
            response.setMessage("Certificate has EXPIRED.");
            response.setTransactionId(createVerificationTransaction(
                    certificate.getCertificateId(), "anonymous", ipAddress,
                    "FAILED - Certificate is expired (auto-detected)"
            ));
            return response;
        }

        // Certificate is valid
        response.setValid(true);
        response.setCertificateDetails(mapToResponse(certificate));
        response.setMessage("Certificate is VALID and ACTIVE. Verified successfully.");
        response.setTransactionId(createVerificationTransaction(
                certificate.getCertificateId(), "anonymous", ipAddress,
                "SUCCESS - Certificate verified"
        ));

        return response;
    }

    private String createVerificationTransaction(String certificateId, String performedBy,
                                                  String ipAddress, String details) {
        return transactionService.createTransaction(
                "VERIFY", certificateId, performedBy, ipAddress, details
        ).getTransactionId();
    }

    private CertificateResponse mapToResponse(Certificate certificate) {
        CertificateResponse response = new CertificateResponse();
        response.setId(certificate.getId());
        response.setCertificateId(certificate.getCertificateId());
        response.setStudentName(certificate.getStudentName());
        response.setStudentEmail(certificate.getStudentEmail());
        response.setCourseName(certificate.getCourseName());
        response.setInstitutionName(certificate.getInstitutionName());
        response.setGrade(certificate.getGrade());
        response.setIssueDate(certificate.getIssueDate());
        response.setExpiryDate(certificate.getExpiryDate());
        response.setCertificateHash(certificate.getCertificateHash());
        response.setOriginalFileName(certificate.getOriginalFileName());
        response.setQrCodeUrl(certificate.getQrCodeUrl());
        response.setStatus(certificate.getStatus().name());
        response.setTransactionId(certificate.getTransactionId());
        response.setBlockHash(certificate.getBlockHash());
        response.setBlockNumber(certificate.getBlockNumber());
        response.setCreatedAt(certificate.getCreatedAt());
        response.setUpdatedAt(certificate.getUpdatedAt());

        if (certificate.getUploadedBy() != null) {
            response.setUploadedByEmail(certificate.getUploadedBy().getEmail());
            response.setUploadedByName(certificate.getUploadedBy().getName());
        }

        return response;
    }
}
