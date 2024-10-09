"use client";
import Header from "~/components/Layout/Header";
import SectionHeading from "~/components/Layout/SectionHeading";
import MainContainer from "~/components/Utility/MainContainer";
import { api, TRPCReactProvider } from "~/trpc/react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const getCallerUser = api.user.getCallerUser.useQuery();

  return (  
    <TRPCReactProvider>
      <SectionHeading
        header="Settings"
        tabs={[
          {
            name: "Ihre Inserate",
            href: "/account/rooms",
          },
          {
            name: "Ihre Buchungen",
            href: "/account/bookings",
          },
          {
            name: "Ihr Profil",
            href: "/account/profile",
          },
          getCallerUser.data?.role === "ADMIN" ? { 
            name: "Admin-Panel",
            href: "/account/admin-panel",
          } : null,
        ]}
        actions={[]}
      />
      <MainContainer>{children}</MainContainer>
    </TRPCReactProvider>
  );
}
