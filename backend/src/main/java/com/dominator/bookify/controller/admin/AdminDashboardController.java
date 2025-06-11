package com.dominator.bookify.controller.admin;

import com.dominator.bookify.dto.BestSellerDTO;
import com.dominator.bookify.dto.LoyalCustomerDTO;
import com.dominator.bookify.dto.TopAvgOrderValueUserDTO;
import com.dominator.bookify.dto.TopCategoryQuantityDTO;

import java.util.List;

public interface AdminDashboardController {
    public List<TopCategoryQuantityDTO> getTopQuantityPerCategory();
    public List<BestSellerDTO> getTopBooks();
    public List<LoyalCustomerDTO>getTopLoyalCustomers();
    public TopAvgOrderValueUserDTO getTopAvgOrderValueUser();
}
