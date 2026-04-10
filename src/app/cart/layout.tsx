import { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Cart - SCA Shop",
    description: "SCA Shop Cart page",
};

export default function CartLayout({
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
