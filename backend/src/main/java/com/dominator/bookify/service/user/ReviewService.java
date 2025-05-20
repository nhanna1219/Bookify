package com.dominator.bookify.service.user;

import com.dominator.bookify.model.Review;
import com.dominator.bookify.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public List<Review> getApprovedReviewsByBookIds(String id) {
        return reviewRepository.findByBookIdAndStatus(new ObjectId(id), "APPROVED");
    }
}
