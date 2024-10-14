"use client";
import { api, TRPCReactProvider } from "~/trpc/react";
import CreateUserDialog from "../../../components/Dialogs/CreateUserDialog";
import UsersTable from "../../../components/Tables/AccountTable";
import TableHeader from "../../../components/Utility/TableHeader";
import { useState } from "react";

export default function SettingsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const getCallerUser = api.user.getCallerUser.useQuery();

  const usersQuery = api.user.getUsers.useQuery();

  if (getCallerUser.data?.role !== "ADMIN") {
    return <div>You are not authorized to access this page</div>;
  }
  if (!usersQuery.data) return null;
  return (
    <main>
      <h1 className="sr-only">Account-Einstellungen</h1>

      {/* Settings forms */}
      <div className="mt-8 divide-y divide-white/5">
        <TableHeader
          header="Accounts"
          description="Hier können Sie User hinzufügen, bearbeiten und löschen."
          onClick={() => setIsDialogOpen(true)}
          buttonText="Neuer User"
        />
        <UsersTable users={usersQuery.data} isLoading={usersQuery.isLoading} />
        <CreateUserDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </main>
  );
}
