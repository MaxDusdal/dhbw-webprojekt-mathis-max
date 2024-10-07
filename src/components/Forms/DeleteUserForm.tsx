"use client";

import { api } from "~/trpc/react";
import CustomButton from "../Buttons/CustomButton";
import useDialogStore from "~/stores/dialogStore";
import { notify } from "~/app/utils/notification";

export default function DeleteUserForm() {
  const { showDialog } = useDialogStore();

  const mutation = api.user.deleteUser.useMutation({
    onSuccess: () => {
      notify.success(
        "Account erfolgreich gelöscht, sie werden automatisch ausgeloggt",
      );
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showDialog(
      "destructive",
      "Account löschen",
      "confirmation",
      "Möchten Sie unseren Service nicht mehr nutzen? Sie können Ihren Account hier löschen. Diese Aktion ist nicht umkehrbar. Alle Informationen, die zu diesem Account gehören, werden dauerhaft und unverzüglich gelöscht.",
      () => {
        mutation.mutate();
      },
    );
  };

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-black">
          Account löschen
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          Möchten Sie unseren Service nicht mehr nutzen? Sie können Ihren
          Account hier löschen. Diese Aktion ist nicht umkehrbar. Alle
          Informationen, die zu diesem Account gehören, werden dauerhaft und
          unverzüglich gelöscht.
        </p>
      </div>

      <form className="flex items-start md:col-span-2" onSubmit={onSubmit}>
        <CustomButton type="submit" variant="warning" fullWidth={false}>
          Ja, lösche meinen Account
        </CustomButton>
      </form>
    </div>
  );
}
