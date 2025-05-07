import { Truck, CreditCard, Headphones } from 'lucide-react';

export default function ShopFeatureSection() {
    return (
        <div className="bg-white py-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center gap-2">
                    <Truck className="w-6 h-6 text-[#1C387F]" />
                    <p className="text-[#1C387F] font-bold">Free shipping</p>
                    <p className="text-sm text-gray-500">Free shipping for orders above $250</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <CreditCard className="w-6 h-6 text-[#1C387F]" />
                    <p className="text-[#1C387F] font-bold">Flexible payment methods</p>
                    <p className="text-sm text-gray-500">Multiple secure payment options</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Headphones className="w-6 h-6 text-[#1C387F]" />
                    <p className="text-[#1C387F] font-bold">24x7 Support</p>
                    <p className="text-sm text-gray-500">We support online all days</p>
                </div>
            </div>
        </div>
    );
}
