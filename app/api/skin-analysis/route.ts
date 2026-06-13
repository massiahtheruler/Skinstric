import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    concerns: [
      {
        id: "hydration",
        label: "Hydration",
        score: 82,
      },
      {
        id: "texture",
        label: "Texture",
        score: 74,
      },
      {
        id: "sensitivity",
        label: "Sensitivity",
        score: 61,
      },
    ],
  });
}
