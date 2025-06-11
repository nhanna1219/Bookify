package com.dominator.bookify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopAvgOrderValueUserDTO {
    private String userId;
    private String fullName;
    private String email;
    private double averageOrderValue;
}
