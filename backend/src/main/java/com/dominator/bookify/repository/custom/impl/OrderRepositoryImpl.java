package com.dominator.bookify.repository.custom.impl;

import com.dominator.bookify.model.Order;
import com.dominator.bookify.repository.custom.OrderRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class OrderRepositoryImpl implements OrderRepositoryCustom {
    private final MongoTemplate mongoTemplate;

    @Override
    public Page<Order> searchOrders(String userId,
                                    String status,
                                    String searchTerm,
                                    Pageable pageable) {

        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(userId));

        // Status
        if (status != null && !status.trim().isEmpty()) {
            query.addCriteria(Criteria.where("orderStatus").is(status.trim()));
        }

        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            List<Criteria> orList = new ArrayList<>();

            // Item Name
            orList.add(Criteria.where("items.title").regex(searchTerm, "i"));

            // Order Id
            orList.add(Criteria.where("_id").is(searchTerm));

            // Total Amount
            try {
                Double amount = Double.parseDouble(searchTerm);
                orList.add(Criteria.where("totalAmount").is(amount));
            } catch (NumberFormatException ignored) {
                // SKIP
            }

            // Recipient Information
            orList.add(Criteria.where("shippingInformation.firstName").regex(searchTerm, "i"));
            orList.add(Criteria.where("shippingInformation.lastName").regex(searchTerm, "i"));
            orList.add(Criteria.where("shippingInformation.email").regex(searchTerm, "i"));
            orList.add(Criteria.where("shippingInformation.phoneNumber").regex(searchTerm, "i"));

            // Shipping Information
            orList.add(Criteria.where("shippingInformation.address.street").regex(searchTerm, "i"));
            orList.add(Criteria.where("shippingInformation.address.city").regex(searchTerm, "i"));
            orList.add(Criteria.where("shippingInformation.address.state").regex(searchTerm, "i"));
            orList.add(Criteria.where("shippingInformation.address.postalCode").regex(searchTerm, "i"));
            orList.add(Criteria.where("shippingInformation.address.country").regex(searchTerm, "i"));

            // Order Status
            orList.add(Criteria.where("orderStatus").regex(searchTerm, "i"));

            Criteria orAll = new Criteria().orOperator(orList.toArray(new Criteria[0]));
            query.addCriteria(orAll);
        }

        int pageNumber = pageable.getPageNumber();
        int pageSize = pageable.getPageSize();
        Pageable sortedPageable = PageRequest.of(pageNumber, pageSize, pageable.getSort());

        long total = mongoTemplate.count(query, Order.class);

        query.with(sortedPageable);

        List<Order> list = mongoTemplate.find(query, Order.class);
        return new PageImpl<>(list, sortedPageable, total);
    }
}
