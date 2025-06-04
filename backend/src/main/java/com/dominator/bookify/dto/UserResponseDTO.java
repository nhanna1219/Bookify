package com.dominator.bookify.dto;

import com.dominator.bookify.model.Address;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private List<String> favorites;
    private boolean verified;
    private Address address;
}
