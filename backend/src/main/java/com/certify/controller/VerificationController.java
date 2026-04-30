package com.certify.controller;

import com.certify.dto.VerificationRequest;
import com.certify.dto.VerificationResponse;
import com.certify.service.VerificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/verify")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping
    public ResponseEntity<VerificationResponse> verifyCertificate(
            @RequestBody VerificationRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIp(httpRequest);
        VerificationResponse response = verificationService.verifyCertificate(request, ipAddress);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VerificationResponse> verifyByFileUpload(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIp(httpRequest);
        VerificationResponse response = verificationService.verifyByFile(file, ipAddress);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{certificateId}")
    public ResponseEntity<VerificationResponse> verifyByCertificateId(
            @PathVariable String certificateId,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIp(httpRequest);
        VerificationRequest request = new VerificationRequest();
        request.setCertificateId(certificateId);
        VerificationResponse response = verificationService.verifyCertificate(request, ipAddress);
        return ResponseEntity.ok(response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
}
