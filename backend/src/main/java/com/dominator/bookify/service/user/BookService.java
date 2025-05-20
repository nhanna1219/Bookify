package com.dominator.bookify.service.user;

import com.dominator.bookify.dto.BookSearchDTO;
import com.dominator.bookify.dto.BookSummaryDTO;
import com.dominator.bookify.model.Book;
import com.dominator.bookify.model.Category;
import com.dominator.bookify.repository.BookRepository;
import com.dominator.bookify.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class BookService {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public Book getBookById(String id) {
        return bookRepository.findById(id).map(book -> {
            List<String> categoryIds = book.getCategoryIds();
            if (categoryIds != null && !categoryIds.isEmpty()) {
                List<String> names = categoryRepository.findAllById(categoryIds)
                        .stream()
                        .map(Category::getName)
                        .toList();
                book.setCategoryNames(names);
            }
            return book;
        }).orElse(null);
    }

    public Page<BookSummaryDTO> getBooks(BookSearchDTO searchDTO) {
        Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), getSort(searchDTO.getSortBy()));
        return bookRepository.findBooks(
                searchDTO.getCondition(),
                searchDTO.getMinPrice(),
                searchDTO.getMaxPrice(),
                searchDTO.getGenres(),
                searchDTO.getSearch(),
                searchDTO.getMinRating(),
                pageable
        );
    }

    private Sort getSort(String sortBy) {
        return switch (sortBy) {
            case "newest" -> Sort.by(Sort.Direction.DESC, "addedAt");
            case "price-low" -> Sort.by(Sort.Direction.ASC, "price");
            case "price-high" -> Sort.by(Sort.Direction.DESC, "price");
            case "title-az" -> Sort.by(Sort.Direction.ASC, "title");
            case "title-za" -> Sort.by(Sort.Direction.DESC, "title");
            default -> Sort.by(Sort.Direction.ASC, "title");
        };
    }

    public List<BookSummaryDTO> getBestBooks() {
        Pageable pageable = PageRequest.of(0, 16, Sort.by(Sort.Direction.DESC, "averageRating"));
        return bookRepository.findByOrderByAverageRatingDesc(pageable);
    }
}
