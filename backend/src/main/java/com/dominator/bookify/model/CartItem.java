package com.dominator.bookify.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    private String bookId;
    private String title;
    private String author;
    private double price;
    private int quantity;
    private String image;
    private String condition;
    private int stock;
}
