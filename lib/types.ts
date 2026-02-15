export type IndoorOutdoor = "indoor" | "outdoor" | "mixed";
export type EnergyLevel = "low" | "medium" | "high";
export type TimingOfDay = "morning" | "afternoon" | "evening";

export type BudgetBand = "low" | "medium" | "high";

export type Activity = {
  id: string;
  title: string;
  category: string;
  description: string;
  indoorOutdoor: IndoorOutdoor;
  energyLevel: EnergyLevel;
  ageMin: number;
  ageMax: number;
  durationHours: number;
  estimatedCostSgd: number;
  weatherSensitive: boolean;
  timings: TimingOfDay[];
  area: string;
  travelMinutesFromHome: number;
  isEvent: boolean;
  sourceUrl: string;
};

export type UserCriteria = {
  freeTextIntent: string;
  weekendDate: string;
  indoorOutdoor: "any" | IndoorOutdoor;
  budget: BudgetBand;
  maxDurationHours: number;
  energyLevel: EnergyLevel;
  maxTravelMinutes: number;
  weatherTolerance: "low" | "medium" | "high";
  timingOfDay: TimingOfDay;
  childAge: number;
};

export type RankedActivity = Activity & {
  score: number;
  why: string[];
};

export type ItinerarySlot = {
  timing: TimingOfDay;
  primary: RankedActivity | null;
  fallback: RankedActivity | null;
};
