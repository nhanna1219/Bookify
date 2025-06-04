package com.dominator.bookify.service.user;

import com.dominator.bookify.dto.CreateOrderResponse;
import com.dominator.bookify.dto.OrderCreationRequestDTO;
import com.dominator.bookify.dto.OrderItemRequestDTO;
import com.dominator.bookify.model.*;
import com.dominator.bookify.repository.OrderRepository;
import com.dominator.bookify.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookService bookService;
    private final CartService cartService;
    private final MomoService momoService;

    private static final BigDecimal TAX_RATE = new BigDecimal("0.08");
    private static final BigDecimal SHIPPING_COST_THRESHOLD = new BigDecimal("30.00");
    private static final BigDecimal DEFAULT_SHIPPING_COST = new BigDecimal("15.00");
    private static final BigDecimal FREE_SHIPPING_COST = new BigDecimal("0.00");

    public Order findById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    @Transactional
    public Order createOrder(AuthenticatedUser authenticatedUser, OrderCreationRequestDTO requestDTO) {
        String userId = authenticatedUser.getUser().getId();
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal itemsSubtotal = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemRequest : requestDTO.getItems()) {
            Book book = bookService.getBookById(itemRequest.getBookId());
            int requestedQty = itemRequest.getQuantity();
            if (book.getStock() < requestedQty) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for book: " + book.getTitle());
            }
            OrderItem orderItem = buildOrderItem(book, requestedQty);
            orderItems.add(orderItem);
            BigDecimal itemTotal = BigDecimal.valueOf(book.getPrice()).multiply(BigDecimal.valueOf(requestedQty));
            itemsSubtotal = itemsSubtotal.add(itemTotal);
        }

        BigDecimal shippingCost = calculateShippingCost(itemsSubtotal);
        BigDecimal taxes = itemsSubtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal grandTotalUsd = itemsSubtotal.add(taxes).add(shippingCost).setScale(2, RoundingMode.HALF_UP);

        Order order = new Order();
        order.setUserId(userId);
        order.setItems(orderItems);
        order.setShippingInformation(requestDTO.getShippingInformation());
        order.setTotalAmount(grandTotalUsd.doubleValue());
        order.setPayment(buildInitialPayment(requestDTO.getPaymentInfo().getMethod(), grandTotalUsd));
        order.setOrderStatus(OrderStatus.PENDING);
        Order savedOrder = orderRepository.save(order);

        for (OrderItem item : orderItems) {
            bookService.decreaseStock(item.getBookId(), item.getQuantity());
        }

        Map<String, Integer> qtyMap = orderItems.stream()
                .collect(Collectors.toMap(OrderItem::getBookId, OrderItem::getQuantity));
        cartService.removeItems(userId, null, qtyMap);

        return savedOrder;
    }

    @Transactional
    public CreateOrderResponse createOrderAndGetMomoUrl(AuthenticatedUser authenticatedUser, OrderCreationRequestDTO requestDTO) {
        Order order = createOrder(authenticatedUser, requestDTO);
        BigDecimal amountUsd = BigDecimal.valueOf(order.getTotalAmount());
        String paymentUrl = momoService.createPaymentUrl(amountUsd, order.getId());
        return new CreateOrderResponse(order.getId(), paymentUrl);
    }

    private OrderItem buildOrderItem(Book book, int quantity) {
        OrderItem item = new OrderItem();
        item.setBookId(book.getId());
        item.setImageUrl(book.getImages().getFirst().getUrl());
        item.setTitle(book.getTitle());
        item.setPrice(book.getPrice());
        item.setQuantity(quantity);
        return item;
    }

    private BigDecimal calculateShippingCost(BigDecimal subtotal) {
        return subtotal.compareTo(SHIPPING_COST_THRESHOLD) > 0 ? FREE_SHIPPING_COST : DEFAULT_SHIPPING_COST;
    }

    private Payment buildInitialPayment(String method, BigDecimal amount) {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setAmount(amount.doubleValue());
        transaction.setRawResponse("Pending payment: " + amount.doubleValue());
        transaction.setCreatedAt(Instant.now());

        Payment payment = new Payment();
        payment.setMethod(method);
        payment.setTransactions(List.of(transaction));
        return payment;
    }

    @Transactional
    public void updateOrderStatusFromMomo(String momoOrderId,
                                          String momoTransactionId,
                                          int resultCode,
                                          String rawResponse) {
        String ourOrderId = momoOrderId.replaceFirst("^Bookify-", "");
        Order order = orderRepository.findById(ourOrderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        Payment payment = order.getPayment();
        Transaction txn = new Transaction();
        txn.setTransactionId(momoTransactionId);
        txn.setStatus(resultCode == 0 ? TransactionStatus.SUCCESSFUL : TransactionStatus.FAILED);
        txn.setAmount(order.getTotalAmount());
        txn.setRawResponse(rawResponse);
        txn.setCreatedAt(Instant.now());

        payment.getTransactions().add(txn);

        if (resultCode == 0) {
            order.setOrderStatus(OrderStatus.PROCESSING);
        } else {
            order.setOrderStatus(OrderStatus.PENDING);
        }

        orderRepository.save(order);
    }
}
