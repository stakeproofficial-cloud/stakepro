'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';

export default function LogoutPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await dispatch(logout()).unwrap();
            } finally {
                router.replace('/login');
            }
        };

        performLogout();
    }, [dispatch, router]);

    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="card-premium p-8 rounded-lg">
                <p className="text-pm-gold-500">Logging out...</p>
            </div>
        </main>
    );
}