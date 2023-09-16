import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vasco",
  description: "A Farcaster explorer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics
          beforeSend={(event) => {
            const url = new URL(event.url);
            url.searchParams.delete("compare");
            return {
              ...event,
              url: url.toString(),
            };
          }}
        />
      </body>
    </html>
  );
}
