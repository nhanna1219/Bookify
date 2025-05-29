package com.dominator.bookify.controller.admin;

import com.dominator.bookify.dto.*;
import com.dominator.bookify.service.admin.AdminBookService;
import com.dominator.bookify.service.admin.AdminUserService;
import com.dominator.bookify.service.user.BookService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<?> getAllUsers(){
        try {
            return ResponseEntity.ok().body(adminUserService.getAllUsers());
        }catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id){
        try {
            return ResponseEntity.ok().body(adminUserService.getUserById(id));
        }catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        }
    }
}
