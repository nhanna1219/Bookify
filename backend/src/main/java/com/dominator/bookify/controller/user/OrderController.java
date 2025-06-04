package com.dominator.bookify.controller.user;

import com.dominator.bookify.dto.CreateOrderResponse;
import com.dominator.bookify.dto.OrderCreationRequestDTO;
import com.dominator.bookify.model.Order;
import com.dominator.bookify.security.AuthenticatedUser;
import com.dominator.bookify.service.user.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Validated
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(
            @Valid @PathVariable String orderId) {
        try {
            Order order = orderService.findById(orderId);
            return ResponseEntity.ok(order);
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(Map.of("error", Objects.requireNonNull(e.getReason())));
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrder(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody OrderCreationRequestDTO orderRequestDTO) {
        try {
            Order createdOrder = orderService.createOrder(authenticatedUser, orderRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (ResponseStatusException ex) {
            return ResponseEntity
                    .status(ex.getStatusCode())
                    .body(Map.of("error", Objects.requireNonNull(ex.getReason())));
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred while processing your order."));
        }
    }

    @PostMapping("/momo")
    public ResponseEntity<?> createOrderWithMomo(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody OrderCreationRequestDTO orderRequestDTO) {
        try {
            CreateOrderResponse redirectRes = orderService.createOrderAndGetMomoUrl(authenticatedUser, orderRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(redirectRes);
        } catch (ResponseStatusException ex) {
            return ResponseEntity
                    .status(ex.getStatusCode())
                    .body(Map.of("error", Objects.requireNonNull(ex.getReason())));
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred while creating MoMo payment."));
        }
    }
}
