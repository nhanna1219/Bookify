import {useQueries} from '@tanstack/react-query'
import {getBooks} from '@u_services/bookService'
import {getCategories} from '@u_services/categoryService'

export const useShopData = (queryParams) => {
    const [categoriesQ, booksQ] = useQueries({
        queries: [
            {
                queryKey: ['categories'],
                queryFn: () => getCategories().then(r => r.data),
                staleTime: 1000 * 60 * 30,      // 30 minutes
                cacheTime: 1000 * 60 * 60,     // 1 hour
            },
            {
                queryKey: ['shopData', queryParams],
                queryFn: () => getBooks(queryParams).then(r => r.data),
                keepPreviousData: true,
            },
        ]
    })

    return {
        categories: categoriesQ.data,
        books: booksQ.data,
        isLoading: categoriesQ.isLoading || booksQ.isLoading,
        isError: categoriesQ.isError || booksQ.isError,
    }
}
