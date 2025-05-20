package com.dominator.bookify.service.user;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String fullName, String token) {
        String link = "http://localhost:8080/api/users/verify?token=" + token + "&tokenType=EMAIL_VERIFICATION";
        sendEmail(
                to,
                "Confirm Your Bookify Account",
                fullName,
                link,
                "Verify My Email",
                "Thank you for registering with <strong>Bookify</strong>. To activate your account, please confirm your email address by clicking the button below:",
                "If you did not create a Bookify account, please disregard this message."
        );
    }

    public void sendPasswordResetEmail(String to, String fullName, String token) {
        String link = "http://localhost:8080/api/users/verify?token=" + token + "&tokenType=PASSWORD_RESET";
        sendEmail(
                to,
                "Reset Your Bookify Password",
                fullName,
                link,
                "Reset Password",
                "We received a request to reset your password for <strong>Bookify</strong>. You can reset it by clicking the button below:",
                "If you did not request a password reset, you can safely ignore this email."
        );
    }

    private void sendEmail(String to, String subject, String fullName, String link, String buttonText, String intro, String disclaimer) {
        String html = """
               <html>
                 <body style="margin:0; padding:0; font-family:'Segoe UI', sans-serif; background-color:#f5f7fa;">
                   <table width="100%%" cellpadding="0" cellspacing="0">
                     <tr>
                       <td align="center">
                         <table width="600" cellpadding="40" cellspacing="0" style="background-color:#ffffff; margin-top:40px; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.05);">
                           <tr>
                             <td align="left">
                               <h2 style="color:#1d72b8;">Hello, %s!</h2>
                               <p style="color:#333333; font-size:16px;">
                                 %s
                               </p>
                               <p style="text-align:center; margin:30px 0;">
                                 <a href="%s" style="background-color:#1d72b8; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-size:16px;">%s</a>
                               </p>
                               <p style="color:#555555; font-size:14px;">
                                 %s
                               </p>
                               <hr style="border:none; border-top:1px solid #eee; margin:40px 0;">
                               <p style="color:#888888; font-size:12px; text-align:center;">
                                 &copy; 2025 Bookify. All rights reserved.<br>
                                 123 Book St, Reading City, BK 10000
                               </p>
                             </td>
                           </tr>
                         </table>
                       </td>
                     </tr>
                   </table>
                 </body>
               </html>
               """.formatted(fullName, intro, link, buttonText, disclaimer);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
