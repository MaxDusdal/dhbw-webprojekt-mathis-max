import React, { useState } from "react";
import { Icons } from "~/components/ui/icons";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function PaymentMethod() {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [paymetStatus, setPaymentStatus] = useState("none");

  return (
    <Card className="w-full">
      <CardHeader className="max-[425px]:px-2">
        <CardTitle>Zahlungsmethode</CardTitle>
        <CardDescription>Wähle eine Zahlungsmethode aus.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 max-[425px]:px-2">
        <RadioGroup
          defaultValue="card"
          className="grid grid-cols-3 gap-4"
          onValueChange={(value) => setSelectedMethod(value)}
        >
          <div>
            <RadioGroupItem value="card" id="card" className="peer sr-only" />
            <Label
              htmlFor="card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="mb-3 h-6 w-6"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
              Kreditkarte
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="paypal"
              id="paypal"
              className="peer sr-only"
            />
            <Label
              htmlFor="paypal"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Icons.paypal className="mb-3 h-6 w-6" />
              Paypal
            </Label>
          </div>
          <div>
            <RadioGroupItem value="apple" id="apple" className="peer sr-only" />
            <Label
              htmlFor="apple"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Icons.apple className="mb-3 h-6 w-6" />
              Apple
            </Label>
          </div>
        </RadioGroup>

        {selectedMethod === "card" ? (
          <MethodCard></MethodCard>
        ) : (
          <div className="h-3"></div>
        )}
      </CardContent>
      <CardFooter className="max-[425px]:px-2">
        <Button
          className="w-full"
          onClick={() => {
            setPaymentStatus(selectedMethod);
          }}
        >
          {getButtonContent(selectedMethod)}
        </Button>
      </CardFooter>
    </Card>
  );
}
function getButtonContent(method: string) {
  if (method === "apple") {
    return (
      <>
        <Icons.apple className="mr-4 h-4 w-4" />
        Weiter mit Apple Pay
      </>
    );
  }
  if (method === "paypal") {
    return (
      <>
        <Icons.paypal className="mr-2 h-4 w-4" />
        Weiter mit Paypal
      </>
    );
  }
}

function MethodCard() {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Name des Karteninhabers" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="number">Kartennummer</Label>
        <Input id="number" placeholder="123456789" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="month">Gültig bis</Label>
          <Select>
            <SelectTrigger id="month">
              <SelectValue placeholder="Monat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Januar</SelectItem>
              <SelectItem value="2">Februar</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">Mai</SelectItem>
              <SelectItem value="6">Juni</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">Oktober</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">Dezember</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="year">Jahr</Label>
          <Select>
            <SelectTrigger id="year">
              <SelectValue placeholder="Jahr" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i} value={`${new Date().getFullYear() + i}`}>
                  {new Date().getFullYear() + i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input id="cvc" placeholder="CVC" />
        </div>
      </div>
    </>
  );
}
