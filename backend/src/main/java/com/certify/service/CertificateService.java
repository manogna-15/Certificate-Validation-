package com.certify.service;

import com.certify.dto.CertificateResponse;
import com.certify.dto.CertificateUploadRequest;
import com.certify.entity.Certificate;
import com.certify.entity.CertificateStatus;
import com.certify.entity.User;
import com.certify.exception.BadRequestException;
import com.certify.exception.DuplicateResourceException;
import com.certify.exception.ResourceNotFoundException;
import com.certify.repository.CertificateRepository;
import com.certify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final HashService hashService;
    private final QrCodeService qrCodeService;
    private final TransactionService transactionService;

    @Value("${app.certificate.directory}")
    private String certificateDirectory;

    @Value("${app.qrcode.directory}")
    private String qrCodeDirectory;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public CertificateService(CertificateRepository certificateRepository,
                              UserRepository userRepository,
                              HashService hashService,
                              QrCodeService qrCodeService,
                              TransactionService transactionService) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.hashService = hashService;
        this.qrCodeService = qrCodeService;
        this.transactionService = transactionService;
    }

    public CertificateResponse uploadCertificate(CertificateUploadRequest request,
                                                  MultipartFile file,
                                                  String uploaderEmail) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Certificate file is required");
        }

        User uploader = userRepository.findByEmail(uploaderEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", uploaderEmail));

        try {
            // 1. Save file to disk
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName != null && originalFileName.contains(".")
                    ? originalFileName.substring(originalFileName.lastIndexOf("."))
                    : "";
            String savedFileName = UUID.randomUUID().toString() + fileExtension;

            Path certDir = Paths.get(certificateDirectory);
            Files.createDirectories(certDir);
            Path filePath = certDir.resolve(savedFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 2. Generate SHA-256 hash of file content
            byte[] fileContent = file.getBytes();
            String certificateHash = hashService.generateSHA256(fileContent);

            // 3. Check duplicate hash
            if (certificateRepository.existsByCertificateHash(certificateHash)) {
                throw new DuplicateResourceException("A certificate with the same content already exists");
            }

            // 4. Generate unique certificateId
            String certificateId = "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            // 5. Generate transactionId
            String transactionId = "TX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            // 6. Simulate blockchain
            long blockNumber = certificateRepository.count() + 1;
            String previousBlockHash = blockNumber == 1 ? "GENESIS"
                    : certificateRepository.findAll().stream()
                    .reduce((first, second) -> second)
                    .map(Certificate::getBlockHash)
                    .orElse("GENESIS");
            String blockHash = hashService.generateBlockHash(
                    previousBlockHash, certificateHash, LocalDateTime.now().toString()
            );

            // 7. Generate QR code
            String verificationUrl = frontendUrl + "/verify/" + certificateId;
            Path qrDir = Paths.get(qrCodeDirectory);
            Files.createDirectories(qrDir);
            String qrFileName = certificateId + ".png";
            String qrFilePath = qrCodeDirectory + qrFileName;
            qrCodeService.saveQrCodeImage(verificationUrl, qrFilePath, 300, 300);
            String qrCodeUrl = baseUrl + "/api/certificates/" + certificateId + "/qrcode";

            // 8. Find student user if exists
            User student = userRepository.findByEmail(request.getStudentEmail()).orElse(null);
            String studentName = student != null ? student.getName() : request.getStudentEmail();

            // 9. Save certificate entity
            Certificate certificate = new Certificate();
            certificate.setCertificateId(certificateId);
            certificate.setStudentName(studentName);
            certificate.setStudentEmail(request.getStudentEmail());
            certificate.setCourseName(request.getCourseName());
            certificate.setInstitutionName(request.getInstitutionName());
            certificate.setGrade(request.getGrade());
            certificate.setIssueDate(request.getIssueDate());
            certificate.setExpiryDate(request.getExpiryDate());
            certificate.setCertificateHash(certificateHash);
            certificate.setOriginalFileName(originalFileName);
            certificate.setFilePath(filePath.toString());
            certificate.setQrCodePath(qrFilePath);
            certificate.setQrCodeUrl(qrCodeUrl);
            certificate.setStatus(CertificateStatus.ACTIVE);
            certificate.setTransactionId(transactionId);
            certificate.setBlockHash(blockHash);
            certificate.setBlockNumber(blockNumber);
            certificate.setUploadedBy(uploader);
            certificate.setStudent(student);

            Certificate saved = certificateRepository.save(certificate);

            // 10. Create transaction record
            transactionService.createTransaction(
                    "UPLOAD",
                    certificateId,
                    uploaderEmail,
                    "system",
                    "Certificate uploaded for " + request.getStudentEmail() + " - " + request.getCourseName()
            );

            return mapToResponse(saved);

        } catch (IOException e) {
            throw new RuntimeException("Failed to process certificate file: " + e.getMessage(), e);
        }
    }

    public CertificateResponse getCertificateById(String certificateId) {
        Certificate certificate = certificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "certificateId", certificateId));
        return mapToResponse(certificate);
    }

    public List<CertificateResponse> getCertificatesByStudent(String email) {
        return certificateRepository.findByStudentEmail(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CertificateResponse> getCertificatesByUploader(String email) {
        User uploader = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return certificateRepository.findByUploadedBy(uploader)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CertificateResponse> getAllCertificates() {
        return certificateRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CertificateResponse revokeCertificate(String certificateId, String adminEmail) {
        Certificate certificate = certificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "certificateId", certificateId));

        if (certificate.getStatus() == CertificateStatus.REVOKED) {
            throw new BadRequestException("Certificate is already revoked");
        }

        certificate.setStatus(CertificateStatus.REVOKED);
        Certificate saved = certificateRepository.save(certificate);

        transactionService.createTransaction(
                "REVOKE",
                certificateId,
                adminEmail,
                "system",
                "Certificate revoked by admin: " + adminEmail
        );

        return mapToResponse(saved);
    }

    public String getCertificateFilePath(String certificateId) {
        Certificate certificate = certificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "certificateId", certificateId));
        return certificate.getFilePath();
    }

    public byte[] getQrCode(String certificateId) {
        Certificate certificate = certificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "certificateId", certificateId));

        String verificationUrl = frontendUrl + "/verify/" + certificateId;
        return qrCodeService.generateQrCode(verificationUrl, 300, 300);
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
