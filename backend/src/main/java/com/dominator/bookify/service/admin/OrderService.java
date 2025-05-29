// src/main/java/com/dominator/bookify/service/AdminBookService.java
package com.dominator.bookify.service.admin;

import com.dominator.bookify.dto.*;
import com.dominator.bookify.model.Order;
import com.dominator.bookify.model.TimeFrame;

import java.util.List;

public interface OrderService {
    List<Order> getAllOrders();
    Order getOrderById(String id);
    List<QuantitySoldDTO> getQuantitySold(TimeFrame timeFrame);
    List<TopSellerDTO> getTop5BestSelling(TimeFrame timeFrame);
    Order updateOrder(String id, Order order);
    Order createOrder(Order order);
    Order patchOrder(String id, OrderPatchDTO dto);
    boolean completeOrder(String id);
    boolean cancelOrder(String id);
}
