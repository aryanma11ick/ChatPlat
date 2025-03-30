package com.example.chatplat.controller;

import com.example.chatplat.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get username by ID
    @GetMapping("/{userId}/username")
    public ResponseEntity<String> getUsername(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUsernameById(userId));
    }

    // Get ID by username
    @GetMapping("/by-username/{username}")
    public ResponseEntity<Long> getUserId(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserIdByUsername(username));
    }

    // Check username availability
    @GetMapping("/check-username/{username}")
    public ResponseEntity<Boolean> checkUsername(@PathVariable String username) {
        return ResponseEntity.ok(!userService.usernameExists(username));
    }

    // ... keep your existing endpoints ...
}