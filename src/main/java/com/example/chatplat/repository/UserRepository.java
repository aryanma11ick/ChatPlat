package com.example.chatplat.repository;

import com.example.chatplat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Basic username operations
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    // Optimized ID lookups
    @Query("SELECT u.id FROM User u WHERE u.username = :username")
    Optional<Long> findUserIdByUsername(@Param("username") String username);

    @Query("SELECT u.username FROM User u WHERE u.id = :userId")
    Optional<String> findUsernameById(@Param("userId") Long userId);

    // PostgreSQL-optimized exists check
    @Query(value = "SELECT EXISTS(SELECT 1 FROM users WHERE username = :username)", nativeQuery = true)
    boolean existsByUsernamePostgres(@Param("username") String username);
}