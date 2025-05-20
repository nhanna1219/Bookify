package com.dominator.bookify.service.user;

import com.dominator.bookify.dto.*;
import com.dominator.bookify.model.Address;
import com.dominator.bookify.model.User;
import com.dominator.bookify.model.VerificationToken;
import com.dominator.bookify.repository.UserRepository;
import com.dominator.bookify.repository.VerificationTokenRepository;
import com.dominator.bookify.security.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    private final JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder;

    private final EmailService emailService;

    private final VerificationTokenRepository verificationTokenRepo;

    public LoginResponseDTO login(UserLoginRequestDTO req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email before logging in.");
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        UserResponseDTO userDTO = new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.isVerified(),
                user.getAddress()
        );

        return new LoginResponseDTO(token, userDTO);
    }


    public void register(UserRegisterRequestDTO req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered.");
        }

        // Map address (even if some fields are null)
        Address address = new Address(
                req.getStreetAddress(),
                req.getCity(),
                req.getState(),
                req.getPostalCode(),
                req.getCountry()
        );

        User user = new User();
        user.setEmail(req.getEmail());
        user.setFullName(req.getFullName());
        user.setPhone(req.getPhone());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole("CUSTOMER");
        user.setVerified(false);
        user.setAddress(address);

        userRepository.save(user);

        createAndSendToken(user, "EMAIL_VERIFICATION");
    }

    public void verifyToken(String token, VerificationToken.TokenType tokenType) {
        VerificationToken vt = verificationTokenRepo
                .findByTokenAndType(token, tokenType)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (vt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired!");
        }

        User user = userRepository.findById(vt.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (tokenType == VerificationToken.TokenType.EMAIL_VERIFICATION) {
            if (user.isVerified()) {
                throw new RuntimeException("Account already verified.");
            }
            user.setVerified(true);
            userRepository.save(user);
            verificationTokenRepo.delete(vt);
        }
    }

    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not registered"));

        if (user.isVerified()) {
            verificationTokenRepo.deleteByUserId(user.getId());
            throw new RuntimeException("User already verified.");
        }

        verificationTokenRepo.deleteByUserId(user.getId());
        createAndSendToken(user, "EMAIL_VERIFICATION");
    }

    private void createAndSendToken(User user, String tokenType) {
        String token = UUID.randomUUID().toString();
        VerificationToken vt = new VerificationToken();
        vt.setUserId(user.getId());
        vt.setToken(token);
        vt.setCreatedAt(LocalDateTime.now());
        vt.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        vt.setType(tokenType.equals("EMAIL_VERIFICATION") ? VerificationToken.TokenType.EMAIL_VERIFICATION : VerificationToken.TokenType.PASSWORD_RESET);
        verificationTokenRepo.save(vt);

        if (tokenType.equals("EMAIL_VERIFICATION")) {
            emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), token);
        } else {
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), token);
        }
    }

    public void handleForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not registered."));

        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email before resetting password.");
        }

        createAndSendToken(user, "PASSWORD_RESET");
    }

    public void resetPassword(ResetPasswordRequestDTO req) {
        VerificationToken vt = verificationTokenRepo
                .findByTokenAndType(req.getToken(), VerificationToken.TokenType.PASSWORD_RESET)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token."));

        if (vt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired.");
        }

        User user = userRepository.findById(vt.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found."));

        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        verificationTokenRepo.delete(vt);
    }
}
