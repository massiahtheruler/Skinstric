import { NextResponse } from "next/server";
import { normalizeAnalysisResponse } from "@/lib/skinstricAnalysis";

const ANALYSIS_ENDPOINT =
  "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const image = body?.Image ?? body?.image;

  if (typeof image !== "string" || image.trim().length === 0) {
    return NextResponse.json(
      { error: "Image must be a base64 string." },
      { status: 400 },
    );
  }

  const response = await fetch(ANALYSIS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Image: image, image }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      { error: "Image analysis failed.", details: data },
      { status: response.status },
    );
  }

  return NextResponse.json({
    ...data,
    normalizedData: normalizeAnalysisResponse(data),
  });
}
