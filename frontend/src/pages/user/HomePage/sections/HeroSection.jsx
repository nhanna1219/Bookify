import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <div className="bg-[#E9F4FB] h-[525px] flex">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col-reverse md:flex-row items-center justify-center gap-10">
                <div className="w-full md:w-1/2">
                    <img src="/book-stack.png" alt="Used books stack" className="w-full max-w-md mx-auto drop-shadow-md" />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1C387F] mb-4">
                        GOOD BOOKS DESERVE A SECOND LIVE
                    </h1>
                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                        Someone out there is looking for the story you once loved.<br />
                        Join Bookify — where old reads find new homes.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1C387F] text-white text-sm font-semibold shadow-md hover:bg-[#152f6a] transition"
                    >
                        SHOP NOW
                    </Link>
                </div>
            </div>
        </div>
    );
}
