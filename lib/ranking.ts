import { activities } from "./data";
import { RankedActivity, UserCriteria } from "./types";

function budgetToLimit(budget: UserCriteria["budget"]): number {
  if (budget === "low") return 20;
  if (budget === "medium") return 60;
  return 120;
}

function softIntentBoost(title: string, description: string, intent: string): number {
  const text = `${title} ${description}`.toLowerCase();
  const intentLc = intent.toLowerCase();
  let score = 0;

  if (intentLc.includes("relax") && (text.includes("relax") || text.includes("slow") || text.includes("pool"))) {
    score += 1.2;
  }
  if (intentLc.includes("outdoor") && text.includes("outdoor")) {
    score += 1;
  }
  if (intentLc.includes("simple") && (text.includes("easy") || text.includes("low-stress"))) {
    score += 0.8;
  }

  return score;
}

export function rankActivities(criteria: UserCriteria): RankedActivity[] {
  const budgetLimit = budgetToLimit(criteria.budget);

  return activities
    .filter((a) => criteria.childAge >= a.ageMin && criteria.childAge <= a.ageMax)
    .filter((a) => a.durationHours <= criteria.maxDurationHours)
    .filter((a) => a.travelMinutesFromHome <= criteria.maxTravelMinutes)
    .filter((a) => a.timings.includes(criteria.timingOfDay))
    .filter((a) => criteria.indoorOutdoor === "any" || a.indoorOutdoor === criteria.indoorOutdoor || a.indoorOutdoor === "mixed")
    .map((a) => {
      let score = 0;
      const why: string[] = [];

      const budgetPenalty = Math.max(0, a.estimatedCostSgd - budgetLimit) / 15;
      if (a.estimatedCostSgd <= budgetLimit) {
        score += 2;
        why.push("Within budget");
      } else {
        score -= budgetPenalty;
        why.push("Slightly above budget");
      }

      if (a.energyLevel === criteria.energyLevel) {
        score += 2;
        why.push("Matches preferred energy level");
      }

      const travelScore = Math.max(0, (criteria.maxTravelMinutes - a.travelMinutesFromHome) / 15);
      score += travelScore;
      why.push("Travel time fits your limit");

      if (criteria.weatherTolerance === "low" && !a.weatherSensitive) {
        score += 1.5;
        why.push("Good option for uncertain weather");
      }

      if (criteria.weatherTolerance === "high" && a.indoorOutdoor === "outdoor") {
        score += 0.5;
      }

      score += softIntentBoost(a.title, a.description, criteria.freeTextIntent);

      if (a.isEvent) {
        score += 0.4;
        why.push("Date-bound event option");
      } else {
        why.push("Reliable evergreen option");
      }

      return { ...a, score: Number(score.toFixed(2)), why };
    })
    .sort((a, b) => b.score - a.score);
}
