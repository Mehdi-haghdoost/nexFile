import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import './globals.css'
import ModalManager from "@/components/layouts/Modal/ModalManager";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "NexFile - File Management System",
  description: "Modern file management and collaboration platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
        <Toaster />
        <ModalManager /> 
      </body>
    </html>
  );
}