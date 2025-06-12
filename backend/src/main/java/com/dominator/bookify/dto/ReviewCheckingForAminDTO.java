package com.dominator.bookify.dto;

import com.dominator.bookify.model.ReviewStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewCheckingForAminDTO {
    private String id;
    private String bookId;
    private String userId;
    private int rating;
    private String subject;
    private String comment;
    private ReviewStatus status;
    private String addedAt;
    private String modifiedAt;
}
