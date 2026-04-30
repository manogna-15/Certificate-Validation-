package com.certify.service;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;

@Service
public class HashService {

    public String generateSHA256(byte[] data) {
        return DigestUtils.sha256Hex(data);
    }

    public String generateSHA256(String data) {
        return DigestUtils.sha256Hex(data);
    }

    public String generateBlockHash(String previousHash, String certificateHash, String timestamp) {
        String combined = previousHash + certificateHash + timestamp;
        return DigestUtils.sha256Hex(combined);
    }
}
