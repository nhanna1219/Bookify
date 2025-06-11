package com.dominator.bookify.service.admin;

import com.dominator.bookify.dto.BestSellerDTO;
import com.dominator.bookify.dto.LoyalCustomerDTO;
import com.dominator.bookify.dto.TopAvgOrderValueUserDTO;
import com.dominator.bookify.dto.TopCategoryQuantityDTO;

import java.util.List;

public interface AdminDashboardService {
    public List<BestSellerDTO> getTop10BestSellingBooks();
    public List<TopCategoryQuantityDTO> getTop10BooksPerCategory();
    public List<LoyalCustomerDTO> getTop10LoyalCustomers();
    public TopAvgOrderValueUserDTO findUserWithHighestAvgOrderValue();
}
