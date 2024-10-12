import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Overview from "./overview";
import { RecentSales } from "./recent-sales";

import { floor } from "lodash";
import { Booking, User } from "@prisma/client";
import { format, getYear, setDate } from "date-fns";
import { Data } from "@react-google-maps/api";
import {
  Calendar,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { date } from "zod";
import { cn } from "~/lib/utils";

interface OverviewProps {
  monthlyEarnings: number[];
  bestMonth: number;
}
interface recentBooking {
  id: string;
  user: {
    name: string;
    email: string;
  };
  price: number;
  createdAt: string;
}

type Props = {
  data: {
    totalEarnings: number;
    currentMonthEarnings: number;
    previousMonthEarnings: number;
    monthEarningsComparison: string;
    totalBookings: number;
    openBookings: number;
    newMonthlyBookings: number;
    overview: OverviewProps;
    recentBookings: recentBooking[];
  };
  overviewYearHook: {
    year: number;
    setYear: (year: number) => void;
  };
};

export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function Dashboard({ data, overviewYearHook }: Props) {
  return (
    <>
      <div className="flex-1 space-y-4 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>Download</Button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Einnahmen Insgesamt
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.totalEarnings) + "€"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {`~ ${formatNumber(floor(data.totalEarnings / data.totalBookings))}€ pro Buchung`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Buchungen Instegamt
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.totalBookings)}
                </div>
                <p className="text-xs text-muted-foreground">{`+${formatNumber(data.newMonthlyBookings)} diesen Monat`}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Einnahmen aktueller Monat
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.currentMonthEarnings) + "€"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.monthEarningsComparison}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Offene Buchungen
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.openBookings)}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 min-[975px]:grid-cols-7">
            <Card className="min-[975px]:col-span-4">
              <CardHeader>
                <div className="flex w-full justify-between">
                  <CardTitle>Overview</CardTitle>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-24 justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {overviewYearHook.year}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-24 p-0">
                      <div className="flex justify-center space-x-5 p-1">
                        <Button
                          variant={"outline"}
                          onClick={() => {
                            overviewYearHook.setYear(overviewYearHook.year - 1);
                          }}
                          className="h-7 w-7 cursor-pointer bg-transparent p-1 opacity-50 hover:opacity-100"
                        >
                          <ChevronLeft></ChevronLeft>
                        </Button>

                        <Button
                          variant={"outline"}
                          onClick={() => {
                            overviewYearHook.setYear(overviewYearHook.year + 1);
                          }}
                          className="h-7 w-7 cursor-pointer bg-transparent p-1 opacity-50 hover:opacity-100"
                          disabled={
                            overviewYearHook.year >= getYear(new Date())
                          }
                        >
                          <ChevronRight></ChevronRight>
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview
                  monthlyEarnings={data.overview.monthlyEarnings}
                  bestMonth={data.overview.bestMonth}
                />
              </CardContent>
            </Card>
            <Card className="min-[975px]:col-span-3">
              <CardHeader>
                <CardTitle>Neuste Buchungen</CardTitle>
                <CardDescription>
                  {`Du hast diesen Monat ${data.newMonthlyBookings} Buchungen bekommen.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales bookings={data.recentBookings} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
