// @components/shared/NavCore.jsx
import {Link} from "react-router-dom";
import SearchBar from "@components/shared/SearchBar";
import {Heart, User, ShoppingCart} from "lucide-react";
import defaultLogo from "@assets/brand-logo-black.png";
import TopIconsBar from "@components/shared/TopIconsBar.jsx";

export default function NavCore({
                                    bgClass = "bg-white",
                                    iconColor = "text-black",
                                    padding = "py-4",
                                    logoSrc = defaultLogo
                                }) {
    return (
        <div className={`${bgClass} ${padding}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <Link to="/" className="shrink-0 pr-4">
                    <img src={logoSrc} alt="Bookify Logo" className="w-42"/>
                </Link>
                <SearchBar />
                <TopIconsBar color={iconColor} />
            </div>
        </div>
    );
}
