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
 
  return (
    <div className="flex w-full justify-center">
      <Card className="w-[630px]">
        <CardHeader>
          <CardTitle>Unterkunf erstellen</CardTitle>
          <Separator></Separator>
        </CardHeader>
        <CardContent>
          <VacationHomeForm />
        </CardContent>
      </Card>
    </div>
  );
}
