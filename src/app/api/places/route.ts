// pages/api/places.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const input = req.nextUrl.searchParams.get("input");
  const types = req.nextUrl.searchParams.get("types") || "address";
  const ipbias = req.nextUrl.searchParams.get("ipbias") || "127.0.0.1";

  if (!input || typeof input !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=${types}&key=${apiKey}&language=de&ipbias=${ipbias}`;

  console.log("url", url);
  try {
    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching place suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 },
    );
  }
}

