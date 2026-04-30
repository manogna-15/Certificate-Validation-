package com.certify.service;

import com.certify.entity.TransactionRecord;
import com.certify.repository.TransactionRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    private final TransactionRecordRepository transactionRecordRepository;
    private final HashService hashService;

    public TransactionService(TransactionRecordRepository transactionRecordRepository, HashService hashService) {
        this.transactionRecordRepository = transactionRecordRepository;
        this.hashService = hashService;
    }

    public List<TransactionRecord> getAllTransactions() {
        return transactionRecordRepository.findAllByOrderByTimestampDesc();
    }

    public List<TransactionRecord> getTransactionsByCertificate(String certificateId) {
        return transactionRecordRepository.findByCertificateId(certificateId);
    }

    public TransactionRecord createTransaction(String action, String certificateId,
                                                String performedBy, String ipAddress, String details) {
        String transactionId = "TX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        List<TransactionRecord> allTransactions = transactionRecordRepository.findAllByOrderByTimestampDesc();
        String previousHash = allTransactions.isEmpty() ? "GENESIS" : allTransactions.get(0).getCurrentHash();
        long blockNumber = allTransactions.size() + 1L;

        String currentHash = hashService.generateSHA256(
                previousHash + certificateId + action + System.currentTimeMillis()
        );

        TransactionRecord record = new TransactionRecord();
        record.setTransactionId(transactionId);
        record.setAction(action);
        record.setCertificateId(certificateId);
        record.setPerformedBy(performedBy);
        record.setIpAddress(ipAddress);
        record.setDetails(details);
        record.setPreviousHash(previousHash);
        record.setCurrentHash(currentHash);
        record.setBlockNumber(blockNumber);

        return transactionRecordRepository.save(record);
    }
}
