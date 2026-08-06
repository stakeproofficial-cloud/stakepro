'use client';
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ToastProvider } from "./ToastProvider";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { hydrateFromCookies } from "@/store/authSlice";

type MainLayoutProps = {
    children: React.ReactNode;
};

function HydrationWrapper({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(hydrateFromCookies());
    }, [dispatch]);

    return <>{children}</>;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <Provider store={store}>
            <ToastProvider>
                <HydrationWrapper>
                    <div className="min-h-screen bg-[#0A0A0F] font-sans text-[#F4F2FB]">
                        {children}
                    </div>
                </HydrationWrapper>
            </ToastProvider>
        </Provider>
    );
}