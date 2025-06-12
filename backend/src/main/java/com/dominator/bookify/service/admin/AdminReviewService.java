package com.dominator.bookify.service.admin;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dominator.bookify.dto.ReviewCheckingForAminDTO;
import com.dominator.bookify.model.Review;
import com.dominator.bookify.model.ReviewStatus;
import com.dominator.bookify.repository.ReviewRepository;

@Service
public class AdminReviewService {

    @Autowired
    private ReviewRepository reviewRepo;

    public List<ReviewCheckingForAminDTO> getAllReviews() {
        return reviewRepo.findAll().stream().map(review -> {
            ReviewCheckingForAminDTO rv = new ReviewCheckingForAminDTO();
            rv.setId(review.getId());
            rv.setBookId(review.getBookId().toString());
            rv.setComment(review.getComment());
            rv.setStatus(review.getStatus());
            rv.setAddedAt(review.getAddedAt());
            rv.setModifiedAt(review.getModifiedAt());
            rv.setRating(review.getRating());
            rv.setSubject(review.getSubject());
            rv.setUserId(review.getUserId().toString());
            return rv;
        }).collect(Collectors.toList());
    }

    public List<ReviewCheckingForAminDTO> getReviewsByStatus(ReviewStatus status) {
        return reviewRepo.findReviewByStatus(status).stream().map(review -> {
            ReviewCheckingForAminDTO rv = new ReviewCheckingForAminDTO();
            rv.setId(review.getId());
            rv.setBookId(review.getBookId().toString());
            rv.setComment(review.getComment());
            rv.setStatus(review.getStatus());
            rv.setAddedAt(review.getAddedAt());
            rv.setModifiedAt(review.getModifiedAt());
            rv.setRating(review.getRating());
            rv.setSubject(review.getSubject());
            rv.setUserId(review.getUserId().toString());
            return rv;
        }).collect(Collectors.toList());
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
