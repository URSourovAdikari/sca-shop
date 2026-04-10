import { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Order Confirmation - SCA Shop",
    description: "SCA Shop Order Confirmation page",
};

export default function OrderConfirmationLayout({
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
