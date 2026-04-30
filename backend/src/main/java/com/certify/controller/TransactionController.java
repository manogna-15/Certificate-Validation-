package com.certify.controller;

import com.certify.entity.TransactionRecord;
import com.certify.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransactionRecord>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/certificate/{certificateId}")
    public ResponseEntity<List<TransactionRecord>> getTransactionsByCertificate(
            @PathVariable String certificateId) {
        return ResponseEntity.ok(transactionService.getTransactionsByCertificate(certificateId));
    }
}
