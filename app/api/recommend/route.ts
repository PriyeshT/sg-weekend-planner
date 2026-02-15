import { NextResponse } from "next/server";
import { rerankWithAI } from "@/lib/ai";
import { buildItinerary } from "@/lib/itinerary";
import { rankActivities } from "@/lib/ranking";
import { UserCriteria } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const criteria = (await request.json()) as UserCriteria;
    const ranked = rankActivities(criteria);
    const aiRanked = await rerankWithAI({ criteria, ranked });
    const itinerary = buildItinerary(aiRanked);

    return NextResponse.json({ ranked: aiRanked, itinerary });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to build recommendations",
        details: error instanceof Error ? error.message : "unknown"
      },
      { status: 400 }
    );
  }
}
