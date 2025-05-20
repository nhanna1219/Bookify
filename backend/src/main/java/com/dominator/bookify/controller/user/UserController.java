package com.dominator.bookify.controller.user;

import com.dominator.bookify.dto.LoginResponseDTO;
import com.dominator.bookify.dto.ResetPasswordRequestDTO;
import com.dominator.bookify.dto.UserLoginRequestDTO;
import com.dominator.bookify.dto.UserRegisterRequestDTO;
import com.dominator.bookify.model.VerificationToken;
import com.dominator.bookify.service.user.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserLoginRequestDTO req) {
        try {
            LoginResponseDTO response = userService.login(req);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid UserRegisterRequestDTO req) {
        try {
            userService.register(req);
            return ResponseEntity.ok(Map.of("message", "Verification email sent, please check your email to verify your email address!"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
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
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            userService.handleForgotPassword(email);
            return ResponseEntity.ok(Map.of("message", "Password reset link sent."));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequestDTO req) {
        try {
            userService.resetPassword(req);
            return ResponseEntity.ok(Map.of("message", "Password reset successful."));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}
