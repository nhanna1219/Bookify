import { useEffect, useState } from "react";
import shippingBox from "@assets/box.png";

const announcements = [
    "Get Free Shipping on Orders above $30",
    "Flexible Payment Methods Available",
    "24/7 Support for All Customers",
];

export default function AnnouncementBar() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % announcements.length);
                setIsVisible(true);
            }, 300);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#1C387F] text-white text-[10px] py-3 h-[30px] overflow-hidden">
            <div className="max-w-7xl mx-auto flex justify-center items-center gap-2 h-full">
                <img src={shippingBox} alt="Shipping Icon" className="w-4 h-4 flex-shrink-0" />
                <div className="relative h-[14px] w-[200px] overflow-hidden">
                    <span
                        key={currentIndex}
                        className={`absolute left-0 w-full text-center font-medium transition-opacity duration-1000 ease-in-out
                            ${isVisible ? 'opacity-100' : 'opacity-0'}
                        `}
                    >
                        {announcements[currentIndex]}
                    </span>
                </div>
            </div>
        </div>
    );
}
