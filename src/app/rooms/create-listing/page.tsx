"use client";
import { useState } from "react";
import QuantitySelector from "./QuantitySelector";
import { Separator } from "~/components/ui/separator";
import VacationHomeForm from "./listingForm";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function CreateListing() {
  const handleSubmit = async (data: any) => {
    // Here you would typically send the data to your API
    console.log(data);
  };

  return (
    <div className="flex w-full justify-center">
      <Card className="w-[630px]">
        <CardHeader>
          <CardTitle>Erstelle ein neues Inserat</CardTitle>
        </CardHeader>
        <CardContent>
          <VacationHomeForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
