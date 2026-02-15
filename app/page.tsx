"use client";

import { useState } from "react";
import { ItinerarySlot, RankedActivity, UserCriteria } from "@/lib/types";

type ApiResponse = {
  ranked: RankedActivity[];
  itinerary: ItinerarySlot[];
};

const initialCriteria: UserCriteria = {
  freeTextIntent: "simple and relaxing outdoor activity",
  weekendDate: "",
  indoorOutdoor: "outdoor",
  budget: "medium",
  maxDurationHours: 3,
  energyLevel: "low",
  maxTravelMinutes: 40,
  weatherTolerance: "medium",
  timingOfDay: "morning",
  childAge: 5
};

export default function HomePage() {
  const [criteria, setCriteria] = useState<UserCriteria>(initialCriteria);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function getRecommendations() {
    setLoading(true);
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(criteria)
    });
    const json = (await res.json()) as ApiResponse;
    setData(json);
    setLoading(false);
  }

  return (
    <main>
      <h1>Singapore Weekend Planner</h1>
      <p>AI-assisted activity ranking for your 5-year-old, with itinerary and fallback suggestions.</p>

      <div className="grid">
        <section className="card">
          <h3>Preferences</h3>
          <div className="row">
            <div>
              <label>Weekend date</label>
              <input
                type="date"
                value={criteria.weekendDate}
                onChange={(e) => setCriteria({ ...criteria, weekendDate: e.target.value })}
              />
            </div>
            <div>
              <label>Free text intent</label>
              <input
                value={criteria.freeTextIntent}
                onChange={(e) => setCriteria({ ...criteria, freeTextIntent: e.target.value })}
              />
            </div>
          </div>

          <div className="row">
            <div>
              <label>Indoor / Outdoor</label>
              <select
                value={criteria.indoorOutdoor}
                onChange={(e) => setCriteria({ ...criteria, indoorOutdoor: e.target.value as UserCriteria["indoorOutdoor"] })}
              >
                <option value="any">Any</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label>Budget</label>
              <select value={criteria.budget} onChange={(e) => setCriteria({ ...criteria, budget: e.target.value as UserCriteria["budget"] })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div>
              <label>Max duration (hours)</label>
              <input
                type="number"
                min={1}
                max={8}
                value={criteria.maxDurationHours}
                onChange={(e) => setCriteria({ ...criteria, maxDurationHours: Number(e.target.value) })}
              />
            </div>
            <div>
              <label>Energy level</label>
              <select
                value={criteria.energyLevel}
                onChange={(e) => setCriteria({ ...criteria, energyLevel: e.target.value as UserCriteria["energyLevel"] })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div>
              <label>Max travel (minutes)</label>
              <input
                type="number"
                min={5}
                max={90}
                value={criteria.maxTravelMinutes}
                onChange={(e) => setCriteria({ ...criteria, maxTravelMinutes: Number(e.target.value) })}
              />
            </div>
            <div>
              <label>Weather tolerance</label>
              <select
                value={criteria.weatherTolerance}
                onChange={(e) => setCriteria({ ...criteria, weatherTolerance: e.target.value as UserCriteria["weatherTolerance"] })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div>
              <label>Preferred time</label>
              <select
                value={criteria.timingOfDay}
                onChange={(e) => setCriteria({ ...criteria, timingOfDay: e.target.value as UserCriteria["timingOfDay"] })}
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            <div>
              <label>Child age</label>
              <input
                type="number"
                min={1}
                max={14}
                value={criteria.childAge}
                onChange={(e) => setCriteria({ ...criteria, childAge: Number(e.target.value) })}
              />
            </div>
          </div>

          <button onClick={getRecommendations} disabled={loading}>
            {loading ? "Generating..." : "Get recommendations"}
          </button>
          <p className="small">AI reranking activates automatically when `OPENAI_API_KEY` is configured.</p>
        </section>

        <section className="card">
          <h3>Top Recommendations</h3>
          {!data?.ranked?.length && <p className="small">Run the planner to see ranked options.</p>}
          {data?.ranked?.slice(0, 5).map((item) => (
            <div className="result" key={item.id}>
              <strong>{item.title}</strong>
              <div className="small">
                Score: {item.score} | {item.area} | ${item.estimatedCostSgd} | {item.durationHours}h
              </div>
              <div className="small">{item.why.join(" • ")}</div>
            </div>
          ))}

          <h3>Itinerary (with fallback)</h3>
          {!data?.itinerary?.length && <p className="small">No itinerary yet.</p>}
          {data?.itinerary?.map((slot) => (
            <div className="result" key={slot.timing}>
              <strong>{slot.timing.toUpperCase()}</strong>
              <div className="small">Primary: {slot.primary?.title ?? "No match"}</div>
              <div className="small">Fallback: {slot.fallback?.title ?? "No fallback"}</div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
