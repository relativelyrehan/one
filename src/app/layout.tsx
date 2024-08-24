import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const metadata = {
  title: "One link or QR code to apps on App Store, Google Play",
  description:
    "Simplify app downloads with 'one' smart links for all app stores. Short link generator for app downloads.",
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
      </body>
    </html>
  );
}
