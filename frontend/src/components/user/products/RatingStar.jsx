import { Rating, RoundedStar } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

export default function RatingStar({ ratingValue }) {
    const ratingStyles = {
        itemShapes: RoundedStar,
        activeFillColor: '#FACC15',
        inactiveFillColor: '#CBD5E1',
        activeStrokeColor: '#D97706',
        inactiveStrokeColor: '#64748B',
        itemStrokeWidth: 1.5
    };

    return (
        <Rating
            style={{ maxWidth: 90 }}
            value={ratingValue}
            readOnly
            itemStyles={ratingStyles}
        />
    )
}