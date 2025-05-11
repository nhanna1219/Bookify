// src/services/user/bookService.js
import api from '../api';

export const getBestBooks = () => api.get('/books/bestByRating');

