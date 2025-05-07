import { Star } from 'lucide-react';
import BookSlider from '@components/user/products/BookSlider';
import { books } from '@data/sampleData.js';

export default function BestSellerSection() {
    return (
        <section className="relative w-full py-16 text-center bg-[#E9F4FB]" aria-label="Best Sellers">
            <h2 className="inline-flex items-center gap-3 px-6 py-2 border border-white text-white bg-[#1C387F] rounded-full font-semibold uppercase tracking-wide text-lg shadow-md">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-white fill-current" />
                Best Seller
            </h2>
            <div className="mt-4 w-24 mx-auto h-1 bg-[#1C387F] rounded-full shadow-sm" />
            <div className="mt-10">
                <BookSlider books={books} />
            </div>
        </section>
    );
}
