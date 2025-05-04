import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientBody } from "./ClientBody";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "K&S Enterprises - Professional Garden & Power Tools",
  description: "K&S Enterprises - Manufacturers and suppliers of high-quality garden tools, power tools, and robotic lawn mowers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientBody>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientBody>
      </body>
    </html>
  );
}
