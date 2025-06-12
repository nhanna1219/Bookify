package com.dominator.bookify.service.admin;

import com.dominator.bookify.dto.OrderPatchDTO;
import com.dominator.bookify.dto.QuantitySoldDTO;
import com.dominator.bookify.dto.TopSellerDTO;
import com.dominator.bookify.model.*;
import com.dominator.bookify.repository.OrderRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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
    public Order getOrderById(String id) {
        return orderRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    @Override
    public List<QuantitySoldDTO> getQuantitySold(TimeFrame timeFrame) {
        MatchOperation match = buildMatch(timeFrame);
        GroupOperation group = group("items.bookId")
                .first("items.title").as("title")
                .sum("items.quantity").as("totalSold");

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
        return mongoTemplate.aggregate(agg, Order.class, QuantitySoldDTO.class).getMappedResults();
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

        Aggregation agg = newAggregation(match, unwind, group, sort, limit, project);
        return mongoTemplate.aggregate(agg, Order.class, TopSellerDTO.class).getMappedResults();
    }

    @Override
    public Order updateOrder(String id, Order order) {
        Order existing = orderRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        BeanUtils.copyProperties(order, existing, "_id", "addedAt", "modifiedAt");
        existing.setModifiedAt(Instant.now());
        return orderRepository.save(existing);
    }

    @Override
    public Order createOrder(Order order) {
        order.setAddedAt(Instant.now());
        order.setModifiedAt(Instant.now());
        return orderRepository.save(order);
    }

    @Override
    public Order patchOrder(String id, OrderPatchDTO dto) {
        Order existing = orderRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (dto.getOrderStatus() != null) {
            existing.setOrderStatus(dto.getOrderStatus());
        }
        if (dto.getShippingInformation() != null) {
            existing.setShippingInformation(dto.getShippingInformation());
        }
        if (dto.getPayment() != null) {
            existing.setPayment(dto.getPayment());
        }
        if (dto.getItems() != null) {
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
    public boolean setCompleteOrder(String id) {
        Order order = getOrderById(id);
        if (order.getOrderStatus() != OrderStatus.DELIVERED) return false;
        order.setOrderStatus(OrderStatus.COMPLETED);
        order.setDoneAt(Instant.now());
        order.setModifiedAt(Instant.now());
        orderRepository.save(order);
        return true;
    }

    @Override
    public boolean setCancelOrder(String id) {
        Order order = getOrderById(id);
        OrderStatus status = order.getOrderStatus();

        if (status == OrderStatus.PENDING || status == OrderStatus.PROCESSING) {
            order.setOrderStatus(OrderStatus.CANCELLED);
            order.setDoneAt(Instant.now());
            order.setModifiedAt(Instant.now());

            if (order.getPayment() != null && order.getPayment().getMethod() == PaymentMethod.MOMO) {
                Transaction tx = buildTransaction(order, TransactionStatus.PENDING_REFUND, "Refund for cancelled MoMo order");
                order.getPayment().getTransactions().add(tx);
            }

            orderRepository.save(order);
            return true;
        }
        return false;
    }

    @Override
    public boolean setProcessOrder(String id) {
        Order order = getOrderById(id);
        if (order.getOrderStatus() != OrderStatus.PENDING) return false;
        order.setOrderStatus(OrderStatus.PROCESSING);
        order.setModifiedAt(Instant.now());
        orderRepository.save(order);
        return true;
    }

    @Override
    public boolean setShipOrder(String id) {
        Order order = getOrderById(id);
        if (order.getOrderStatus() != OrderStatus.PROCESSING) return false;
        order.setOrderStatus(OrderStatus.SHIPPED);
        order.setModifiedAt(Instant.now());
        orderRepository.save(order);
        return true;
    }

    @Override
    public boolean setDeliveredOrder(String id) {
        Order order = getOrderById(id);
        if (order.getOrderStatus() != OrderStatus.SHIPPED) return false;
        order.setOrderStatus(OrderStatus.DELIVERED);
        order.setModifiedAt(Instant.now());

        // Only COD needs SUCCESSFUL transaction here
        if (order.getPayment() != null && order.getPayment().getMethod() == PaymentMethod.COD) {
            Transaction tx = buildTransaction(order, TransactionStatus.SUCCESSFUL, "COD Payment collected on delivery");
            order.getPayment().getTransactions().add(tx);
        }

        orderRepository.save(order);
        return true;
    }

    @Override
    public boolean setPendingRefundOrder(String id) {
        Order order = getOrderById(id);
        if (order.getOrderStatus() != OrderStatus.DELIVERED) return false;
        order.setOrderStatus(OrderStatus.PENDING_REFUND);
        order.setModifiedAt(Instant.now());

        Transaction tx = buildTransaction(order, TransactionStatus.PENDING_REFUND, "Refund requested by customer");
        order.getPayment().getTransactions().add(tx);

        orderRepository.save(order);
        return true;
    }

    @Override
    public boolean setRefundedOrder(String id) {
        Order order = getOrderById(id);
        if (order.getOrderStatus() != OrderStatus.PENDING_REFUND) return false;
        order.setOrderStatus(OrderStatus.REFUNDED);
        order.setDoneAt(Instant.now());
        order.setModifiedAt(Instant.now());

        Transaction tx = buildTransaction(order, TransactionStatus.REFUNDED, "Refund completed");
        order.getPayment().getTransactions().add(tx);

        orderRepository.save(order);
        return true;
    }

    private Transaction buildTransaction(Order order, TransactionStatus status, String description) {
        Transaction tx = new Transaction();
        tx.setTransactionId("TXN-" + System.currentTimeMillis());
        tx.setStatus(status);
        tx.setAmount(order.getTotalAmount());
        tx.setCreatedAt(Instant.now());
        tx.setDescription(description);
        tx.setOrderId(order.getId());
        tx.setMethod(order.getPayment() != null ? order.getPayment().getMethod() : PaymentMethod.COD);
        return tx;
    }

    private MatchOperation buildMatch(TimeFrame timeFrame) {
        Criteria criteria = Criteria.where("orderStatus").is("COMPLETED");
        Instant start = timeFrame.getStartInstant();
        if (start != null) {
            criteria = criteria.and("doneAt").gte(start);
        }
        return match(criteria);
    }
}
