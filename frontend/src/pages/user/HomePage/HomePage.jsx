import HeroSection from './sections/HeroSection';
import ShopFeatureSection from './sections/ShopFeatureSection.jsx';
import FeatureBookSection from './sections/FeatureBookSection.jsx';
import BestSellerSection from './sections/BestSellerSection';
import CategoriesSection from "@pages/HomePage/sections/CategoriesSection.jsx";
import CustomerReviewSection from "@pages/HomePage/sections/CustomerReviewSection.jsx";

export default function HomePage() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <ShopFeatureSection />
            <img
                src="/second-banner.jpg"
                alt="Promotional Banner"
                className="w-full object-cover"
            />
            <FeatureBookSection />
            <div className="w-32 h-[2px] bg-[#1C387F] mx-auto my-12 rounded-full opacity-40" />
            <BestSellerSection />
            <CustomerReviewSection />
            <CategoriesSection />

        </div>
    );
}
