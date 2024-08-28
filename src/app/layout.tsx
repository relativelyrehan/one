import { GoogleAnalytics } from "@next/third-parties/google";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "onetapqr.xyz",
  description:
    "Simplify app downloads with 'one' smart links for all app stores. Short link generator for app downloads.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://onetapqr.xyz",
    siteName: "onetapqr.xyz",
    title: "onetapqr.xyz",
    description:
      "Simplify app downloads with 'one' smart links for all app stores. Short link generator for app downloads.",
    images: [
      {
        url: "https://onetapqr.xyz/og.png",
        width: 400,
        height: 400,
        alt: "onetapqr.xyz",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"crimson"}>
        <AuthProvider>{children}</AuthProvider>
        <script
          async
          defer
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        ></script>
        <noscript>
          <img
            src="https://queue.simpleanalyticscdn.com/noscript.gif"
            alt=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </noscript>
        <GoogleAnalytics gaId="G-XS55JLKVG0" />
      </body>
    </html>
  );
}
