import { ItinerarySlot, RankedActivity } from "./types";

function pickFallback(primary: RankedActivity | undefined, ranked: RankedActivity[]): RankedActivity | null {
  if (!primary) return ranked[0] ?? null;

  const indoorFallback = ranked.find((a) => a.indoorOutdoor === "indoor" && a.id !== primary.id);
  return indoorFallback ?? ranked.find((a) => a.id !== primary.id) ?? null;
}

export function buildItinerary(ranked: RankedActivity[]): ItinerarySlot[] {
  const morning = ranked[0];
  const afternoon = ranked[1] ?? ranked[0];
  const evening = ranked.find((a) => a.timings.includes("evening")) ?? null;

  return [
    { timing: "morning", primary: morning ?? null, fallback: pickFallback(morning, ranked) },
    { timing: "afternoon", primary: afternoon ?? null, fallback: pickFallback(afternoon, ranked) },
    { timing: "evening", primary: evening, fallback: pickFallback(evening ?? undefined, ranked) }
  ];
}
