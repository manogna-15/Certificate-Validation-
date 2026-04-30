package com.certify.service;

import com.certify.dto.DashboardStats;
import com.certify.entity.CertificateStatus;
import com.certify.entity.Role;
import com.certify.entity.TransactionRecord;
import com.certify.repository.CertificateRepository;
import com.certify.repository.TransactionRecordRepository;
import com.certify.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final TransactionRecordRepository transactionRecordRepository;

    public DashboardService(CertificateRepository certificateRepository,
                            UserRepository userRepository,
                            TransactionRecordRepository transactionRecordRepository) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.transactionRecordRepository = transactionRecordRepository;
    }

    public DashboardStats getDashboardStats() {
        long totalCertificates = certificateRepository.count();
        long activeCertificates = certificateRepository.countByStatus(CertificateStatus.ACTIVE);
        long revokedCertificates = certificateRepository.countByStatus(CertificateStatus.REVOKED);
        long totalStudents = userRepository.findByRole(Role.STUDENT).size();

        List<TransactionRecord> allTransactions = transactionRecordRepository.findAllByOrderByTimestampDesc();
        long totalVerifications = allTransactions.stream()
                .filter(t -> "VERIFY".equals(t.getAction()))
                .count();

        List<TransactionRecord> recentTransactions = allTransactions.stream()
                .limit(10)
                .toList();

        return new DashboardStats(
                totalCertificates,
                activeCertificates,
                revokedCertificates,
                totalStudents,
                totalVerifications,
                recentTransactions
        );
    }
}
