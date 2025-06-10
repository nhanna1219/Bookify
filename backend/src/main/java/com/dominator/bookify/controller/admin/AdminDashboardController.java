package com.dominator.bookify.controller.admin;

import com.dominator.bookify.dto.BestSellerDTO;
import com.dominator.bookify.service.admin.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    @GetMapping("/api/admin/dashboard/top-books")
    public List<BestSellerDTO> getTopBooks() {
        return dashboardService.getTop5BestSellingBooks();
    }
}
