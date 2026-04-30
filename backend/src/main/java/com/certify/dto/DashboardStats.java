package com.certify.dto;

import com.certify.entity.TransactionRecord;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {

    private long totalCertificates;
    private long activeCertificates;
    private long revokedCertificates;
    private long totalStudents;
    private long totalVerifications;
    private List<TransactionRecord> recentTransactions;
}
