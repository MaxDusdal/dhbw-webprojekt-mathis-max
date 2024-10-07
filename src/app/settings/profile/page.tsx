import ChangePasswordForm from "~/components/Forms/ChangePasswordForm";
import CloseSessionsForm from "~/components/Forms/CloseSessionsForm";
import DeleteUserForm from "~/components/Forms/DeleteUserForm";
import UserProfileForm from "~/components/Forms/UserProfileForm";

export default function ProfilePage() {
  return (
    <main>
      <h1 className="sr-only">Account-Einstellungen</h1>

      {/* Settings forms */}
      <div className="divide-y divide-white/5">
        <UserProfileForm />

        <ChangePasswordForm />

        <CloseSessionsForm />

        <DeleteUserForm />
      </div>
    </main>
  );
}
