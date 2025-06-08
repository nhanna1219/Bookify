import { useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { X, AlertTriangle } from "lucide-react"

const CANCELLATION_REASONS = [
    "Changed my mind",
    "Found a better price elsewhere",
    "Ordered by mistake",
    "No longer needed",
    "Delivery taking too long",
    "Other",
]

export function CancelOrderModal({ isOpen, order, onClose, onConfirm }) {
    const [reason, setReason] = useState("")
    const [customReason, setCustomReason] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!reason) {
            setError("Please select a reason for cancellation")
            return
        }

        if (reason === "Other" && !customReason.trim()) {
            setError("Please provide a custom reason")
            return
        }

        setLoading(true)
        setError("")

        try {
            const finalReason = reason === "Other" ? customReason : reason
            await onConfirm(order.id, finalReason)

            // Reset form
            setReason("")
            setCustomReason("")
        } catch (err) {
            setError("Failed to cancel order. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setReason("")
        setCustomReason("")
        setError("")
        onClose()
    }

    if (!order) return null

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
                                        <AlertTriangle className="mr-2 text-red-600" size={20} />
                                        Cancel Order
                                    </Dialog.Title>
                                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">
                                        Are you sure you want to cancel order #{order.id.slice(-8)}? This action cannot be undone.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation</label>
                                        <div className="space-y-2">
                                            {CANCELLATION_REASONS.map((reasonOption) => (
                                                <label key={reasonOption} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="reason"
                                                        value={reasonOption}
                                                        checked={reason === reasonOption}
                                                        onChange={(e) => setReason(e.target.value)}
                                                        className="mr-2 text-[#1C387F] focus:ring-[#1C387F]"
                                                    />
                                                    <span className="text-sm text-gray-700">{reasonOption}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {reason === "Other" && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Please specify</label>
                                            <textarea
                                                value={customReason}
                                                onChange={(e) => setCustomReason(e.target.value)}
                                                placeholder="Please provide your reason..."
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C387F] focus:border-[#1C387F] resize-none"
                                            />
                                        </div>
                                    )}

                                    {error && <p className="text-red-500 text-sm">{error}</p>}

                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Keep Order
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? "Cancelling..." : "Cancel Order"}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
