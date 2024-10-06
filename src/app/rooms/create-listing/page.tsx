"use client";
import { Separator } from "~/components/ui/separator";
import VacationHomeForm from "./listingForm";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { useState } from "react";
import { vacationhomeCreateSchema } from "~/app/utils/zod";
import { toast } from "~/hooks/use-toast";

export default function CreateListing() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createVacationHomeMutation = api.vacationhome.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Erfolg",
        description: "Ihre Unterkunft wurde erfolgreich erstellt.",
      });
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: `Fehler beim Erstellen der Unterkunft: ${error.message}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (data: unknown) => {
    setIsSubmitting(true);
    try {
      const validatedData = vacationhomeCreateSchema.parse(data);
      await createVacationHomeMutation.mutateAsync(validatedData);
    } catch (error) {
      console.error("Validierungsfehler:", error);
      toast({
        title: "Validierungsfehler",
        description: "Bitte überprüfen Sie Ihre Eingaben.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  const amenitiesQuery = api.amenities.getAll.useQuery();

  return (
    <div className="flex w-full justify-center">
      <Card className="w-[630px]">
        <CardHeader>
          <CardTitle>Unterkunf erstellen</CardTitle>
          <Separator></Separator>
        </CardHeader>
        <CardContent>
          <VacationHomeForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
