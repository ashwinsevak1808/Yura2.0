import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export default function NotFound() {
    return (
        <>
            <Header />
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
                <h1 className="text-9xl font-light text-gray-200">404</h1>
                <div className="mt-8 space-y-4">
                    <h2 className="text-3xl font-medium tracking-tight text-gray-900">
                        Page not found
                    </h2>
                    <p className="max-w-[500px] text-gray-500">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                    <Link href="/">
                        <Button variant="primary" size="lg" leftIcon={<MoveLeft className="h-4 w-4" />}>
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/collections/all">
                        <Button variant="outline" size="lg">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    );
}
