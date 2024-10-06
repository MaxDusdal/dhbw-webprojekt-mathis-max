import Header from "~/components/Layout/Header";
import SectionHeading from "~/components/Layout/SectionHeading";
import MainContainer from "~/components/Utility/MainContainer";
import { TRPCReactProvider } from "~/trpc/react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      <SectionHeading
        header="Settings"
        tabs={[
          {
            name: "General",
            href: "/settings",
          },
          {
            name: "API",
            href: "#",
          },
          {
            name: "Users",
            href: "#",
          },
        ]}
        actions={[]}
      />
      <MainContainer>{children}</MainContainer>
    </TRPCReactProvider>
  );
}
