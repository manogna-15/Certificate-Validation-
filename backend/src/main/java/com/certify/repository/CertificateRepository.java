package com.certify.repository;

import com.certify.entity.Certificate;
import com.certify.entity.CertificateStatus;
import com.certify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByCertificateId(String certificateId);

    Optional<Certificate> findByCertificateHash(String hash);

    List<Certificate> findByStudentEmail(String email);

    Optional<Certificate> findByTransactionId(String transactionId);

    List<Certificate> findByUploadedBy(User user);

    List<Certificate> findByStudent(User student);

    List<Certificate> findByInstitutionName(String name);

    List<Certificate> findByStatus(CertificateStatus status);

    Long countByStatus(CertificateStatus status);

    boolean existsByCertificateHash(String hash);
}
