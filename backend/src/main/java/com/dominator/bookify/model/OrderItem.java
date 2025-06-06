package com.dominator.bookify.model;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "orderItem")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderItem {
    private String bookId;
    private String title;
    private double price;
    private String imageUrl;
    private int quantity;
}