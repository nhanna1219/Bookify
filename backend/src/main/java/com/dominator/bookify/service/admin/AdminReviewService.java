package com.dominator.bookify.service.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dominator.bookify.model.Review;
import com.dominator.bookify.model.ReviewStatus;
import com.dominator.bookify.repository.ReviewRepository;

@Service
public class AdminReviewService {

    @Autowired
    private ReviewRepository reviewRepo;

    public List<Review> getAllReviews() {
        return reviewRepo.findAll();
    }

    public List<Review> getReviewsByStatus(ReviewStatus status) {
        return reviewRepo.findReviewByStatus(status);
    }

    public Review approveReview(String id) {
        Review review = reviewRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setStatus(ReviewStatus.APPROVED);
        return reviewRepo.save(review);
    }

    public Review rejectReview(String id) {
        Review review = reviewRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setStatus(ReviewStatus.REJECTED);
        return reviewRepo.save(review);
    }
}
