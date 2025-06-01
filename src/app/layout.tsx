import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/authProvider";
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Anonova – Anonymous Feedback & Confessions App",
  description: "Collect honest feedback, confessions, and messages anonymously with Anonova. Create your unique link and connect with your audience in a fun, safe way.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        <AuthProvider>
        {children}
        <Analytics/>
        <Toaster/>
        </AuthProvider>
      </body>
    </html>
  );
}
