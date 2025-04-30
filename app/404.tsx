import { usePathname } from "next/navigation"
import { underConstructionRoutes } from "@/lib/underConstructionRoutes"
import Link from "next/link"

export default function Custom404() {
    const pathname = usePathname()

    // Check if the current route is under construction
    const isUnderConstruction = underConstructionRoutes.includes(pathname || "")

    if (isUnderConstruction) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">🚧 Under Construction 🚧</h1>
                <p className="text-muted-foreground text-lg">
                    This page is currently under construction. Please check back later!
                </p>
                <div className="mt-8">
                    <Link href="/" className="text-primary hover:underline">
                        Go back to Home
                    </Link>
                </div>
            </div>
        )
    }

    // Default 404 page
    return (
        <div className="container py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-muted-foreground text-lg">
                The page you are looking for does not exist.
            </p>
            <div className="mt-8">
                <Link href="/" className="text-primary hover:underline">
                    Go back to Home
                </Link>
            </div>
        </div>
    )
}