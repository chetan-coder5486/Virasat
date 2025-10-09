import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createCircle } from '@/redux/circleThunks'; // Assuming you have this thunk

export const CreateCircleModal = ({ isOpen, onClose, familyMembers }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // --- State for the form ---
    const [circleName, setCircleName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    
    // Get loading states from Redux
    const { loading: circleLoading } = useSelector((state) => state.circle);
    const { loading: familyLoading, error } = useSelector((state) => state.family);

    // --- Handlers for form interactions ---
    const handleMemberSelect = (memberId) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleCreateCircle = (e) => {
        e.preventDefault();
        if (!circleName.trim() || selectedMembers.length === 0) {
            alert("Please provide a circle name and select at least one member.");
            return;
        }

        dispatch(createCircle({ circleName, members: selectedMembers }))
            .unwrap()
            .then(() => {
                onClose(); // Close the modal on success
                navigate("/circles"); // Navigate to the circles page
            })
            .catch((err) => {
                console.error("Failed to create circle:", err);
            });
    };

    // Don't render anything if the modal is not open
    if (!isOpen) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                >
                    <h2 className="text-2xl font-bold font-serif text-rose-800">
                        Create a Private Circle
                    </h2>

                    <p className="mb-6 text-rose-700">
                        Select family members to share stories with a smaller group.
                    </p>

                    <form onSubmit={handleCreateCircle}>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="circleName"
                                    className="block text-sm font-semibold text-rose-900"
                                >
                                    Circle Name
                                </label>
                                <input
                                    type="text"
                                    id="circleName"
                                    value={circleName}
                                    onChange={(e) => setCircleName(e.target.value)}
                                    placeholder='e.g., "The Siblings", "Cousins Club"'
                                    required
                                    className="mt-1 w-full rounded-lg border-rose-200 p-2 text-rose-900 shadow-sm focus:border-rose-400 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-rose-900">
                                    Add Members
                                </label>
                                <p className="text-sm text-rose-700 mb-2">
                                    {selectedMembers.length} member{selectedMembers.length !== 1 ? "s" : ""} selected
                                </p>
                                <div className="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-lg border border-rose-200 p-2">
                                    {familyLoading && (
                                        <p className="p-2 text-rose-700">Loading members...</p>
                                    )}
                                    {error && <p className="p-2 text-red-600">Error: {error}</p>}
                                    {familyMembers.map((member) => (
                                        <label
                                            key={member._id}
                                            className="flex cursor-pointer items-center space-x-3 rounded-md p-2 hover:bg-rose-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedMembers.includes(member._id)}
                                                onChange={() => handleMemberSelect(member._id)}
                                                className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                                            />
                                            <span className="text-rose-800">{member.fullName}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={circleLoading}
                                className={`rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition ${
                                    circleLoading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-rose-600 hover:bg-rose-700"
                                }`}
                            >
                                {circleLoading ? "Creating..." : "Create Circle"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};