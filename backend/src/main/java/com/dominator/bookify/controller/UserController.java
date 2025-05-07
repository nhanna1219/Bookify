package com.dominator.bookify.controller;

import com.dominator.bookify.dto.LoginResponseDTO;
import com.dominator.bookify.dto.ResetPasswordRequest;
import com.dominator.bookify.dto.UserLoginRequest;
import com.dominator.bookify.dto.UserRegisterRequest;
import com.dominator.bookify.model.VerificationToken;
import com.dominator.bookify.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserLoginRequest req) {
        try {
            LoginResponseDTO response = userService.login(req);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid UserRegisterRequest req) {
        try {
            userService.register(req);
            return ResponseEntity.ok(Map.of("message", "Verification email sent, please check your email to verify your email address!"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/verify")
    public void verifyToken(
            @RequestParam String token,
            @RequestParam VerificationToken.TokenType tokenType,
            HttpServletResponse response
    ) throws IOException {
        try {
            userService.verifyToken(token, tokenType);

            if (tokenType == VerificationToken.TokenType.EMAIL_VERIFICATION) {
                response.sendRedirect("http://localhost:5173/login?verified=1");
            } else if (tokenType == VerificationToken.TokenType.PASSWORD_RESET) {
                response.sendRedirect("http://localhost:5173/reset-password?token=" + token + "&verified=1");
            }
        } catch (Exception e) {
            String error = URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
            response.sendRedirect("http://localhost:5173/login?verified=0&error=" + error);
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resend(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            userService.resendVerification(email);
            return ResponseEntity.ok(Map.of("message", "Verification email re-sent."));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            userService.handleForgotPassword(email);
            return ResponseEntity.ok(Map.of("message", "Password reset link sent."));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest req) {
        try {
            userService.resetPassword(req);
            return ResponseEntity.ok(Map.of("message", "Password reset successful."));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}
