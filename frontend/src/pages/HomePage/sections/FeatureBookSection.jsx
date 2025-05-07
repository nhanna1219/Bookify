import { BookOpen } from 'lucide-react';
import BookSlider from '@components/products/BookSlider';
import { books } from '@data/sampleData.js';

export default function FeatureBookSection() {
    return (
        <section className="relative w-full pt-16 text-center" aria-label="Featured Books">
            <h2 className="inline-flex items-center gap-3 px-6 py-2 border border-[#1C387F] rounded-full text-[#1C387F] font-semibold uppercase tracking-wide text-lg bg-white shadow-md">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                Feature Books
            </h2>
            <div className="mt-4 w-24 mx-auto h-1 bg-[#1C387F] rounded-full shadow-sm" />
            <div className="mt-10">
                <BookSlider books={books} />
            </div>
        </section>
    );
}
