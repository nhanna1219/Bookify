package com.dominator.bookify.service.admin;

import com.dominator.bookify.dto.AdminBookDTO;
import com.dominator.bookify.dto.AdminUserDTO;
import com.dominator.bookify.dto.BookCreateDTO;
import com.dominator.bookify.dto.BookUpdateDTO;
import com.dominator.bookify.model.Book;
import com.dominator.bookify.model.Category;
import com.dominator.bookify.model.User;
import com.dominator.bookify.repository.BookRepository;
import com.dominator.bookify.repository.CategoryRepository;
import com.dominator.bookify.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class AdminUserServiceImpl implements AdminUserService {
    private final UserRepository userRepository;

    @Override
    public List<AdminUserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::toDto).collect(Collectors.toList());
    }


    @Override
    public AdminUserDTO getUserById(String id) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toDto(user);
    }

    private AdminUserDTO toDto(User user) {
        AdminUserDTO dto = new AdminUserDTO();
        BeanUtils.copyProperties(user, dto, "passwordHash");
        return dto;
    }


}
