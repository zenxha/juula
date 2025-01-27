import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Juula",
  description: "A simple IPTV player",
  // image: "https::/catbox.moe/pictures/2F1486346829409.png&w=256&q=75"
};



export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
