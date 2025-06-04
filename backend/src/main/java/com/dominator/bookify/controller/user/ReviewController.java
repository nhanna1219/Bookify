package com.dominator.bookify.controller.user;

import com.dominator.bookify.dto.BookReviewsDTO;
import com.dominator.bookify.dto.ReviewRatingDTO;
import com.dominator.bookify.dto.ReviewResponseDTO;
import com.dominator.bookify.model.Review;
import com.dominator.bookify.service.user.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<?> getReviewsByBookId(BookReviewsDTO dto) {
        try {
            Page<ReviewResponseDTO> reviews = reviewService.getApprovedReviews(dto);

            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/distribution")
    public ResponseEntity<?> getRatingDistribution(@RequestParam String bookId) {
        try {
            List<ReviewRatingDTO> dist= reviewService.getRatingDistribution(bookId);
            return ResponseEntity.ok(dist);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}
