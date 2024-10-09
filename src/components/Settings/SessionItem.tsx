import { Session } from "@prisma/client";
import CustomButton from "../Buttons/CustomButton";
import { format } from "date-fns";
import {
  ArrowRightEndOnRectangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { api } from "~/trpc/react";
import { notify } from "~/app/utils/notification";

export default function SessionItem({ session }: { session: Session }) {
  const utils = api.useUtils();
  const closeSession = api.session.closeSession.useMutation({
    onSuccess: () => {
      notify.success("Sitzung erfolgreich geschlossen");
      utils.session.getSessions.invalidate();
    },
    onError: () => {
      notify.error("Fehler beim Schließen der Sitzung");
    },
  });

  return (
    <div
      key={session.id}
      className="mb-3 flex items-center justify-between gap-x-2 rounded-md px-2 py-3 ring-1 ring-gray-200"
    >
      <div className="flex items-center gap-x-2">
        <ArrowRightEndOnRectangleIcon className="mr-2 h-7 w-7 text-gray-400" />
        <div>
          <p className="text-xs">{session.device}</p>
          <p className="text-xs text-gray-400">{session.location}</p>
          <p className="text-xs text-gray-400">
            {format(session.createdAt, "dd.MM.yyyy HH:mm")}
          </p>
        </div>
      </div>
      <CustomButton
        type="button"
        variant="tertiary"
        icon={TrashIcon}
        fullWidth={false}
        onClick={() => closeSession.mutate({ id: session.id })}
      ></CustomButton>
    </div>
  );
}
