import Link from "next/link"

export default function UnderConstruction() {
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