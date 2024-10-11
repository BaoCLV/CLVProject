import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../providers/NextUiprovider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CLVBAO",
  description: "CLVproject",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* Main content will be wrapped here */}
          {children}
        </Providers>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
