package com.certify.repository;

import com.certify.entity.TransactionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRecordRepository extends JpaRepository<TransactionRecord, Long> {

    Optional<TransactionRecord> findByTransactionId(String transactionId);

    List<TransactionRecord> findByCertificateId(String certificateId);

    List<TransactionRecord> findByPerformedBy(String email);

    List<TransactionRecord> findAllByOrderByTimestampDesc();
}
