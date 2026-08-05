import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBanners } from '@/store/bannersSlice';

export default function Hero() {
    const dispatch = useAppDispatch();
    const { items: banners, loading } = useAppSelector((s) => s.banners);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            dispatch(fetchBanners());
        }
    }, [dispatch]);

    const slides = banners.length > 0
        ? banners.map((b) => ({ id: b.id, image: b.image_path }))
        : [
            { id: 1, image: '/slid01.jpg' },
            { id: 2, image: '/slid2.jpeg' },
        ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="relative w-full overflow-hidden rounded-xl p-2" style={{ aspectRatio: '16/9' }}>
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-2 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.image}
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                    />
                </div>
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
            {loading && (
                <div className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">Loading banners...</div>
            )}
        </div>
    );
}