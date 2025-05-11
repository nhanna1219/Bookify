// src/hooks/useHomeData.js
import { useQuery } from '@tanstack/react-query';
import { getBestBooks } from '@u_services/bookService';
import { getCategories } from '@u_services/categoryService';

export const useHomeData = () => {
    return useQuery({
        queryKey: ['homeData'],
        queryFn: async () => {
            const [bestBooksReq, categoriesReq] = await Promise.all([
                getBestBooks(),
                getCategories()
            ]);
            return { bestBooks: bestBooksReq.data, categories: categoriesReq.data };
        },
    });
};
