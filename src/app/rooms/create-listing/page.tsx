"use client";
import { Separator } from "~/components/ui/separator";
import VacationHomeForm from "./listingForm";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";


export default function CreateListing() {
  
  return (
    <div className="flex w-full justify-center">
      <Card className="w-[630px]">
        <CardHeader>
          <CardTitle>Unterkunft erstellen</CardTitle>
          <Separator></Separator>
        </CardHeader>
        <CardContent>
          <VacationHomeForm />
        </CardContent>
      </Card>
    </div>
  );
}
