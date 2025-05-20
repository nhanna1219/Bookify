package com.dominator.bookify.repository;

import com.dominator.bookify.model.Review;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByBookIdAndStatus(ObjectId bookId, String status);
}
