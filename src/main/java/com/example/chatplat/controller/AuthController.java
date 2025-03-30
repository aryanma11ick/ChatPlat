package com.example.chatplat.controller;

import com.example.chatplat.dto.LoginRequest;
import com.example.chatplat.model.User;
import com.example.chatplat.service.UserService;
import com.example.chatplat.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3001")
public class AuthController {

    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public AuthController(UserService userService, JwtTokenUtil jwtTokenUtil) {
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "userId", registeredUser.getId()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            boolean isValid = userService.validateUser(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );

            if (isValid) {
                String token = jwtTokenUtil.generateToken(loginRequest.getUsername());
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "token", token,
                        "username", loginRequest.getUsername()
                ));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }
}