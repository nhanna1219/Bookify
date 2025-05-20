package com.dominator.bookify.repository;

import com.dominator.bookify.dto.BookSummaryDTO;
import com.dominator.bookify.model.Book;
import com.dominator.bookify.repository.custom.BookRepositoryCustom;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends MongoRepository<Book, String>, BookRepositoryCustom {
    Book getBookById(String id);
    List<BookSummaryDTO> findByOrderByAverageRatingDesc(Pageable pageable);
}
