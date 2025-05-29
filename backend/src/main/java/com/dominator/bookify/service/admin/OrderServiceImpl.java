package com.dominator.bookify.service.admin;

import com.dominator.bookify.dto.AdminUserDTO;
import com.dominator.bookify.dto.OrderPatchDTO;
import com.dominator.bookify.dto.QuantitySoldDTO;
import com.dominator.bookify.dto.TopSellerDTO;
import com.dominator.bookify.model.Order;
import com.dominator.bookify.model.Status;
import com.dominator.bookify.model.TimeFrame;
import com.dominator.bookify.model.User;
import com.dominator.bookify.repository.OrderRepository;
import com.dominator.bookify.repository.UserRepository;
import com.fasterxml.jackson.databind.util.BeanUtil;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Time;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;


@AllArgsConstructor
@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(String id){
        return orderRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    @Override
    public List<QuantitySoldDTO> getQuantitySold(TimeFrame timeFrame) {
        // Build match on status and timeframe
        MatchOperation match = buildMatch(timeFrame);

        // unwind items, group by bookId
        GroupOperation group = group("items.bookId")
                .first("items.title")
                .as("title")
                .sum("items.quantity")
                .as("totalSold");


        ProjectionOperation project = Aggregation.project()
                .and("_id").as("bookId")
                .and("title").as("title")
                .and("totalSold").as("totalSold")
                .andExclude("_id");

        Aggregation agg = newAggregation(
                match,
                unwind("items"),
                group,
                project,
                sort(Sort.by(Sort.Direction.DESC, "totalSold"))
        );
        return mongoTemplate
                .aggregate(agg, Order.class, QuantitySoldDTO.class)
                .getMappedResults();
    }

    @Override
    public List<TopSellerDTO> getTop5BestSelling(TimeFrame timeFrame) {
        MatchOperation match = buildMatch(timeFrame);

        UnwindOperation unwind = unwind("items");

        GroupOperation group = group("items.bookId")
                .sum("items.quantity").as("totalSold")
                .first("items.title").as("title");


        SortOperation sort = sort(Sort.by(Sort.Direction.DESC, "totalSold"));
        LimitOperation limit = limit(5);

        ProjectionOperation project = project()
                .and("_id").as("bookId")
                .and("totalSold").as("totalSold")
                .and("title").as("title")
                .andExclude("_id");

        Aggregation agg = newAggregation(
                match,
                unwind,
                group,
                sort,
                limit,
                project
        );

        return mongoTemplate
                .aggregate(agg, Order.class, TopSellerDTO.class)
                .getMappedResults();
    }

    @Override
    public Order updateOrder(String id, Order order) {
        Order exitstingOrder = orderRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        BeanUtils.copyProperties(order, exitstingOrder, "_id", "addedAt", "modifiedAt");
        exitstingOrder.setModifiedAt(Instant.now());

        return orderRepository.save(exitstingOrder);
    }

    @Override
    public Order createOrder(Order order) {
        order.setAddedAt(Instant.now());
        order.setModifiedAt(Instant.now());
        return orderRepository.save(order);
    }

    @Override
    public Order patchOrder(String id, OrderPatchDTO dto){
        Order existing = orderRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }
        if (dto.getShippingAddress() != null) {
            existing.setShippingAddress(dto.getShippingAddress());
        }
        if (dto.getPayment() != null) {
            existing.setPayment(dto.getPayment());
        }
        if (dto.getItems() !=null) {
            existing.setItems(dto.getItems());
            double total = existing.getItems().stream()
                    .mapToDouble(i -> i.getPrice() * i.getQuantity())
                    .sum();
            existing.setTotalAmount(total);
        }
        if (dto.getDoneAt() != null) {
            existing.setDoneAt(dto.getDoneAt());
        }

        existing.setModifiedAt(Instant.now());
        return orderRepository.save(existing);
    }

    @Override
    public boolean completeOrder(String orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getStatus().equals("COMPLETED") || order.getStatus().equals("CANCELLED")) {
            return false;
        }
        order.setStatus(Status.valueOf("COMPLETED"));
        order.setModifiedAt(Instant.now());
        orderRepository.save(order);
        return true;

    }

    @Override
    public boolean cancelOrder(String orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getStatus().equals("COMPLETED") || order.getStatus().equals("CANCELLED")) {
            return false;
        }
        order.setStatus(Status.valueOf("CANCELLED"));
        order.setModifiedAt(Instant.now());
        orderRepository.save(order);
        return true;
    }


    private MatchOperation buildMatch(TimeFrame timeFrame){
        Criteria criteria = Criteria.where("status").is("COMPLETED");
        Instant start = timeFrame.getStartInstant();
        if (start != null) {
            criteria = criteria.and("doneAt").gte(start);
        }
        return match(criteria);
    }

}
