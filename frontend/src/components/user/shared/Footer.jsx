import { Link } from "react-router-dom";
import logo from "@assets/brand-logo-white.png";
import FacebookIcon from '@assets/facebook.svg';
import TwitterIcon from '@assets/twitter.svg';
import TikTokIcon from '@assets/tiktok.svg';
import PinterestIcon from '@assets/pinterest.svg';

export default function Footer() {
    return (
        <footer className="bg-[#1C387F] text-white text-sm px-8 pt-5 pb-5">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-x-12">
                {/* Logo & Description */}
                <div className="col-span-2 md:col-span-1 space-y-3">
                    <Link to="/">
                        <img src={logo} alt="Bookify Logo" className="w-36" />
                    </Link>
                    <p className="text-gray-200 leading-relaxed">
                        Client’s satisfaction is our precious motivation to develop and improve comprehensively.
                    </p>
                    <div className="flex gap-3 pt-2">
                        {[FacebookIcon, TwitterIcon, TikTokIcon, PinterestIcon].map((icon, idx) => (
                            <a key={idx} href="#" aria-label={`Social ${idx}`}>
                                <img
                                    src={icon}
                                    alt="Social Icon"
                                    className="w-5 h-5 hover:opacity-80 transition duration-200"
                                />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Company */}
                <div className="space-y-2 content-center">
                    <h3 className="font-semibold mb-2">Company</h3>
                    <Link to="/about" className="block hover:underline">About us</Link>
                    <Link to="/contact" className="block hover:underline">Contact us</Link>
                </div>

                {/* Customer Services */}
                <div className="space-y-2 content-center">
                    <h3 className="font-semibold mb-2">Customer Services</h3>
                    <Link to="/me" className="block hover:underline">My Account</Link>
                    <Link to="/orders" className="block hover:underline">Track your order</Link>
                    <Link to="/faq" className="block hover:underline">FAQ</Link>
                </div>

                {/* Our Information */}
                <div className="space-y-2 content-center">
                    <h3 className="font-semibold mb-2">Our information</h3>
                    <Link to="/privacy" className="block hover:underline">Privacy</Link>
                    <Link to="/terms" className="block hover:underline">User Terms & Condition</Link>
                    <Link to="/returns" className="block hover:underline">Return Policy</Link>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 content-center">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <p>+84 933 309 433</p>
                    <p>bookify.shopp@gmail.com</p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/30 mt-6 pt-5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-300 gap-3">
                <p>© 2025 by <span className="font-semibold text-white">Bookify</span></p>
                <div className="flex items-center gap-3">
                    <select className="bg-transparent text-gray-200 focus:outline-none">
                        <option>English</option>
                    </select>
                    <span className="text-white/40">|</span>
                    <select className="bg-transparent text-gray-200 focus:outline-none">
                        <option>USD</option>
                    </select>
                </div>
            </div>
        </footer>
    );
}
