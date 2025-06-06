package com.dominator.bookify.repository;

import com.dominator.bookify.model.Review;
import com.dominator.bookify.model.ReviewStatus;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    Page<Review> findByBookIdAndStatus(ObjectId bookId, String status, Pageable pageable);

    Page<Review> findByBookIdAndStatusAndRating(ObjectId bookId, String status, int rating, Pageable pageable);

    @Aggregation(pipeline = {
            "{ : { bookId: ?0, status: 'APPROVED' } }",
            "{ : { _id: '' , count: { : 1 } } }"
    })
    List<Map<String, Object>> getRatingDistribution(ObjectId bookId);

    List<Review> findByStatus(ReviewStatus status);
}
