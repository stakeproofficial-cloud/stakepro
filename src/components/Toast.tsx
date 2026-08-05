"use client";
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠',
    };

    return (
        <div
            className={`fixed top-20 right-4 z-[9999] max-w-sm w-full ${isExiting ? 'toast-exit' : 'toast-enter'
                }`}
        >
            <div className={`${bgColors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3`}>
                <span className="text-2xl">{icons[type]}</span>
                <p className="flex-1">{message}</p>
                <button
                    onClick={() => {
                        setIsExiting(true);
                        setTimeout(onClose, 300);
                    }}
                    className="text-white hover:text-gray-200"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}