import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ToastContainer } from "react-toastify";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import { SessionProvider } from "next-auth/react";
import MainContainer from "./components/Utility/MainContainer";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <MainContainer>
            <Header />
            {children}
            <Footer />
          </MainContainer>
        </TRPCReactProvider>

        <ToastContainer stacked limit={5} />
      </body>
    </html>
  );
}
