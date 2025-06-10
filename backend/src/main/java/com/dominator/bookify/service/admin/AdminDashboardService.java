package com.dominator.bookify.service.admin;

import com.dominator.bookify.dto.BestSellerDTO;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final MongoTemplate mongoTemplate;

    public List<BestSellerDTO> getTop5BestSellingBooks() {

        // 1) $unwind items
        AggregationOperation unwindItems = Aggregation.unwind("items");

        // 2) $group by items.bookId
        AggregationOperation groupByBook = Aggregation.group("items.bookId")
                .sum("items.quantity").as("totalSold");

        // 3) $sort & $limit
        AggregationOperation sort = Aggregation.sort(Sort.Direction.DESC, "totalSold");
        AggregationOperation limit = Aggregation.limit(5);

        /* 4) $lookup (pipeline) – vì bookId (String) cần ép sang ObjectId để so sánh */
        Document lookupStage = new Document("$lookup",
                new Document("from", "books")
                        .append("let", Map.of("bookIdStr", "$_id"))
                        .append("pipeline", List.of(
                                new Document("$match",
                                        new Document("$expr",
                                                new Document("$eq", List.of(
                                                        "$_id",
                                                        new Document("$toObjectId", "$$bookIdStr"))))),
                                new Document("$project",
                                        new Document("title", 1)
                                                .append("authors", 1)
                                                .append("price", 1))))
                        .append("as", "book"));
        AggregationOperation lookup = context -> lookupStage;

        // 5) $unwind book & $project kết quả
        AggregationOperation unwindBook = Aggregation.unwind("book");
        AggregationOperation project = Aggregation.project()
                .and("book._id").as("bookId")
                .and("book.title").as("title")
                .and("book.authors").as("authors")
                .and("book.price").as("price")
                .andInclude("totalSold");

        // Gộp pipeline
        Aggregation agg = Aggregation.newAggregation(
                unwindItems,
                groupByBook,
                sort,
                limit,
                lookup,
                unwindBook,
                project);

        return mongoTemplate.aggregate(agg, "orders", BestSellerDTO.class)
                .getMappedResults();
    }
}
