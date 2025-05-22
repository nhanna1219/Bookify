import api from "../api";

export const getBookReviews = (queryParams) => {
    const params = new URLSearchParams(queryParams);
    return api.get(`/reviews?${params}`);
}

export const getRatingDistribution = (bookId) => {
    return api.get(`/reviews/distribution?bookId=${bookId}`);
}