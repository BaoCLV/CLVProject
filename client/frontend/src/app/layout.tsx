import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../providers/NextUiprovider";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Loading from "../shared/components/Loading"; // Create or import a Loading component

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
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </Providers>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
