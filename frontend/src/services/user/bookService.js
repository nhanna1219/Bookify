// src/services/user/bookService.js
import api from '../api';
import axios from "axios";

export const getBestBooks = () => api.get('/books/bestByRating');

export const getBooks = async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/books/search?${queryString}`);
};

export const getBookDetails = async (bookId) => {
    return api.get(`/books/${bookId}`);
}