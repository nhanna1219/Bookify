package com.dominator.bookify.service.user;

import com.dominator.bookify.dto.BookReviewsDTO;
import com.dominator.bookify.dto.ReviewRatingDTO;
import com.dominator.bookify.model.Review;
import com.dominator.bookify.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public List<Review> getApprovedReviews(BookReviewsDTO dto) {
        Pageable pageable = PageRequest.of(
                dto.getPageIndex(),
                dto.getPageSize(),
                Sort.by(Sort.Direction.DESC, dto.getSortBy())
        );

        ObjectId bookObjectId = new ObjectId(dto.getBookId());

        if (dto.getRating() == 0) {
            return reviewRepository.findByBookIdAndStatus(bookObjectId, "APPROVED", pageable);
        }
        return reviewRepository.findByBookIdAndStatusAndRating(
                bookObjectId,
                "APPROVED",
                dto.getRating(),
                pageable
        );
    }

    public List<ReviewRatingDTO> getRatingDistribution(String bookId) {
        ObjectId objectId = new ObjectId(bookId);
        List<Map<String, Object>> results = reviewRepository.getRatingDistribution(objectId);

        Map<Integer, Long> counts = new LinkedHashMap<>();
        for (int i = 1; i <= 5; i++) counts.put(i, 0L);

        for (Map<String, Object> row : results) {
            int stars = ((Number) row.get("_id")).intValue();
            long count = ((Number) row.get("count")).longValue();
            if (stars >= 1 && stars <= 5) {
                counts.put(stars, count);
            }
        }

        long total = counts.values().stream().mapToLong(Long::longValue).sum();

        List<ReviewRatingDTO> distribution = new ArrayList<>();
        for (int i = 5; i >= 1; i--) {
            long count = counts.get(i);
            double percentage = total > 0 ? (count * 100.0 / total) : 0.0;
            distribution.add(new ReviewRatingDTO(i, count, Math.round(percentage)));
        }

        return distribution;
    }

}
