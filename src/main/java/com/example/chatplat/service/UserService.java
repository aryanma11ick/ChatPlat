package com.example.chatplat.service;

import com.example.chatplat.exception.DuplicateUsernameException;
import com.example.chatplat.exception.UserNotFoundException;
import com.example.chatplat.model.User;
import com.example.chatplat.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Registration method
    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new DuplicateUsernameException("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Validation method
    public boolean validateUser(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.isPresent() &&
                passwordEncoder.matches(password, user.get().getPassword());
    }

    // Username/ID conversion methods
    public String getUsernameById(Long userId) {
        return userRepository.findUsernameById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
    }

    public Long getUserIdByUsername(String username) {
        return userRepository.findUserIdByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
    }

    // Existence check
    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    // Find user
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}