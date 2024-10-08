import { PlusCircleIcon } from "@heroicons/react/24/outline";
import CustomButton from "../Buttons/CustomButton";
import InputDialog from "~/components/Dialogs/InputDialog";
import { userCreateSchema } from "@/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type z } from "zod";
import { useEffect } from "react";
import InputField from "~/components/Inputs/InputField";
import InputFieldWrapper from "../Inputs/InputFieldWrapper";
import { api } from "~/trpc/react";
import { notify } from "~/app/utils/notification";

type FormValues = z.infer<typeof userCreateSchema>;

export default function CreateUserDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const schema = userCreateSchema;
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      email: "",
      role: "USER",
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const mutation = api.user.create.useMutation({
    onSuccess: () => {
      onClose();
      utils.user.invalidate();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    try {
      const promise = mutation.mutateAsync(data);
      notify.promise(promise, {
        pending: "User wird erstellt...",
        success: "User erfolgreich erstellt",
        error: "Fehler beim Erstellen des Users",
      });
      await promise;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  async function isValid() {
    const isValid = await trigger();
    console.log("isValid", isValid);
    console.log("errors", errors);
    return isValid;
  }

  return (
    <>
      <InputDialog
        error={mutation.error?.message}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}
        icon={PlusCircleIcon}
        title="Neuer User"
        description="Mit Hilfe dieser Funktion können Sie einen neuen User erstellen."
        actions={
          <div className="flex justify-end space-x-4">
            <CustomButton onClick={isValid} type="button" variant="secondary">
              Abbrechen
            </CustomButton>
            <CustomButton type="submit" variant="primary">
              Erstellen
            </CustomButton>
          </div>
        }
      >
        <InputFieldWrapper label="Vorname" id="firstName">
          <InputField
            id="firstName"
            name="firstName"
            register={register}
            placeholder="Vorname"
            required
            error={errors.firstName}
          />
        </InputFieldWrapper>

        <InputFieldWrapper label="Nachname" id="lastName">
          <InputField
            id="lastName"
            name="lastName"
            register={register}
            placeholder="Nachname"
            required
            error={errors.lastName}
          />
        </InputFieldWrapper>
        <InputFieldWrapper label="E-Mail" id="email">
          <InputField
            id="email"
            name="email"
            register={register}
            placeholder="E-Mail"
            required
            error={errors.email}
          />
        </InputFieldWrapper>
        <InputFieldWrapper label="Passwort" id="password">
          <InputField
            id="password"
            type="password"
            name="password"
            register={register}
            placeholder="Passwort"
            required
            error={errors.password}
          />
        </InputFieldWrapper>

        <InputFieldWrapper label="Rolle" id="role">
          <select
            {...register("role")}
            id="role"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </InputFieldWrapper>
      </InputDialog>
    </>
  );
}
