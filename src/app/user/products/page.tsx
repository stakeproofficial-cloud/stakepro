'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserProductsPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/user/usdt-staking');
    }, [router]);

    return null;
}
