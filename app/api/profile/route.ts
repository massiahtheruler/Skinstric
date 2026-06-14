import { NextResponse } from "next/server";

const PROFILE_ENDPOINT =
  "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne";

function isValidText(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    !/\d/.test(value) &&
    /^[a-zA-Z\s'.-]+$/.test(value.trim())
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = body?.name;
  const location = body?.location;

  if (!isValidText(name) || !isValidText(location)) {
    return NextResponse.json(
      {
        error:
          "Name and location are required and cannot contain numbers or symbols.",
      },
      { status: 400 },
    );
  }

  const response = await fetch(PROFILE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.trim(),
      location: location.trim(),
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      { error: "Profile submission failed.", details: data },
      { status: response.status },
    );
  }

  return NextResponse.json(data);
}

