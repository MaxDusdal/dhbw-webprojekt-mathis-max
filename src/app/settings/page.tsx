"use client";
import { api, TRPCReactProvider } from "~/trpc/react";
import CreateUserDialog from "../../components/Dialogs/CreateUserDialog";
import Header from "../../components/Layout/Header";
import SectionHeading from "../../components/Layout/SectionHeading";
import UsersTable from "../../components/Tables/AccountTable";
import MainContainer from "../../components/Utility/MainContainer";
import NarrowContainer from "../../components/Utility/NarrowContainer";
import TableHeader from "../../components/Utility/TableHeader";
import { useState } from "react";
import Footer from "../../components/Layout/Footer";

export default function SettingsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const usersQuery = api.user.getUsers.useQuery();

  if (!usersQuery.data) return null;
  return (
    <TRPCReactProvider>
      
      <MainContainer>
          <div className="mt-6 overflow-x-clip py-4 ">
            <TableHeader
              header="Accounts"
              description="Hier können Sie User hinzufügen, bearbeiten und löschen."
              onClick={() => setIsDialogOpen(true)}
              buttonText="Neuer User"
            />
            <UsersTable
              users={usersQuery.data}
              isLoading={usersQuery.isLoading}
            />
            <CreateUserDialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
            />
          </div>
      </MainContainer>
    </TRPCReactProvider>
  );
}
