import { PlusCircleIcon } from "@heroicons/react/24/outline";
import CustomButton from "../Buttons/CustomButton";
import InputDialog from "@/components/Dialogs/InputDialog";
import { userCreateSchema } from "@/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import InputField from "@/components/Inputs/InputField";
import InputFieldWrapper from "../Inputs/InputFieldWrapper";
import { api } from "~/trpc/react";

type FormValues = z.infer<typeof userCreateSchema>;

export default function CreateUserDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const schema = userCreateSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      email: "",
      role: "USER",
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
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    try {
      mutation.mutate(data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

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
            <CustomButton onClick={onClose} type="button" variant="secondary">
              Abbrechen
            </CustomButton>
            <CustomButton type="submit" variant="primary">
              Erstellen
            </CustomButton>
          </div>
        }
      >
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

        <InputFieldWrapper label="Rolle" id="role">
          <select
            name="role"
            id="role"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            defaultValue="USER"
            required
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </InputFieldWrapper>
      </InputDialog>
    </>
  );
}
