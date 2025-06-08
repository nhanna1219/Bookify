package com.dominator.bookify.service.user;

import com.dominator.bookify.dto.BookSearchDTO;
import com.dominator.bookify.dto.BookSummaryDTO;
import com.dominator.bookify.dto.WishlistRequestDTO;
import com.dominator.bookify.model.Book;
import com.dominator.bookify.model.Category;
import com.dominator.bookify.repository.BookRepository;
import com.dominator.bookify.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class BookService {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public Book getBookById(String id) {
        return bookRepository.findById(id).map(book -> {
            List<ObjectId> categoryIds = book.getCategoryIds();
            if (categoryIds != null && !categoryIds.isEmpty()) {
                List<String> categoryIdStrings = categoryIds.stream()
                        .map(ObjectId::toHexString)
                        .toList();

                List<String> names = categoryRepository.findAllById(categoryIdStrings)
                        .stream()
                        .map(Category::getName)
                        .toList();

                book.setCategoryNames(names);
            }
            return book;
        }).orElse(null);
    }


    public int getStock(String bookId) {
        Book book = getBookById(bookId);
        return book.getStock();
    }

    public void decreaseStock(String bookId, int quantity) {
        Book book = getBookById(bookId);
        if (book.getStock() < quantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for book: " + book.getTitle());
        }
        book.setStock(book.getStock() - quantity);
        bookRepository.save(book);
    }

    public Page<BookSummaryDTO> getBooksByIds(WishlistRequestDTO dto) {
        List<Book> books = bookRepository.findAllById(dto.getIds());

        String searchLower = dto.getSearchTxt().toLowerCase().trim();
        List<Book> filtered = books.stream()
                .filter(book ->
                        book.getTitle().toLowerCase().contains(searchLower) ||
                                (book.getAuthors() != null && book.getAuthors().stream()
                                        .anyMatch(author -> author.toLowerCase().contains(searchLower)))
                )
                .toList();

        List<BookSummaryDTO> summaries = filtered.stream()
                .map(book -> new BookSummaryDTO(
                        book.getId(),
                        book.getTitle(),
                        book.getAuthors(),
                        book.getPrice(),
                        book.getStock(),
                        book.getCondition(),
                        book.getAverageRating(),
                        book.getRatingCount(),
                        book.getTotalRating(),
                        book.getImages()
                ))
                .collect(Collectors.toList());

        int start = Math.min(dto.getPageIndex() * dto.getPageSize(), summaries.size());
        int end = Math.min(start + dto.getPageSize(), summaries.size());

        return new PageImpl<>(
                summaries.subList(start, end),
                PageRequest.of(dto.getPageIndex(), dto.getPageSize()),
                summaries.size()
        );
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
