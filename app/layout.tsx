import { GeistSans } from "geist/font/sans";
import "./globals.css";


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/all`
  : "http://localhost:8888/all";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Lost & Found",
  description: "The fastest way to build apps with Next.js and Supabase",
  icons: {
    icon: '/app_images/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="w-screen flex flex-col items-center h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
