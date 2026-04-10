import { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Orders - SCA Shop",
    description: "SCA Shop Orders page",
};

export default function OrdersLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
            <Footer />
        </>
    );
}
