import { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Checkout - SCA Shop",
    description: "SCA Shop Checkout page",
};

export default function CheckoutLayout({
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
