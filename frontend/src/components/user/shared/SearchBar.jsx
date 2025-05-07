import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", query);
    };

    return (
        <div className="w-full max-w-xl">
            <form
                onSubmit={handleSearch}
                className="flex items-center h-9 w-full ml-auto rounded-full bg-white shadow-sm ring-1 ring-[#1C387F]/30
    focus-within:ring-2 focus-within:ring-[#4B6CB7] focus-within:ring-offset-2
    transition-all duration-200"
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="flex-grow px-5 text-sm text-gray-800 placeholder-[#b8b0d3] bg-transparent focus:outline-none"
                />
                <button
                    type="submit"
                    className="w-14 h-[33px] bg-[#1C387F] hover:bg-[#162c64] rounded-r-full grid place-items-center transition-colors duration-200 mr-[2px] cursor-pointer"
                >
                    <Search size={18} className="text-white" />
                </button>
            </form>
        </div>
    );
}
