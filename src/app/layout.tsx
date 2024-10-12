import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ToastContainer } from "react-toastify";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import MainContainer from "../components/Utility/MainContainer";
import DialogProvider from "~/components/Provider/DialogProvider";

export const metadata: Metadata = {
  title: "LuftNBN",
  description: "Buchungsplattform",
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
            <DialogProvider>{children}</DialogProvider>
            <Footer />
          </MainContainer>
        </TRPCReactProvider>

        <ToastContainer stacked limit={5} />
      </body>
    </html>
  );
}
