import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* Plausible Analytics - direct script injection for Pages Router */}
                <script
                    defer
                    data-domain="envsetup.dev"
                    src="https://plausible.io/js/script.tagged-events.outbound-links.js"
                ></script>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}