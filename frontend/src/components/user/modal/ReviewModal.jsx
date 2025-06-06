import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, Star } from "lucide-react";
import RatingStar from "@u_components/products/RatingStar.jsx";

export function ReviewModal({ isOpen, order, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        rating: 0,
        subject: "",
        comment: "",
        bookId: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (formData.rating === 0) newErrors.rating = "Please select a rating";
        if (!formData.subject.trim()) newErrors.subject = "Subject is required";
        if (!formData.comment.trim()) newErrors.comment = "Comment is required";
        if (!formData.bookId) newErrors.bookId = "Please select a book to review";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                orderId: order.id,
                userId: order.userId,
            });

            // Reset form
            setFormData({ rating: 0, subject: "", comment: "", bookId: "" });
            setErrors({});
        } catch (err) {
            setErrors({ submit: "Failed to submit review. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ rating: 0, subject: "", comment: "", bookId: "" });
        setErrors({});
        onClose();
    };

    if (!order) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Star className="mr-2 text-[#1C387F]" size={20} />
                                        Write a Review
                                    </Dialog.Title>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Book Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Book to Review
                                        </label>
                                        <select
                                            value={formData.bookId}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    bookId: e.target.value,
                                                }))
                                            }
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C387F] focus:border-[#1C387F] ${
                                                errors.bookId ? "border-red-500" : "border-gray-300"
                                            }`}
                                        >
                                            <option value="">Choose a book...</option>
                                            {order.items.map((item) => (
                                                <option key={item.bookId} value={item.bookId}>
                                                    {item.title}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.bookId && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.bookId}
                                            </p>
                                        )}
                                    </div>

                                    {/* Rating */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rating
                                        </label>
                                        <RatingStar
                                            value={formData.rating}
                                            onChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    rating: value,
                                                }))
                                            }
                                        />
                                        {errors.rating && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.rating}
                                            </p>
                                        )}
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    subject: e.target.value,
                                                }))
                                            }
                                            placeholder="Brief summary of your review"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C387F] focus:border-[#1C387F] ${
                                                errors.subject ? "border-red-500" : "border-gray-300"
                                            }`}
                                        />
                                        {errors.subject && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.subject}
                                            </p>
                                        )}
                                    </div>

                                    {/* Comment */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Comment
                                        </label>
                                        <textarea
                                            value={formData.comment}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    comment: e.target.value,
                                                }))
                                            }
                                            placeholder="Share your thoughts about this book..."
                                            rows={4}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1C387F] focus:border-[#1C387F] resize-none ${
                                                errors.comment ? "border-red-500" : "border-gray-300"
                                            }`}
                                        />
                                        {errors.comment && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.comment}
                                            </p>
                                        )}
                                    </div>

                                    {errors.submit && (
                                        <p className="text-red-500 text-sm">{errors.submit}</p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-4 py-2 bg-[#1C387F] text-white rounded-lg hover:bg-[#153066] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? "Submitting..." : "Submit Review"}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
