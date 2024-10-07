"use client";
import { useState, useEffect, use } from "react";

import UsersTable from "~/components/Tables/AccountTable";
import CustomButton from "~/components/Buttons/CustomButton";
import NarrowContainer from "~/components/Utility/NarrowContainer";
import TableHeader from "~/components/Utility/TableHeader";
import CreateUserDialog from "~/components/Dialogs/CreateUserDialog";
import { api, TRPCReactProvider } from "~/trpc/react";

function BlockingPeriodConfigurationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const usersQuery = api.user.getUsers.useQuery();

  if (!usersQuery.data) return null;
  return (
    <div>
      <div className="overflow-x-clip py-4 lg:pl-20">
        <main className="mx-auto">
          <NarrowContainer>
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
          </NarrowContainer>
        </main>
      </div>
    </div>
  );
}

export default BlockingPeriodConfigurationPage;
