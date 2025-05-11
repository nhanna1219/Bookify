import { useHomeData } from '@u_hooks/useHomeData';
import HeroSection from './sections/HeroSection.jsx';
import ShopFeatureSection from './sections/ShopFeatureSection.jsx';
import FeatureBookSection from './sections/FeatureBookSection.jsx';
import BestSellerSection from './sections/BestSellerSection.jsx';
import CategoriesSection from '@u_pages/HomePage/sections/CategoriesSection.jsx';
import CustomerReviewSection from '@u_pages/HomePage/sections/CustomerReviewSection.jsx';

export default function HomePage() {
    const { data, isLoading, isError } = useHomeData();
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }
    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">Error loading data. Please try again later.</p>
            </div>
        );
    }

    const { bestBooks = [], categories = [] } = data || {};

    // Split books into two parts
    const halfway = Math.ceil(bestBooks.length / 2);
    const featureBooks = bestBooks.slice(0, halfway);
    const bestSellerBooks = bestBooks.slice(halfway);

    return (
        <div className="min-h-screen">
            <HeroSection />
            <ShopFeatureSection />
            <img
                src="/second-banner.jpg"
                alt="Promotional Banner"
                className="w-full object-cover"
            />
            <FeatureBookSection books={featureBooks} />
            <div className="w-32 h-[2px] bg-[#1C387F] mx-auto my-12 rounded-full opacity-40" />
            <BestSellerSection books={bestSellerBooks} />
            <CustomerReviewSection />
            <CategoriesSection categories={categories} />
        </div>
    );
}
