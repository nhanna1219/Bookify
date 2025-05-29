package com.dominator.bookify.service.admin;

import com.dominator.bookify.dto.AdminBookDTO;
import com.dominator.bookify.dto.BookCreateDTO;
import com.dominator.bookify.dto.BookUpdateDTO;
import com.dominator.bookify.model.Book;
import com.dominator.bookify.model.Category;
import com.dominator.bookify.repository.BookRepository;
import com.dominator.bookify.repository.CategoryRepository;
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
public class AdminBookServiceImpl implements AdminBookService {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<AdminBookDTO> getAllBooks() {
        List<Book> books = bookRepository.findAll();

        return books.stream().map(book -> {
            AdminBookDTO dto = new AdminBookDTO();
            // Copy simple properties
            BeanUtils.copyProperties(book, dto, "categoryIds", "categoryNames");

            // set IDs and authors, images, ratings, etc. If BeanUtils needs help
            dto.setCategoryIds(book.getCategoryIds());
            dto.setCategoryNames(fetchCategoryNames(book.getCategoryIds()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public AdminBookDTO getBookById(String id) {
        Book book = bookRepository.findById(id).orElse(null);;
        if (book == null) {
            return null;
        }
        return toDto(book);
    }

    @Override
    public AdminBookDTO createBook(BookCreateDTO dto) {
        // map dto -> book
        Book book = new Book();
        BeanUtils.copyProperties(dto, book);
        // Initialize rating fields
        book.setAverageRating(0);
        book.setRatingCount(0);
        book.setTotalRating(0);
        // set timestamps
        String now = Instant.now().toString();
        book.setAddedAt(now);
        book.setModifiedAt(now);

        Book saved = bookRepository.save(book);
        return toDto(saved);
    }

    @Override
    public AdminBookDTO updateBook(String id, BookUpdateDTO dto) {
        // 1. fetch existing book
        Book book = bookRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found")
        );

        // 2. Copy updatable properties
        BeanUtils.copyProperties(dto, book);

        // 3. Update timestamps
        book.setModifiedAt(Instant.now().toString());

        // 4. Save
        Book saved = bookRepository.save(book);

        // 5. Return
        return toDto(saved);
    }

    private AdminBookDTO toDto(Book book) {
        AdminBookDTO dto = new AdminBookDTO();
        BeanUtils.copyProperties(book, dto, "categoryIds", "categoryNames");
        dto.setCategoryIds(book.getCategoryIds());
        dto.setCategoryNames(fetchCategoryNames(book.getCategoryIds()));
//        List<String> categoriesIds = book.getCategoryIds();
//        if(categoriesIds != null && !categoriesIds.isEmpty()){
//            List<String> names = categoryRepository
//                    .findAllById(categoriesIds)
//                    .stream()
//                    .map(Category::getName)
//                    .toList();
//            dto.setCategoryNames(names);
//        }
        return dto;
        }

    private List<String> fetchCategoryNames(List<String> categoryIds) {
        if(categoryIds == null || categoryIds.isEmpty()) {
            return List.of();
        }
        List<Category> categories = categoryRepository.findAllById(categoryIds);
        return categories.stream().map(Category::getName).collect(Collectors.toList());
    }

}
