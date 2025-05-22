import {Heart} from "lucide-react";
import React, {useState} from "react";

export default function WishlistBtn() {
    const [liked, setLiked] = useState(false);

    return (
        <button
            onClick={() => setLiked(!liked)}
            className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.45)] flex items-center justify-center z-20 transition-shadow duration-300 hover:scale-110 hover:shadow-[0_4px_10px_rgba(0,0,0,0.60)]"
        >
            <Heart className={`w-4 h-4 ${liked ? 'text-[#db1515] fill-[#db1515]' : 'text-black'}`} />
        </button>
    )
}