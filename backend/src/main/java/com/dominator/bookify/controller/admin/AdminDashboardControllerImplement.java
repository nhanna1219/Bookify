package com.dominator.bookify.controller.admin;

import com.dominator.bookify.dto.*;
import com.dominator.bookify.service.admin.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AdminDashboardControllerImplement implements AdminDashboardController {

    private final AdminDashboardService dashboardService;

    @GetMapping("/api/admin/dashboard/top-by-category")
    @Override
    public List<TopCategoryQuantityDTO> getTopQuantityPerCategory() {
        return dashboardService.getTop10BooksPerCategory();
    }

    @GetMapping("/api/admin/dashboard/top-books")
    @Override
    public List<BestSellerDTO> getTopBooks() {
        return dashboardService.getTop10BestSellingBooks();
    }

    @GetMapping("api/admin/dashboard/loyal-customers")
    @Override
    public List<LoyalCustomerDTO> getTopLoyalCustomers() {
        return dashboardService.getTop10LoyalCustomers();
    }

    @GetMapping("api/admin/dashboard/top-user-by-avg-order-value")
    @Override
    public TopAvgOrderValueUserDTO getTopAvgOrderValueUser() {
        return dashboardService.findUserWithHighestAvgOrderValue();
    }

    @GetMapping("api/admin/dashboard/book-in-low-stock")
    @Override
    public List<BookInLowStockDTO> getTopBooksInLowStock() {
        return dashboardService.getBookWithLowStock();
    }
}
