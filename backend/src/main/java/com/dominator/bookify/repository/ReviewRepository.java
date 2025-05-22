package com.dominator.bookify.repository;

import com.dominator.bookify.model.Review;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByBookIdAndStatus(ObjectId bookId, String status, Pageable pageable);

    List<Review> findByBookIdAndStatusAndRating(
            ObjectId bookId,
            String status,
            int rating,
            Pageable pageable
    );

    @Aggregation(pipeline = {
            "{ $match: { bookId: ?0, status: 'APPROVED' } }",
            "{ $group: { _id: '$rating' , count: { $sum: 1 } } }"
    })
    List<Map<String, Object>> getRatingDistribution(ObjectId bookId);

}
