package com.certify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String certificateId;

    @Column(nullable = false)
    private String studentName;

    @Column(nullable = false)
    private String studentEmail;

    @Column(nullable = false)
    private String courseName;

    @Column(nullable = false)
    private String institutionName;

    private String grade;

    @Column(nullable = false)
    private LocalDate issueDate;

    private LocalDate expiryDate;

    @Column(nullable = false, unique = true)
    private String certificateHash;

    private String originalFileName;

    private String filePath;

    private String qrCodePath;

    private String qrCodeUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CertificateStatus status = CertificateStatus.ACTIVE;

    @Column(unique = true)
    private String transactionId;

    private String blockHash;

    private Long blockNumber;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id")
    private User uploadedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private User student;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
