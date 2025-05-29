package com.dominator.bookify.repository;

import com.dominator.bookify.dto.QuantitySoldDTO;
import com.dominator.bookify.model.Order;
import com.dominator.bookify.model.User;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface OrderRepository extends MongoRepository<Order, String> {
}
