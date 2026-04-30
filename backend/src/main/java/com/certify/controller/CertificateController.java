package com.certify.controller;

import com.certify.dto.CertificateResponse;
import com.certify.dto.CertificateUploadRequest;
import com.certify.service.CertificateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CertificateResponse> uploadCertificate(
            @Valid @RequestPart("request") CertificateUploadRequest request,
            @RequestPart("file") MultipartFile file,
            Authentication authentication) {

        String uploaderEmail = authentication.getName();
        CertificateResponse response = certificateService.uploadCertificate(request, file, uploaderEmail);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CertificateResponse>> getAllCertificates() {
        return ResponseEntity.ok(certificateService.getAllCertificates());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CertificateResponse>> getMyCertificates(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(certificateService.getCertificatesByStudent(email));
    }

    @GetMapping("/uploaded")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CertificateResponse>> getUploadedCertificates(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(certificateService.getCertificatesByUploader(email));
    }

    @GetMapping("/{certificateId}")
    public ResponseEntity<CertificateResponse> getCertificateById(@PathVariable String certificateId) {
        return ResponseEntity.ok(certificateService.getCertificateById(certificateId));
    }

    @PutMapping("/{certificateId}/revoke")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CertificateResponse> revokeCertificate(
            @PathVariable String certificateId,
            Authentication authentication) {
        String adminEmail = authentication.getName();
        return ResponseEntity.ok(certificateService.revokeCertificate(certificateId, adminEmail));
    }

    @GetMapping(value = "/{certificateId}/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrCode(@PathVariable String certificateId) {
        byte[] qrCode = certificateService.getQrCode(certificateId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qrCode);
    }

    @GetMapping("/{certificateId}/file")
    public ResponseEntity<byte[]> getCertificateFile(@PathVariable String certificateId) {
        try {
            var certResponse = certificateService.getCertificateById(certificateId);
            String filePath = certificateService.getCertificateFilePath(certificateId);
            Path path = Paths.get(filePath);

            if (!Files.exists(path)) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(path);
            String contentType = Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            String fileName = certResponse.getOriginalFileName() != null
                    ? certResponse.getOriginalFileName()
                    : certificateId + ".pdf";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header("Content-Disposition", "inline; filename=\"" + fileName + "\"")
                    .body(fileContent);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
