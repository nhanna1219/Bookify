package com.dominator.bookify.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dominator.bookify.model.Review;
import com.dominator.bookify.model.ReviewStatus;
import com.dominator.bookify.service.admin.AdminReviewService;

@RestController
@RequestMapping("/api/admin/reviews")
public class AdminReviewController {

    @Autowired
    private AdminReviewService reviewService;

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/status/{status}")
    public List<Review> getReviewsByStatus(@PathVariable ReviewStatus status) {
        return reviewService.getReviewsByStatus(status);
    }

    @PutMapping("/{id}/approve")
    public Review approve(@PathVariable String id) {
        return reviewService.approveReview(id);
    }

    @PutMapping("/{id}/reject")
    public Review reject(@PathVariable String id) {
        return reviewService.rejectReview(id);
    }
}
